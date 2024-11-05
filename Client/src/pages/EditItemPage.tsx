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
import { encrypt, decrypt } from "@/lib/encryption";
import { PasswordGenerator } from "@/components/PasswordGenerator";

// Define PasswordItem interface
interface PasswordItem {
  id: string;
  type: "login" | "card" | "note";
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditItemPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<"login" | "card" | "note">("login");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [masterKey, setMasterKey] = useState("");

  // Check if user is authenticated and load item data
  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    async function loadItemData() {
      try {
        // Get user data and master key
        const userData = localStorage.getItem("userData");
        if (!userData) {
          navigate("/login");
          return;
        }

        const { masterKey: key } = JSON.parse(userData);
        setMasterKey(key);

        // Get passwords from storage
        const storedPasswords = localStorage.getItem("passwords");
        if (!storedPasswords) {
          navigate("/dashboard");
          return;
        }

        // Find the specific password item
        const passwords = JSON.parse(storedPasswords) as PasswordItem[];
        const item = passwords.find((p) => p.id === id);

        if (!item) {
          navigate("/dashboard");
          return;
        }

        // Set form data
        setType(item.type || "login");
        setTitle(item.title);
        setUsername(item.username);
        setOriginalPassword(item.password); // Store encrypted password
        setWebsite(item.website || "");
        setNotes(item.notes || "");

        // Try to decrypt the password
        try {
          const decryptedPassword = await decrypt(item.password, key);
          setPassword(decryptedPassword);
        } catch (err) {
          console.error("Failed to decrypt password:", err);
          // Keep password field empty if decryption fails
        }
      } catch (err) {
        console.error("Failed to load item data:", err);
        navigate("/dashboard");
      } finally {
        setInitialLoading(false);
      }
    }

    loadItemData();
  }, [id, navigate]);

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current passwords
      const storedPasswords = localStorage.getItem("passwords");
      if (!storedPasswords) {
        throw new Error("No passwords found");
      }

      const passwords = JSON.parse(storedPasswords) as PasswordItem[];
      const itemIndex = passwords.findIndex((p) => p.id === id);

      if (itemIndex === -1) {
        throw new Error("Password item not found");
      }

      // Determine if we need to re-encrypt the password
      let encryptedPassword = originalPassword;

      // Only re-encrypt if password changed
      if (password && password !== originalPassword) {
        encryptedPassword = await encrypt(password, masterKey);
      }

      // Update the item
      const updatedItem: PasswordItem = {
        ...passwords[itemIndex],
        type,
        title,
        username,
        password: encryptedPassword,
        website: type === "login" ? website : "",
        notes,
        updatedAt: new Date().toISOString(),
      };

      // Update array
      passwords[itemIndex] = updatedItem;

      // Save updated passwords back to localStorage
      localStorage.setItem("passwords", JSON.stringify(passwords));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update item:", err);
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
    <div className="container mx-auto max-w-2xl py-8 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Item Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) =>
                  setType(value as "login" | "card" | "note")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="login" id="login" />
                  <Label
                    htmlFor="login"
                    className="flex items-center cursor-pointer"
                  >
                    <Globe className="mr-2 h-4 w-4 text-blue-500" />
                    Login
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                    Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="note" id="note" />
                  <Label
                    htmlFor="note"
                    className="flex items-center cursor-pointer"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                        const passwordGeneratorDialog = document.getElementById(
                          "password-generator-dialog"
                        );
                        if (
                          passwordGeneratorDialog instanceof HTMLDialogElement
                        ) {
                          passwordGeneratorDialog.showModal();
                        }
                      }}
                    >
                      <Key className="mr-1 h-3 w-3" />
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
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <PasswordGenerator onPasswordGenerated={handleGeneratedPassword} />
    </div>
  );
}
