import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  Secure Password Management
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
                  Store, generate, and manage all your passwords with end-to-end
                  encryption.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24" id="features">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Features
                </h2>
                <p className="mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px]">
                  Everything you need to keep your passwords safe and secure.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg border border-border shadow-sm">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">End-to-End Encryption</h3>
                    <p className="text-muted-foreground">
                      Your passwords are encrypted on your device before being
                      stored.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg border border-border shadow-sm">
                  <Lock className="h-12 w-12 text-primary" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">Secure Storage</h3>
                    <p className="text-muted-foreground">
                      Store all your passwords, credit cards, and secure notes
                      in one place.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg border border-border shadow-sm">
                  <Key className="h-12 w-12 text-primary" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">
                      Strong Password Generator
                    </h3>
                    <p className="text-muted-foreground">
                      Create secure, unique passwords with our built-in
                      generator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
