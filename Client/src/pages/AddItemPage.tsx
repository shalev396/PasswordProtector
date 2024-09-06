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
import { encrypt } from "@/lib/encryption";
import { PasswordGenerator } from "@/components/PasswordGenerator";

// Define PasswordItem interface
interface PasswordItem {
  id: string;
  type: "login" | "card" | "note";
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddItemPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"login" | "card" | "note">("login");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the master key from userData
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("User data not found");
      }

      const { masterKey } = JSON.parse(userData);

      // Encrypt sensitive data
      const encryptedPassword = password
        ? await encrypt(password, masterKey)
        : "";

      // Create new item
      const newItem: PasswordItem = {
        id: crypto.randomUUID(),
        type,
        title,
        username,
        password: encryptedPassword,
        website: type === "login" ? website : "",
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get current passwords
      const storedPasswords = localStorage.getItem("passwords");
      const passwords = storedPasswords ? JSON.parse(storedPasswords) : [];

      // Add new item to vault
      passwords.push(newItem);

      // Save updated vault
      localStorage.setItem("passwords", JSON.stringify(passwords));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add item:", err);
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
                    <Globe className="mr-2 h-4 w-4 text-blue-500" />
                    Login
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                    Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="note" id="note" />
                  <Label
                    htmlFor="note"
                    className="flex items-center cursor-pointer"
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
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {type === "login" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => {
                        const passwordGeneratorDialog = document.getElementById(
                          "password-generator-dialog"
                        );
                        if (
                          passwordGeneratorDialog instanceof HTMLDialogElement
                        ) {
                          passwordGeneratorDialog.showModal();
                        }
                      }}
                    >
                      <Key className="mr-1 h-3 w-3" />
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={type === "login"}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Item"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <PasswordGenerator onPasswordGenerated={handleGeneratedPassword} />
    </div>
  );
}
