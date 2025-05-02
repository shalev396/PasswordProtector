import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Key, Database } from "lucide-react";
import { motion } from "framer-motion";

const EncryptionFlowSection: React.FC = () => {
  return (
    <section
      id="encryption-flow"
      className="py-20 md:py-28 lg:py-32 bg-muted/50 dark:bg-slate-900/90 overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            How End-to-End Encryption Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            See exactly how your passwords remain protected throughout their
            entire lifecycle
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Password Creation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card dark:bg-slate-900/60 rounded-xl p-6 shadow-lg border border-border/40"
          >
            <div className="mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Password Creation
            </h3>
            <p className="text-muted-foreground mb-4">
              You enter your credentials securely on your device
            </p>
            <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">// Your password</div>
              <div className="text-primary">"MySecretPass123!"</div>
            </div>
          </motion.div>

          {/* Client-Side Encryption Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card dark:bg-slate-900/60 rounded-xl p-6 shadow-lg border border-border/40"
          >
            <div className="mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Client-Side Encryption
            </h3>
            <p className="text-muted-foreground mb-4">
              Your master password creates a unique encryption key
            </p>
            <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">// Encryption process</div>
              <div>
                <span className="text-yellow-500">const</span>{" "}
                <span className="text-primary">salt</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-primary">generateRandomSalt()</span>;
              </div>
              <div>
                <span className="text-yellow-500">const</span>{" "}
                <span className="text-primary">key</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-green-500">deriveKey</span>
                (masterPassword, salt);
              </div>
              <div>
                <span className="text-yellow-500">const</span>{" "}
                <span className="text-primary">encrypted</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-blue-500">AES_GCM.encrypt</span>
                (password, key);
              </div>
            </div>
          </motion.div>

          {/* Secure Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card dark:bg-slate-900/60 rounded-xl p-6 shadow-lg border border-border/40"
          >
            <div className="mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Secure Storage
            </h3>
            <p className="text-muted-foreground mb-4">
              Only encrypted data is sent to our servers
            </p>
            <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">
                // Stored encrypted value
              </div>
              <div className="text-green-500">
                "8f7d6a3e2b1c9f8e:AES-GCM-P8H2j9K..."
              </div>
              <div className="text-muted-foreground mt-2">// Format</div>
              <div>
                <span className="text-yellow-500">Salt</span>{" "}
                <span className="text-muted-foreground">+</span>{" "}
                <span className="text-blue-500">Encrypted Data</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* <div className="mt-12 text-center">
          <Link
            to="/security"
            className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
          >
            Learn more about our encryption
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default EncryptionFlowSection;
