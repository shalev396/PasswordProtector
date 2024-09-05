import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu

const Navbar: React.FC = () => {
  const navItems = [
    // Add more links as needed
    { href: "#features", label: "Features" },
    // { href: "/pricing", label: "Pricing" }, // Example for later
    // { href: "/help", label: "Help" }, // Example for later
  ];

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
            <a // Use <a> for intra-page links, Link for router links
              key={item.label}
              href={item.href} // Use href for anchor links
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Side Buttons (Desktop) */}
        <div className="flex flex-1 items-center justify-end space-x-2">
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
            <SheetContent side="right" className="w-[240px]">
              <nav className="flex flex-col space-y-4 mt-6">
                <Link to="/" className="mr-6 flex items-center space-x-2 mb-4">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                  <span className="font-bold inline-block">
                    Password Protector
                  </span>
                </Link>
                {navItems.map((item) => (
                  <a // Use <a> for intra-page links, Link for router links
                    key={item.label}
                    href={item.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    {item.label}
                  </a>
                ))}
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
