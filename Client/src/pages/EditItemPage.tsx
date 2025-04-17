import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Globe,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updatePassword } from "@/redux/slices/passwordSlice";
import apiClient from "@/api/api";
import { encryptPassword } from "@/lib/crypto";
import { Password } from "@/types";

export default function EditItemPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, getMasterPassword } = useAuth();

  const passwords = useSelector(
    (state: RootState) => state.passwords.passwords
  );
  const isLoading = useSelector(
    (state: RootState) => state.passwords.isLoading
  );

  const [type, setType] = useState<"login" | "card" | "note">("login");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if user is authenticated and load item data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load password item data if we have an ID
    if (id && passwords.length > 0) {
      const passwordItem = passwords.find((item) => String(item.id) === id);

      if (passwordItem) {
        // Determine type based on category
        let itemType: "login" | "card" | "note" = "login";
        if (passwordItem.category === "Card") {
          itemType = "card";
        } else if (passwordItem.category === "Secure Note") {
          itemType = "note";
        }

        setType(itemType);
        setTitle(passwordItem.title);
        setUsername(passwordItem.username || "");
        setPassword(passwordItem.password || "");
        setWebsite(passwordItem.website || "");
        setNotes(passwordItem.notes || "");
        setInitialLoading(false);
      } else {
        // Password not found, redirect back to dashboard
        navigate("/dashboard");
      }
    } else if (passwords.length === 0) {
      // No passwords loaded yet, will try to fetch from API
      apiClient
        .get(`/passwords/${id}`)
        .then((response) => {
          const passwordItem = response.data;

          // Determine type based on category
          let itemType: "login" | "card" | "note" = "login";
          if (passwordItem.category === "Card") {
            itemType = "card";
          } else if (passwordItem.category === "Secure Note") {
            itemType = "note";
          }

          setType(itemType);
          setTitle(passwordItem.title);
          setUsername(passwordItem.username || "");

          // Decrypt password using master key
          const masterKey = getMasterPassword();
          if (masterKey && passwordItem.encryptedPassword) {
            import("@/lib/crypto").then(({ decryptPassword }) => {
              decryptPassword(passwordItem.encryptedPassword, masterKey)
                .then((decrypted) => {
                  setPassword(decrypted);
                })
                .catch((err) => {
                  console.error("Failed to decrypt password:", err);
                });
            });
          } else {
            setPassword(passwordItem.password || "");
          }

          setWebsite(passwordItem.website || "");
          setNotes(passwordItem.notes || "");
          setInitialLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch password:", error);
          navigate("/dashboard");
        });
    }
  }, [id, isAuthenticated, navigate, passwords, getMasterPassword]);

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!id) {
        throw new Error("Password ID is missing");
      }

      // Create password category based on item type
      const category =
        type === "login" ? "Login" : type === "card" ? "Card" : "Secure Note";

      // Get the master key for encryption
      const masterKey = getMasterPassword();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      // Encrypt the password before sending to server
      const encryptedPassword = await encryptPassword(password, masterKey);

      // Prepare the updated data
      const passwordData: Partial<Password> = {
        title,
        username,
        website: type === "login" ? website : "",
        notes: notes || undefined,
        category,
        updatedAt: new Date().toISOString(),
      };

      // Send to API
      const response = await apiClient.put(`/passwords/${id}`, {
        ...passwordData,
        encryptedPassword,
        // Don't send plaintext password to server
        password: undefined,
      });

      // Update Redux store with the updated password
      dispatch(
        updatePassword({
          ...response.data,
          // Keep plaintext password in local state only
          password,
        })
      );

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium">Loading item data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/dashboard" className="flex items-center text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vault
            </Link>
          </Button>
        </div>

        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit Item</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <RadioGroup
                  value={type}
                  onValueChange={(value) =>
                    setType(value as "login" | "card" | "note")
                  }
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="login" id="login" />
                    <Label
                      htmlFor="login"
                      className="flex cursor-pointer items-center"
                    >
                      <Globe className="mr-2 h-4 w-4 text-blue-500" />
                      Login
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex cursor-pointer items-center"
                    >
                      <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                      Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="note" id="note" />
                    <Label
                      htmlFor="note"
                      className="flex cursor-pointer items-center"
                    >
                      <FileText className="mr-2 h-4 w-4 text-yellow-500" />
                      Secure Note
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              {type === "login" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                          const passwordGeneratorDialog =
                            document.getElementById(
                              "password-generator-dialog"
                            );
                          if (
                            passwordGeneratorDialog instanceof HTMLDialogElement
                          ) {
                            passwordGeneratorDialog.showModal();
                          }
                        }}
                      >
                        <Key className="mr-1 h-3 w-3 text-blue-500" />
                        Generate
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={type === "login"}
                        className="pr-10 bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <Input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="bg-background"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional information here..."
                  className="min-h-[120px] resize-none bg-background"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || isLoading}
              >
                {loading || isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Password Generator Dialog */}
        <dialog
          id="password-generator-dialog"
          className="rounded-lg shadow-lg p-0"
        >
          <div className="p-4 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Password Generator</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const dialog = document.getElementById(
                    "password-generator-dialog"
                  );
                  if (dialog instanceof HTMLDialogElement) {
                    dialog.close();
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <PasswordGenerator
              onPasswordGenerated={handleGeneratedPassword}
              onClose={() => {
                const dialog = document.getElementById(
                  "password-generator-dialog"
                );
                if (dialog instanceof HTMLDialogElement) {
                  dialog.close();
                }
              }}
            />
          </div>
        </dialog>
      </div>
    </div>
  );
}
