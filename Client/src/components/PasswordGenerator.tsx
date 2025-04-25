import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { generateRandomPassword } from "@/lib/passwordGenerator";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGenerator({
  onPasswordGenerated,
}: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    setCopied(false);

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

      const password = generateRandomPassword(length, {
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      });
      setGeneratedPassword(password);
      onPasswordGenerated(password);
    } catch (error) {
      console.error("Failed to generate password:", error);
      toast.error("Failed to generate password");
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Password copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy password");
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <RefreshCw className="mr-2 h-4 w-4" />
          Password Generator
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div>
          <div className="relative mt-1">
            <Input
              value={generatedPassword}
              readOnly
              className="pr-20 font-mono"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase" className="text-sm">
                  Uppercase Letters (A-Z)
                </Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
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
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
