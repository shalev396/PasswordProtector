import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Shield, Key, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up for a free account and set up your master password. This is the only password you'll need to remember.",
  },
  {
    icon: Shield,
    title: "Enable 2FA",
    description:
      "Add an extra layer of security by enabling two-factor authentication for your account.",
  },
  {
    icon: Key,
    title: "Add Your Passwords",
    description:
      "Start adding your passwords to the vault. They'll be automatically encrypted and stored securely.",
  },
  {
    icon: Zap,
    title: "Access Anywhere",
    description:
      "Access your passwords from any device, anywhere, while maintaining the highest level of security.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background dark:bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Getting started with our password manager is simple and secure.
            Follow these steps to begin protecting your digital life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card dark:bg-muted/20 rounded-lg p-6 shadow-sm border border-border/40"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
