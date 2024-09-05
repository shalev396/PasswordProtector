import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LockIcon,
  ShieldCheck,
  KeyRound,
  Wifi,
  Gauge,
  Wand2,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
      title: "End-to-End Encryption",
      description:
        "Your data is encrypted and decrypted only on your devices. We never have access to your passwords.",
    },
    {
      icon: <KeyRound className="h-10 w-10 text-primary mb-4" />,
      title: "Strong Password Generation",
      description:
        "Create strong, unique passwords instantly for all your accounts to enhance security.",
    },
    {
      icon: <Wifi className="h-10 w-10 text-primary mb-4" />,
      title: "Zero-Knowledge",
      description:
        "We never see your passwords or master key. Your privacy is guaranteed.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="w-full flex items-center justify-center py-16 md:py-24 lg:py-32 xl:py-40 min-h-[calc(100vh-56px)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl xl:text-7xl/none">
                    Secure Your Digital Life with Password Protector
                  </h1>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:mx-0">
                    A zero-knowledge password manager with end-to-end
                    encryption. Your data never leaves your device unencrypted.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-start justify-center">
                  <Link to="/register">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto"
                    >
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center p-6">
                <div className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full bg-gradient-to-br from-muted/30 via-background to-muted/50 p-8 shadow-xl dark:from-muted/50 dark:to-muted/70 sm:h-[350px] sm:w-[350px]">
                  <ShieldCheck className="h-32 w-32 text-foreground opacity-70 sm:h-40 sm:w-40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/20"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to keep your passwords safe and secure
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:gap-10">
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-border/40 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                <div className="rounded-full bg-primary/10 p-3">
                  <LockIcon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  End-to-End Encryption
                </h3>
                <p className="text-muted-foreground">
                  Your data is encrypted before it leaves your device, ensuring
                  only you can access it.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-border/40 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                <div className="rounded-full bg-primary/10 p-3">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Zero-Knowledge
                </h3>
                <p className="text-muted-foreground">
                  We never see your passwords or master key. Your privacy is
                  guaranteed.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-border/40 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                <div className="rounded-full bg-primary/10 p-3">
                  <Wand2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Password Generator
                </h3>
                <p className="text-muted-foreground">
                  Create strong, unique passwords for all your accounts with our
                  built-in generator.
                </p>
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
