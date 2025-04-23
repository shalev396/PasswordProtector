import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  Key,
  ArrowRight,
  Copy,
  RefreshCw,
  Clock,
  Smartphone,
  Globe,
  CheckCircle2,
  Shield,
  Database,
  Github,
  EyeOff,
  Download,
  Unlock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { generateRandomPassword } from "@/lib/passwordGenerator";

const LandingPage: React.FC = () => {
  // const [step, setStep] = useState(1); // Error TS6133
  // const totalSteps = 3; // Error TS6133

  // Password generator demo state
  // const [demoPassword, setDemoPassword] = useState(""); // Error TS6133
  const [passwordLength] = useState(12); // Remove setPasswordLength (Error TS6133)
  // const [copied] = useState(false); // Remove copied (Error TS6133) - Assuming it's not used elsewhere after refactor
  const [decryptedPassword] = useState("MySecretPass123!"); // Remove setDecryptedPassword (Error TS6133)

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  // Add refs for the security section
  const securitySectionRef = useRef<HTMLDivElement>(null);
  const securityTextRef = useRef<HTMLDivElement>(null);
  const securityImageRef = useRef<HTMLDivElement>(null);

  // State for decryption demo
  const [showDecrypted, setShowDecrypted] = useState(false);
  // const [decryptedPassword, setDecryptedPassword] = useState("MySecretPass123!"); // Remove setDecryptedPassword (Error TS6133)

  // const nextStep = () => { ... }; // Error TS6133

  const generatePassword = () => {
    // setCopied(false);
    // const newPassword = generateRandomPassword(passwordLength, { // Error TS6133
    generateRandomPassword(passwordLength, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    // setDemoPassword(newPassword);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decryptedPassword);
      // setCopied(true); // Keep or remove based on whether visual feedback is desired
      // setTimeout(() => setCopied(false), 2000); // Keep or remove based on feedback
      // Consider using a toast notification instead if 'copied' state is removed
      console.log("Password copied!"); // Simple feedback
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  // Initialize GSAP and ScrollTrigger
  useEffect(() => {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = "smooth";

    gsap.registerPlugin(ScrollTrigger);

    // Hero section animation
    if (heroRef.current && heroTextRef.current && heroButtonsRef.current) {
      const tl = gsap.timeline();

      tl.from(heroTextRef.current.children, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        heroButtonsRef.current.children,
        {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }

    // Animation for security section
    if (
      securitySectionRef.current &&
      securityTextRef.current &&
      securityImageRef.current
    ) {
      const securityTl = gsap.timeline({
        scrollTrigger: {
          trigger: securitySectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      securityTl
        .from(securityTextRef.current, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: "power2.out",
        })
        .from(
          securityImageRef.current,
          {
            opacity: 0,
            x: 50,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Reset scroll behavior
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Generate a password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Update password when length changes
  useEffect(() => {
    generatePassword();
  }, [passwordLength]);

  // Simulate decryption delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDecrypted(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Variants for framer-motion animations
  // const fadeIn = { ... }; // Error TS6133
  // const staggerContainer = { ... }; // Error TS6133

  // const [deploymentType, setDeploymentType] = useState("cloud"); // Errors TS6133

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Section 1: Hero */}
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
                    Password Protector ensures your sensitive data remains
                    private and secure with AES-256 encryption and
                    zero-knowledge architecture.
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
                    <Button size="lg" className="gap-2">
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
                    <Button size="lg" variant="outline" className="gap-2">
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
                    Built with React, TypeScript, Node.js Express, and SQL
                    Server
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

        {/* Divider */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <div className="border-b border-border/40"></div>
          </div>
        </div>

        {/* Section 2: Security */}
        <section
          id="security"
          className="py-20 md:py-28 lg:py-32 bg-background dark:bg-slate-900/50"
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
                  Password Protector uses industry-standard AES-GCM encryption
                  to keep your passwords secure. Your master password never
                  leaves your device.
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
                        Each password has its own unique salt, preventing
                        pattern matching and rainbow table attacks.
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
                        Our servers never see your plaintext passwords or
                        encryption keys. Only you can decrypt your data.
                      </p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                        <div className="text-green-500">
                          8f7d6a3e2b1c9f8e7d6a
                        </div>
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

        {/* Divider */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <div className="border-b border-border/40"></div>
          </div>
        </div>

        {/* Section 3: Zero-Knowledge Security Model (Previously under #demo) */}
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
                Your passwords are protected with AES-256 GCM encryption and
                PBKDF2 key derivation, ensuring only you can access your data.
                Even we can't read your passwords.
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
                        We use AES-GCM with 256-bit keys and PBKDF2 key
                        derivation (100,000 iterations) for military-grade
                        encryption. Each password has its own unique salt for
                        maximum security.
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
                        Your master password never leaves your device.
                        Encryption keys are derived on-demand and never stored
                        persistently, ensuring your data remains secure even if
                        our servers are compromised.
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
                        All encryption and decryption happens in your browser.
                        We only store encrypted versions of your passwords that
                        can't be decrypted without your master password,
                        ensuring true zero-knowledge security.
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
                        <span className="text-primary">
                          MySecretPassword123!
                        </span>
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
                        <div className="text-green-500">
                          → Encrypting data...
                        </div>
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

        {/* Divider */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <div className="border-b border-border/40"></div>
          </div>
        </div>

        {/* Section 4: How End-to-End Encryption Works (Previously under #encryption) */}
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
                  <div className="text-muted-foreground">
                    // Encryption process
                  </div>
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

            <div className="mt-12 text-center">
              <Link
                to="/security"
                className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
              >
                Learn more about our encryption
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <div className="border-b border-border/40"></div>
          </div>
        </div>

        {/* Section 5: Retrieving Your Secure Passwords (Previously under #demo) */}
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
                Even when retrieving your passwords, the decryption happens
                entirely on your device.
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
                      Your master password is required to generate the
                      decryption key locally on your device.
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
                      Passwords are decrypted only within your browser using the
                      key derived from your master password.
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
                      Your plaintext passwords are never exposed to our servers
                      or transmitted over the network.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <div className="border-b border-border/40"></div>
          </div>
        </div>

        {/* Section 6: Features */}
        <section
          id="features"
          className="py-20 md:py-28 lg:py-32 bg-slate-50 dark:bg-slate-900/50"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Password Protector provides all the essential tools to keep your
                passwords and sensitive data secure and accessible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground mb-4">
                  Get started in seconds with our intuitive interface and simple
                  setup process.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">
                      One-click password generation
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Quick search and filtering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">
                      Automatic password strength assessment
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Full Compatibility
                </h3>
                <p className="text-muted-foreground mb-4">
                  Access your passwords from any device or browser with our
                  responsive web application.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Works on desktop and mobile</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">
                      Compatible with all modern browsers
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">
                      Syncs across all your devices
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
              </div>
                <h3 className="text-xl font-semibold mb-2">
                  Military-Grade Security
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rest easy knowing your passwords are protected with the
                  strongest encryption available.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">AES-256 encryption</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Zero-knowledge architecture</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">
                      Unique encryption key per password
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Back to top button */}
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-up"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </motion.button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
