import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check, Copy, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateRandomPassword } from "@/lib/passwordGenerator";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { toast } from "sonner";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

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
    // Reset copied state
    setCopied(false);

    try {
      // Make sure at least one option is selected
      if (
        !includeUppercase &&
        !includeLowercase &&
        !includeNumbers &&
        !includeSymbols
      ) {
        // Default to lowercase if nothing is selected
        setIncludeLowercase(true);
        return;
      }

      const password = generateRandomPassword(length, {
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      });
      setGeneratedPassword(password);
    } catch (error) {
      console.error("Failed to generate password:", error);
      // Handle error (show message, etc.)
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);

      // Reset copied status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      // Show toast notification
      toast.success("Password copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-start justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Password Generator</CardTitle>
                <CardDescription>
                  Create a strong, secure password
                </CardDescription>
              </div>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="password">Generated Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  value={generatedPassword}
                  readOnly
                  className="pr-20"
                />
                <div className="absolute right-1 top-1 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleGeneratePassword}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {generatedPassword && (
                <PasswordStrengthMeter password={generatedPassword} />
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="length">Password Length: {length}</Label>
                </div>
                <Slider
                  id="length"
                  min={8}
                  max={32}
                  step={1}
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Character Types</Label>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                    <Switch
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="numbers">Numbers (0-9)</Label>
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                    <Switch
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleGeneratePassword}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Password
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
