import React from "react";
import { Lock, Key, Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ZeroKnowledgeSection: React.FC = () => {
  return (
    <section
      id="zero-knowledge"
      className="py-20 bg-background dark:bg-slate-900/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Zero-Knowledge Security Model
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Your passwords are protected with AES-256 GCM encryption and PBKDF2
            key derivation, ensuring only you can access your data. Even we
            can't read your passwords.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              How Your Data Is Protected
            </h3>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-1">
                    AES-256 GCM Encryption
                  </h4>
                  <p className="text-muted-foreground">
                    We use AES-GCM with 256-bit keys and PBKDF2 key derivation
                    (100,000 iterations) for military-grade encryption. Each
                    password has its own unique salt for maximum security.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-1">
                    Client-Side Key Management
                  </h4>
                  <p className="text-muted-foreground">
                    Your master password never leaves your device. Encryption
                    keys are derived on-demand and never stored persistently,
                    ensuring your data remains secure even if our servers are
                    compromised.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-1">
                    Zero-Knowledge Architecture
                  </h4>
                  <p className="text-muted-foreground">
                    All encryption and decryption happens in your browser. We
                    only store encrypted versions of your passwords that can't
                    be decrypted without your master password, ensuring true
                    zero-knowledge security.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card dark:bg-slate-900/60 border border-border/40 rounded-xl p-6 shadow-lg"
          >
            <div className="mb-4">
              <h4 className="text-lg font-medium text-foreground mb-2">
                Encryption Process
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    1. You enter your password
                  </div>
                  <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-3 font-mono text-sm">
                    <span className="text-primary">MySecretPassword123!</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    2. Client-side encryption with your master key
                  </div>
                  <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-3 font-mono text-sm">
                    <div className="text-yellow-500">
                      → Generating encryption key...
                    </div>
                    <div className="text-green-500">→ Encrypting data...</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    3. Stored encrypted on our servers
                  </div>
                  <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-3 font-mono text-sm overflow-hidden">
                    <div className="text-blue-500 break-all">
                      8f7d6a3e:AES-GCM-Encrypted-JK2c8aKL5H...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  End-to-end encrypted and secure
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ZeroKnowledgeSection;
