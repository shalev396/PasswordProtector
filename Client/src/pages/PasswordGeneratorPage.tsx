import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { generatePassword } from "@/lib/passwordUtils";

export default function PasswordGeneratorPage() {
  const navigate = useNavigate();
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Generate password on component mount and when options change
  useEffect(() => {
    handleGeneratePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const handleGeneratePassword = () => {
    try {
      // Ensure at least one character set is selected
      if (
        !(
          includeUppercase ||
          includeLowercase ||
          includeNumbers ||
          includeSymbols
        )
      ) {
        toast.error("At least one character set must be selected.");
        return;
      }

      const password = generatePassword({
        length,
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      });

      setGeneratedPassword(password);
      setCopied(false);
    } catch (err) {
      console.error("Failed to generate password:", err);
      toast.error("Failed to generate password.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast.success("Password copied to clipboard.");

      // Reset copied status after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
      toast.error("Failed to copy password to clipboard.");
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

      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>
            Create strong, secure passwords based on your requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  value={generatedPassword}
                  readOnly
                  className="pr-20 font-mono text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy password</span>
                </Button>
              </div>
              <div className="mt-2">
                {generatedPassword && (
                  <PasswordStrengthMeter password={generatedPassword} />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password-length">Length: {length}</Label>
              </div>
              <Slider
                id="password-length"
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase-switch" className="cursor-pointer">
                  Uppercase Letters (A-Z)
                </Label>
                <Switch
                  id="uppercase-switch"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase-switch" className="cursor-pointer">
                  Lowercase Letters (a-z)
                </Label>
                <Switch
                  id="lowercase-switch"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers-switch" className="cursor-pointer">
                  Numbers (0-9)
                </Label>
                <Switch
                  id="numbers-switch"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols-switch" className="cursor-pointer">
                  Symbols (!@#$%^&*)
                </Label>
                <Switch
                  id="symbols-switch"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGeneratePassword}
            className="w-full"
            type="button"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
