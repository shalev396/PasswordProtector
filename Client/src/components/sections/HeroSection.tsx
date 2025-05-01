import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Lock, Key, Copy, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 md:py-24 lg:py-32"
      ref={heroRef}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Secure Password Management with End-to-End Encryption
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Password Protector ensures your sensitive data remains private
                and secure with AES-256 encryption and zero-knowledge
                architecture.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/login")}
                >
                  <span>Get Started</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      "https://github.com/shalev396/PasswordProtector",
                      "_blank"
                    )
                  }
                >
                  <Github className="h-4 w-4" />
                  <span>View on GitHub</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
              <span>
                Built with React, TypeScript, Node.js Express, and SQL Server
              </span>
            </motion.div>
          </div>

          {/* Right content - Animated password card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-xl blur opacity-50"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative rounded-xl overflow-hidden bg-card shadow-md border border-border backdrop-blur-sm">
                {/* Password vault visualization */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Lock className="h-6 w-6 text-primary" />
                      <h3 className="font-bold text-lg">Password Vault</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Password entries */}
                  <div className="space-y-3">
                    {["Banking", "Social Media", "Email", "Shopping"].map(
                      (category, i) => (
                        <motion.div
                          key={category}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            delay: 0.5 + i * 0.2,
                            duration: 0.5,
                          }}
                          className="p-3 rounded-md bg-muted/60 hover:bg-muted transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{category}</div>
                              <div className="text-xs text-muted-foreground">
                                {i % 2 === 0
                                  ? "••••••••••••••••"
                                  : "•••••••••••••"}
                              </div>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Copy className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
                          </motion.div>
                        </motion.div>
                      )
                    )}
                  </div>

                  {/* Animated encryption indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="mt-6 pt-4 border-t border-border flex items-center justify-center text-xs text-muted-foreground"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Encrypted with AES-256</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
