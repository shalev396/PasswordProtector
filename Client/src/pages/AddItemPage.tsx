import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { usePasswords } from "@/hooks/usePasswords";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Password } from "@/types";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken, isTokenValid, ensureAuthHeader } =
    useAuth();
  const {
    addPassword,
    isLoading: passwordsLoading,
    error: passwordError,
  } = usePasswords();

  const [type, setType] = useState<"login" | "card" | "note">("login");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form validation states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(
    null
  );
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, user, accessToken, isTokenValid]);

  // Update error from the hook
  useEffect(() => {
    if (passwordError) {
      setError(passwordError);
    }
  }, [passwordError]);

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
    setPasswordFieldError(null); // Clear password error when a new password is generated
  };

  const validateForm = () => {
    // Reset previous errors
    setError(null);
    setTitleError(null);
    setUsernameError(null);
    setPasswordFieldError(null);
    setWebsiteError(null);

    let isValid = true;

    // Title is required
    if (!title.trim()) {
      setTitleError("Title is required");
      console.error("Form validation failed: Title is required");
      isValid = false;
    }

    // Username is required for login type
    if (type === "login" && !username.trim()) {
      setUsernameError("Username/Email is required");
      console.error("Form validation failed: Username is required");
      isValid = false;
    }

    // Password is required for login type
    if (type === "login" && !password) {
      setPasswordFieldError("Password is required for login items");
      console.error("Form validation failed: Password is required");
      isValid = false;
    }

    // If website is provided, ensure it's a valid URL
    if (website && type === "login") {
      try {
        // Simple validation - just check if URL is potentially valid
        if (!website.startsWith("http://") && !website.startsWith("https://")) {
          setWebsiteError("Website should start with http:// or https://");
          console.error("Form validation failed: Invalid website URL");
          isValid = false;
        }
      } catch (e) {
        setWebsiteError("Please enter a valid website URL");
        console.error("Form validation failed: Website URL error", e);
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      // Check authentication status before proceeding
      if (!isAuthenticated || !accessToken) {
        const authError = "You must be logged in to add passwords";
        console.error(authError, { isAuthenticated, hasToken: !!accessToken });
        setError(authError + ". Please log in again.");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Explicitly ensure auth header is set
      if (ensureAuthHeader) {
        ensureAuthHeader();
      }

      // Validate token if we have the function
      if (isTokenValid && !isTokenValid()) {
        const tokenError = "Your session has expired";
        console.error(tokenError);
        setError(tokenError + ". Please log in again.");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Validate the form first
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Create password category based on item type
      const category =
        type === "login" ? "Login" : type === "card" ? "Card" : "Secure Note";

      const now = new Date().toISOString();

      // Prepare the data object to add with proper typing
      const passwordData: Password = {
        id: 0, // Will be assigned by server
        title,
        username,
        password,
        website: type === "login" ? website : "",
        notes: notes || "",
        category,
        createdAt: now,
        updatedAt: now,
        userId: 0, // Will be set by the server
      };

      try {
        // Add the new password to the store

        await addPassword(passwordData);

        setSubmitSuccess(true);

        // Show success message

        // Small delay to show success message before redirecting
        setTimeout(() => {
          // Redirect to dashboard

          navigate("/dashboard");
        }, 1500);
      } catch (addError: any) {
        console.error("Error from addPassword:", addError);

        // Show a more user-friendly error message
        let errorMessage = addError.message || "Failed to add password";

        // Handle authentication errors specifically
        if (
          errorMessage.includes("Authentication required") ||
          errorMessage.includes("Authentication failed") ||
          errorMessage.includes("401") ||
          errorMessage.includes("token") ||
          errorMessage.includes("session")
        ) {
          errorMessage = "Your session has expired. Please log in again.";
          console.error(
            "Authentication error detected, will redirect to login"
          );
          // Redirect to login page after a delay
          setTimeout(() => navigate("/login"), 2000);
        }

        setError(errorMessage);
        console.error("Failed to add password:", errorMessage);
      }
    } catch (err: any) {
      console.error("Unexpected error in form submission:", err);
      setError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submitSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Password added successfully! Redirecting to vault...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
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
                    <Key className="mr-2 h-4 w-4" />
                    Login
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="note" id="note" />
                  <Label
                    htmlFor="note"
                    className="flex items-center cursor-pointer"
                  >
                    <FileText className="mr-2 h-4 w-4" />
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
                className={titleError ? "border-red-500" : ""}
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
                    className={usernameError ? "border-red-500" : ""}
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
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordFieldError(null);
                      }}
                      placeholder="Enter a strong password"
                      className={`pr-10 ${
                        passwordFieldError ? "border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
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
                  {passwordFieldError && (
                    <p className="text-sm text-red-500">{passwordFieldError}</p>
                  )}
                  <PasswordGenerator
                    onPasswordGenerated={handleGeneratedPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => {
                        setWebsite(e.target.value);
                        setWebsiteError(null);
                      }}
                      placeholder="https://example.com"
                      className={websiteError ? "border-red-500" : ""}
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
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || passwordsLoading}
            >
              {loading || passwordsLoading ? "Adding item..." : "Add Item"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
