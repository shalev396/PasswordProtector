import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw } from "lucide-react";
import { generateRandomPassword } from "@/lib/passwordGenerator";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGenerator({
  onPasswordGenerated,
}: PasswordGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    const password = generateRandomPassword(length, {
      uppercase: includeUppercase,
      lowercase: includeLowercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    });
    setGeneratedPassword(password);
  };

  const handleApply = () => {
    onPasswordGenerated(generatedPassword);
    setOpen(false);
  };

  const handleCopy = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      alert("Password copied to clipboard!");
    }
  };

  // Generate a password when the component mounts or options change
  useState(() => {
    generatePassword();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Strong Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pr-10 border rounded"
              value={generatedPassword}
              readOnly
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="length">Length: {length}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={generatePassword}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Include Uppercase</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Include Lowercase</Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Include Numbers</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Include Symbols</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
