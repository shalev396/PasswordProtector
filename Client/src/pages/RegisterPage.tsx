"use client"; // Remove if not using Next.js App Router

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  // Use our auth hook
  const { register, isAuthenticated, isLoading, error } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate, isAuthenticated]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setLocalError("Please enter all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLocalLoading(true);

      // We use the master password (raw password) for both authentication and encryption
      await register(email, password, password);

      // Navigate to dashboard directly
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration Error:", err);

      // Handle different error scenarios
      if (err.response) {
        // Server responded with an error status
        if (err.response.status === 409) {
          setLocalError("This email is already registered");
        } else if (err.response.data && err.response.data.message) {
          setLocalError(err.response.data.message);
        } else {
          setLocalError("Failed to register. Please try again later.");
        }
      } else if (err.request) {
        // Request was made but no response received - network error
        setLocalError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        // Something else happened in setting up the request
        setLocalError("Failed to register. Please try again later.");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  // Show either local error or global error from Redux
  const displayError = localError || error;
  // Use either local loading state or global loading state
  const loading = localLoading || isLoading;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Link to="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to create a new account
          </p>
        </div>
        <Card className="border border-border/40 shadow-md">
          <form onSubmit={handleRegister}>
            <CardContent className="grid gap-4 pt-6">
              {displayError && (
                <Alert variant="destructive" className="bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="text-destructive">
                    Registration Error
                  </AlertTitle>
                  <AlertDescription className="text-destructive/90">
                    {displayError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-input/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Master Password</Label>
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
                <p className="text-xs text-muted-foreground">
                  This will be used to encrypt your vault - it cannot be
                  recovered
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Master Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10 bg-input/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
