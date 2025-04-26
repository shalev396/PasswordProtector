import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Lock, ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <ShieldAlert className="w-12 h-12 text-primary" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              404 - Page Not Found
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              The page you're looking for seems to be locked away or doesn't
              exist. Please check the URL or navigate back to safety.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative mx-auto max-w-md"
          >
            {/* Animated vault graphic */}
            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-lg relative overflow-hidden">
              <div className="absolute -z-10 -top-8 -right-8 h-32 w-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-12 -left-8 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="opacity-10 absolute inset-0 flex items-center justify-center"
                  >
                    <Lock className="w-32 h-32 text-primary" />
                  </motion.div>
                  <div className="text-9xl font-bold text-primary/20">404</div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/">
                    <Button className="w-full gap-2">
                      <Home className="h-4 w-4" />
                      <span>Back to Home</span>
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Go Back</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
