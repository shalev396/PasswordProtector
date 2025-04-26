import React from "react";
import { Clock, Smartphone, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection: React.FC = () => {
  return (
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
                <span className="text-sm">One-click password generation</span>
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
            <h3 className="text-xl font-semibold mb-2">Full Compatibility</h3>
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
                <span className="text-sm">Syncs across all your devices</span>
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
              Rest easy knowing your passwords are protected with the strongest
              encryption available.
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
  );
};

export default FeaturesSection;
