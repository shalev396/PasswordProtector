import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Updated navItems to include all sections in order
  const navItems = [
    { href: "#hero", label: "Home" }, // 1. Secure Password Management...
    { href: "#security", label: "Security" }, // 2. Always Protected
    { href: "#zero-knowledge", label: "Zero-Knowledge" }, // 3. Zero-Knowledge Security Model
    { href: "#encryption-flow", label: "Encryption Flow" }, // 4. How End-to-End Encryption Works
    { href: "#decryption-demo", label: "Decryption Demo" }, // 5. Retrieving Your Secure Passwords
    { href: "#features", label: "Features" }, // 6. Everything You Need
  ];

  // Monitor scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Get all sections and determine which one is currently in view
      const sections = navItems.map((item) => item.href.substring(1));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop - 100) {
            // 100px offset for better UX
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  // Function to handle smooth scrolling
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(targetId);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo and Title */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <LockKeyhole className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">Password Protector</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={cn(
                "transition-colors hover:text-primary py-1",
                activeSection === item.href.substring(1)
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Side Buttons (Desktop) */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Dark Mode Toggle */}
          <ModeToggle />

          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="hidden md:inline-flex">
            <Link to="/register">Sign Up</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <nav className="flex flex-col h-full">
                <Link to="/" className="flex items-center space-x-2 mb-8">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">Password Protector</span>
                </Link>
                <div className="flex-grow space-y-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        activeSection === item.href.substring(1)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="mt-auto space-y-3 pt-6 border-t border-border/40">
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
