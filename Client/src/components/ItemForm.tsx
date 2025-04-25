import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
  Unlock,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Password } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ItemFormProps {
  mode: "add" | "edit";
  initialData?: Partial<Password>;
  onSubmit: (data: Partial<Password>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  submitSuccess?: boolean;
}

export function ItemForm({
  mode,
  initialData,
  onSubmit,
  isLoading,
  error,
  submitSuccess,
}: ItemFormProps) {
  const [type, setType] = useState<"login" | "card" | "note">(
    initialData?.category === "Card"
      ? "card"
      : initialData?.category === "Secure Note"
      ? "note"
      : "login"
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [encryptedPassword, setEncryptedPassword] = useState(
    initialData?.encryptedPassword || ""
  );
  const [website, setWebsite] = useState(initialData?.website || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  );
  const { getMasterPassword } = useAuth();

  // Form validation states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(
    null
  );
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // If we're in edit mode and receive initialData, use the encrypted password
  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Keep the encrypted password for submission
      setEncryptedPassword(initialData.encryptedPassword || "");
      // Set password field to show the encrypted password by default
      setPassword(initialData.password || "");
    }
  }, [mode, initialData]);

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
    setPasswordFieldError(null);
  };

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    }

    if (type === "login" && !username.trim()) {
      setUsernameError("Username/Email is required");
      isValid = false;
    }

    if (type === "login" && !password) {
      setPasswordFieldError("Password is required for login items");
      isValid = false;
    }

    if (website && type === "login") {
      if (!website.startsWith("http://") && !website.startsWith("https://")) {
        setWebsiteError("Website should start with http:// or https://");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const category =
      type === "login" ? "Login" : type === "card" ? "Card" : "Secure Note";

    await onSubmit({
      title,
      username,
      password: decryptedPassword || password,
      website: type === "login" ? website : "",
      notes: notes || "",
      category,
      encryptedPassword,
    });
  };

  const handleDecrypt = async () => {
    try {
      const masterPassword = getMasterPassword();
      if (!masterPassword) {
        toast.error("Master password not available");
        return;
      }

      // Only try to decrypt if we have a password to decrypt
      if (!password) {
        toast.error("No password to decrypt");
        return;
      }

      const { decryptPassword } = await import("@/lib/crypto");
      try {
        const decrypted = await decryptPassword(password, masterPassword);
        setDecryptedPassword(decrypted);
        setShowPassword(true);
        toast.success("Password decrypted!");
      } catch (error) {
        console.error("Decryption error:", error);
        toast.error(
          "Failed to decrypt password. Make sure you have the correct master password."
        );
      }
    } catch (error) {
      console.error("Decryption error:", error);
      toast.error("Failed to decrypt password");
    }
  };

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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Item {mode === "add" ? "added" : "updated"} successfully!
              Redirecting to vault...
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">
              {mode === "add" ? "Add New Item" : "Edit Item"}
            </CardTitle>
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
                      <Key className="mr-2 h-4 w-4 text-blue-500" />
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
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(null);
                  }}
                  placeholder="My Account"
                  className={`${
                    titleError ? "border-red-500" : ""
                  } bg-background`}
                />
                {titleError && (
                  <p className="text-sm text-red-500">{titleError}</p>
                )}
              </div>

              {type === "login" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username / Email</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError(null);
                      }}
                      placeholder="john.doe@example.com"
                      className={`${
                        usernameError ? "border-red-500" : ""
                      } bg-background`}
                    />
                    {usernameError && (
                      <p className="text-sm text-red-500">{usernameError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={decryptedPassword || password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setDecryptedPassword(null);
                          setPasswordFieldError(null);
                        }}
                        placeholder="Enter a strong password"
                        className={`pr-20 bg-background ${
                          passwordFieldError ? "border-red-500" : ""
                        }`}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                        {mode === "edit" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleDecrypt}
                            title="Decrypt password"
                          >
                            <Unlock className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Decrypt password</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
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
                    {passwordFieldError && (
                      <p className="text-sm text-red-500">
                        {passwordFieldError}
                      </p>
                    )}
                    <div className="pt-2">
                      <PasswordGenerator
                        onPasswordGenerated={handleGeneratedPassword}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => {
                          setWebsite(e.target.value);
                          setWebsiteError(null);
                        }}
                        placeholder="https://example.com"
                        className={`${
                          websiteError ? "border-red-500" : ""
                        } bg-background`}
                      />
                    </div>
                    {websiteError && (
                      <p className="text-sm text-red-500">{websiteError}</p>
                    )}
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
                  rows={4}
                  className="min-h-[100px] resize-none bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? mode === "add"
                    ? "Adding item..."
                    : "Saving changes..."
                  : mode === "add"
                  ? "Add Item"
                  : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
