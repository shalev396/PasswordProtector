import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Key,
  EyeOff,
  RefreshCw,
  Clock,
  Copy,
  CheckCircle2,
  Download,
  Unlock,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DecryptionDemoSection: React.FC = () => {
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [decryptedPassword] = useState("MySecretPass123!");

  // Simulate decryption delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDecrypted(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decryptedPassword);
      console.log("Password copied!"); // Simple feedback
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  return (
    <section
      id="decryption-demo"
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-slate-50 to-background dark:from-slate-800 dark:to-background overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Retrieving Your Secure Passwords
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl">
            Even when retrieving your passwords, the decryption happens entirely
            on your device.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10 bg-card dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-xl border border-border/40 dark:border-slate-700">
              {/* Fake Browser Header */}
              <div className="flex items-center space-x-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              {/* Demo Content */}
              <div className="bg-background dark:bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Password Vault
                </h3>
                <div className="space-y-4">
                  {/* Simplified demo items for better responsiveness */}
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          GitHub
                        </div>
                        <div className="text-xs text-muted-foreground">
                          developer@example.com
                        </div>
                      </div>
                    </div>
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Item 2 (Master Password Prompt) */}
                  <div className="p-3 bg-muted/50 dark:bg-slate-800/60 rounded-lg space-y-2 border border-primary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-sm text-foreground">
                            Master Password
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Used for decryption
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                        Active
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        type="password"
                        value="********"
                        readOnly
                        className="bg-background dark:bg-slate-900 text-xs h-8 pr-8"
                      />
                      <RefreshCw className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Decrypting passwords...
                    </p>
                  </div>

                  {/* Item 3 (Decrypted Password) */}
                  <AnimatePresence>
                    {showDecrypted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-muted/50 dark:bg-slate-800/60 rounded-lg space-y-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Globe className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium text-sm text-foreground">
                              GitHub
                            </div>
                            <div className="text-xs text-muted-foreground">
                              developer@example.com
                            </div>
                          </div>
                        </div>
                        <Label htmlFor="decrypted-pass" className="text-xs">
                          Password:
                        </Label>
                        <div className="relative">
                          <Input
                            id="decrypted-pass"
                            type="text"
                            value={decryptedPassword}
                            readOnly
                            className="bg-background dark:bg-slate-900 text-sm h-9 pr-16 font-mono"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                            onClick={copyToClipboard}
                          >
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Decryption complete using your master key
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-8 -left-8 h-32 w-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -bottom-12 -right-8 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </motion.div>

          {/* Right Column: Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              Accessing Your Vault Securely
            </h3>

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Encrypted Data Retrieval
                </h4>
                <p className="text-muted-foreground">
                  When you access your vault, only the encrypted data is
                  downloaded from our servers.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Master Key Prompt
                </h4>
                <p className="text-muted-foreground">
                  Your master password is required to generate the decryption
                  key locally on your device.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <Unlock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Local Decryption
                </h4>
                <p className="text-muted-foreground">
                  Passwords are decrypted only within your browser using the key
                  derived from your master password.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Security Maintained
                </h4>
                <p className="text-muted-foreground">
                  Your plaintext passwords are never exposed to our servers or
                  transmitted over the network.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DecryptionDemoSection;
