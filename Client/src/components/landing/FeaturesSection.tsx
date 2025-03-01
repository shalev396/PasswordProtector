import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Key, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Zero-Knowledge Architecture",
    description:
      "Your passwords are encrypted on your device before they reach our servers. We never have access to your unencrypted data.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "All data is encrypted using industry-standard AES-256 encryption, ensuring maximum security for your sensitive information.",
  },
  {
    icon: Key,
    title: "Secure Password Generation",
    description:
      "Generate strong, unique passwords for all your accounts with our built-in password generator.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "Access your passwords instantly across all your devices while maintaining the highest level of security.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Advanced Security Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our platform combines cutting-edge security features to provide the
            most secure password management solution available.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background dark:bg-card rounded-lg p-6 shadow-sm border border-border/40"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
