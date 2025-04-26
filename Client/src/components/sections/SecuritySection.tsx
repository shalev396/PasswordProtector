import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Key, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";

const SecuritySection: React.FC = () => {
  // Add refs for the security section
  const securitySectionRef = useRef<HTMLDivElement>(null);
  const securityTextRef = useRef<HTMLDivElement>(null);
  const securityImageRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="security"
      className="py-20 md:py-28 lg:py-32 bg-background dark:bg-slate-900/50"
      ref={securitySectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            ref={securityTextRef}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Passwords,{" "}
              <span className="text-primary">Always Protected</span>
            </h2>
            <p className="text-muted-foreground">
              Password Protector uses industry-standard AES-GCM encryption to
              keep your passwords secure. Your master password never leaves your
              device.
            </p>

            <div className="space-y-4">
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Client-Side Encryption
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    All encryption happens in your browser. Your data is
                    encrypted before it ever leaves your device.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Unique Key Per Password
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Each password has its own unique salt, preventing pattern
                    matching and rainbow table attacks.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <EyeOff className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Zero Knowledge
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Our servers never see your plaintext passwords or encryption
                    keys. Only you can decrypt your data.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center px-5 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
              >
                Start Protecting Your Passwords
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            ref={securityImageRef}
            className="relative"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative z-10">
              <motion.div
                className="bg-card dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-xl border border-border/40 dark:border-slate-700"
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute right-1 top-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-primary opacity-10"
                  >
                    <Lock className="w-32 h-32" />
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">
                  AES-GCM Encryption
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <p className="text-muted-foreground text-sm">
                      256-bit encryption keys
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <p className="text-muted-foreground text-sm">
                      PBKDF2 key derivation
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <p className="text-muted-foreground text-sm">
                      Unique salt per password
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <p className="text-muted-foreground text-sm">
                      High iteration count: 100,000
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs text-muted-foreground overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-muted-foreground">
                      // Example encryption result
                    </div>
                    <div className="text-primary">
                      8f7d6a3e2b1c9f8e7d6a:
                      <span className="text-yellow-500">
                        AES-GCM-Encrypted-Data...
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-2">
                      // Salt (16 bytes)
                    </div>
                    <div className="text-green-500">8f7d6a3e2b1c9f8e7d6a</div>
                    <div className="text-muted-foreground mt-2">
                      // Encrypted data
                    </div>
                    <div className="text-yellow-500">
                      AES-GCM-Encrypted-Data...
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
              <motion.div
                className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/10 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-primary/5 rounded-full"
                animate={{
                  scale: [1.2, 0.8, 1.2],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/2 right-1/4 w-8 h-8 bg-primary/20 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
