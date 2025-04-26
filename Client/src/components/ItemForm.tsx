import React, { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Shield,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Password } from "@/types";
// import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { generateRandomPassword } from "@/lib/passwordGenerator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ItemFormProps {
  mode: "add" | "edit";
  initialData?: Partial<Password>;
  onSubmit: (data: Partial<Password>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  submitSuccess?: boolean;
  disableNonLoginTypes?: boolean;
}

export function ItemForm({
  mode,
  initialData,
  onSubmit,
  isLoading,
  error,
  submitSuccess,
  disableNonLoginTypes = false,
}: ItemFormProps) {
  const [type, setType] = useState<"login" | "card" | "note">(
    initialData?.category === "Card" && !disableNonLoginTypes
      ? "card"
      : initialData?.category === "Secure Note" && !disableNonLoginTypes
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
  // const { getMasterPassword } = useAuth();

  // Password generator states
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Form validation states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(
    null
  );
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // Ref to track if the component has already initialized
  const initializedRef = useRef(false);

  // If we're in edit mode and receive initialData, use the encrypted password
  // Only run when initialData changes but prevent resetting after user edits
  useEffect(() => {
    if (mode === "edit" && initialData && !initializedRef.current) {
      // Keep the encrypted password for submission
      setEncryptedPassword(initialData.encryptedPassword || "");
      // Set password field to show the encrypted password by default
      setPassword(initialData.password || "");
      // Mark as initialized
      initializedRef.current = true;
    }
  }, [mode, initialData]); // Always include both dependencies

  // If disableNonLoginTypes is toggled and current type is not login, switch to login
  useEffect(() => {
    if (disableNonLoginTypes && type !== "login") {
      setType("login");
    }
  }, [disableNonLoginTypes, type]);

  const handleGeneratePassword = () => {
    try {
      if (
        !includeUppercase &&
        !includeLowercase &&
        !includeNumbers &&
        !includeSymbols
      ) {
        setIncludeLowercase(true);
        return;
      }

      const newPassword = generateRandomPassword(passwordLength, {
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      });

      setPassword(newPassword);
      setDecryptedPassword(null);
      setPasswordFieldError(null);
      toast.success("New password generated");
    } catch (error) {
      console.error("Failed to generate password:", error);
      toast.error("Failed to generate password");
    }
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

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          >
            <Link to="/dashboard" className="flex items-center text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vault
            </Link>
          </Button>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-4 border-destructive/20 text-destructive-foreground"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-4 border-success/20 bg-success/10 text-success">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Item {mode === "add" ? "added" : "updated"} successfully!
              Redirecting to vault...
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-border shadow-card">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === "add" ? "Add New Item" : "Edit Item"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Item Type</Label>
                <RadioGroup
                  value={type}
                  onValueChange={(value) =>
                    setType(value as "login" | "card" | "note")
                  }
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="login"
                      id="login"
                      className="border-primary text-primary"
                    />
                    <Label
                      htmlFor="login"
                      className="flex cursor-pointer items-center"
                    >
                      <Key className="mr-2 h-4 w-4 text-primary" />
                      Login
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="card"
                      id="card"
                      disabled={disableNonLoginTypes}
                      className="border-primary text-primary"
                    />
                    <Label
                      htmlFor="card"
                      className={`flex items-center ${
                        disableNonLoginTypes
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <CreditCard className="mr-2 h-4 w-4 text-success" />
                      Card
                      {disableNonLoginTypes && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Disabled)
                        </span>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="note"
                      id="note"
                      disabled={disableNonLoginTypes}
                      className="border-primary text-primary"
                    />
                    <Label
                      htmlFor="note"
                      className={`flex items-center ${
                        disableNonLoginTypes
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FileText className="mr-2 h-4 w-4 text-warning" />
                      Secure Note
                      {disableNonLoginTypes && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Disabled)
                        </span>
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(null);
                  }}
                  placeholder="My Account"
                  className={`border-border focus:border-primary focus:ring-primary/30 ${
                    titleError
                      ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                      : ""
                  }`}
                />
                {titleError && (
                  <p className="text-sm text-destructive">{titleError}</p>
                )}
              </div>

              {type === "login" && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username / Email
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError(null);
                      }}
                      placeholder="john.doe@example.com"
                      className={`border-border focus:border-primary focus:ring-primary/30 ${
                        usernameError
                          ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                          : ""
                      }`}
                    />
                    {usernameError && (
                      <p className="text-sm text-destructive">
                        {usernameError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
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
                        className={`pr-20 border-border focus:border-primary focus:ring-primary/30 ${
                          passwordFieldError
                            ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                            : ""
                        }`}
                      />
                      <div className="absolute right-1 top-1 flex">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-secondary/50"
                          onClick={handleGeneratePassword}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-secondary/50"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {passwordFieldError && (
                      <p className="text-sm text-destructive">
                        {passwordFieldError}
                      </p>
                    )}

                    {/* Password Strength Meter */}
                    {password && <PasswordStrengthMeter password={password} />}

                    {/* Password Generator Drawer */}
                    <Collapsible
                      open={isGeneratorOpen}
                      onOpenChange={setIsGeneratorOpen}
                      className="w-full space-y-2 mt-2 border rounded-md p-2 border-border"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full justify-between border-border hover:bg-secondary/50 text-foreground"
                        >
                          Password Generator Settings
                          <RefreshCw className="ml-2 h-4 w-4 text-primary" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4">
                        <div className="space-y-4 pt-2">
                          <Button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            Generate New Password
                          </Button>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label
                                htmlFor="length"
                                className="text-sm font-medium"
                              >
                                Password Length: {passwordLength}
                              </Label>
                            </div>
                            <Slider
                              id="length"
                              min={8}
                              max={32}
                              step={1}
                              value={[passwordLength]}
                              onValueChange={(value) =>
                                setPasswordLength(value[0])
                              }
                              className="[&>span:first-child]:bg-primary [&_[role=slider]]:bg-background [&_[role=slider]]:border-primary"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">
                              Character Types
                            </Label>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="uppercase" className="text-sm">
                                  Uppercase Letters (A-Z)
                                </Label>
                                <Switch
                                  id="uppercase"
                                  checked={includeUppercase}
                                  onCheckedChange={setIncludeUppercase}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="lowercase" className="text-sm">
                                  Lowercase Letters (a-z)
                                </Label>
                                <Switch
                                  id="lowercase"
                                  checked={includeLowercase}
                                  onCheckedChange={setIncludeLowercase}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="numbers" className="text-sm">
                                  Numbers (0-9)
                                </Label>
                                <Switch
                                  id="numbers"
                                  checked={includeNumbers}
                                  onCheckedChange={setIncludeNumbers}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="symbols" className="text-sm">
                                  Symbols (!@#$%^&*)
                                </Label>
                                <Switch
                                  id="symbols"
                                  checked={includeSymbols}
                                  onCheckedChange={setIncludeSymbols}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="website" className="text-sm font-medium">
                      Website URL
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-info" />
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => {
                          setWebsite(e.target.value);
                          setWebsiteError(null);
                        }}
                        placeholder="https://example.com"
                        className={`border-border focus:border-primary focus:ring-primary/30 ${
                          websiteError
                            ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                            : ""
                        }`}
                      />
                    </div>
                    {websiteError && (
                      <p className="text-sm text-destructive">{websiteError}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional information here..."
                  rows={4}
                  className="min-h-[100px] resize-none border-border focus:border-primary focus:ring-primary/30"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
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
