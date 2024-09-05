import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, KeyRound, RefreshCw, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { encryptData } from "@/lib/crypto";
import { generateRandomPassword } from "@/lib/passwordGenerator";

export default function AddItemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Calculate password strength
  useEffect(() => {
    if (password) {
      let score = 0;
      // Length check
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;

      // Complexity checks
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      setStrength(Math.min(score, 5));
    } else {
      setStrength(0);
    }
  }, [password]);

  const handleGeneratePassword = () => {
    setPassword(generateRandomPassword(16));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get encryption key from session storage
      const encryptionKeyJwk = JSON.parse(
        sessionStorage.getItem("encryptionKey") || ""
      );

      if (!encryptionKeyJwk) {
        throw new Error("Encryption key not found");
      }

      // Import encryption key from JWK format
      const encryptionKey = await window.crypto.subtle.importKey(
        "jwk",
        encryptionKeyJwk,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      // Encrypt the password
      const encryptedPassword = await encryptData(password, encryptionKey);

      // Create password entry
      const newItem = {
        id: Date.now().toString(),
        website,
        username,
        password: encryptedPassword,
        notes,
        createdAt: new Date().toISOString(),
      };

      // Get existing vault or create new one
      const vault = JSON.parse(localStorage.getItem("passwordVault") || "[]");

      // Add new item to vault
      vault.push(newItem);

      // Save updated vault
      localStorage.setItem("passwordVault", JSON.stringify(vault));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Link
        to="/dashboard"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Button variant="ghost" className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Add New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new secure entry for your password vault
          </p>
        </div>

        <Card className="border border-border/40 shadow-md">
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="website">Website or Service</Label>
                <Input
                  id="website"
                  type="text"
                  placeholder="example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-input/50"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-input/50"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleGeneratePassword}
                    disabled={loading}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Generate
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10 bg-input/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
                <PasswordStrengthMeter strength={strength} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                  className="min-h-[100px] bg-input/50"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
