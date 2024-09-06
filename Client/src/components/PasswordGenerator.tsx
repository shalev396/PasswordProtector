import React, { useState } from "react";
import { CheckIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { generateRandomPassword } from "@/lib/passwordGenerator";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGenerator({
  onPasswordGenerated,
}: PasswordGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    const password = generateRandomPassword(length, {
      uppercase,
      lowercase,
      numbers,
      symbols,
    });
    setGeneratedPassword(password);
  };

  const handleApply = () => {
    onPasswordGenerated(generatedPassword);
    setOpen(false);
  };

  const handleCopy = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        // Could add toast notification here
      } catch (error) {
        console.error("Failed to copy password", error);
      }
    }
  };

  return (
    <Dialog id="password-generator-dialog" open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Strong Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="password-length">Password Length: {length}</Label>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="w-2/3"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-uppercase">Include Uppercase Letters</Label>
            <Switch
              id="include-uppercase"
              checked={uppercase}
              onCheckedChange={setUppercase}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-lowercase">Include Lowercase Letters</Label>
            <Switch
              id="include-lowercase"
              checked={lowercase}
              onCheckedChange={setLowercase}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-numbers">Include Numbers</Label>
            <Switch
              id="include-numbers"
              checked={numbers}
              onCheckedChange={setNumbers}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-symbols">Include Symbols</Label>
            <Switch
              id="include-symbols"
              checked={symbols}
              onCheckedChange={setSymbols}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={generatedPassword}
                readOnly
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute right-1 top-1/2 h-7 -translate-y-1/2 px-2"
              >
                Copy
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generatePassword}
              className="h-10 w-10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={generatePassword}>
            Generate
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={!generatedPassword}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
