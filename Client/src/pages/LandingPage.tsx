import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { generateRandomPassword } from "@/lib/passwordGenerator";

// Import section components
import HeroSection from "@/components/sections/HeroSection";
import SecuritySection from "@/components/sections/SecuritySection";
import ZeroKnowledgeSection from "@/components/sections/ZeroKnowledgeSection";
import EncryptionFlowSection from "@/components/sections/EncryptionFlowSection";
import DecryptionDemoSection from "@/components/sections/DecryptionDemoSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import BackToTopButton from "@/components/sections/BackToTopButton";
import Divider from "@/components/sections/Divider";

const LandingPage: React.FC = () => {
  // We keep some state and functions that might still be needed
  const [passwordLength] = useState(12);
  const [decryptedPassword] = useState("MySecretPass123!");

  // Refs for GSAP animations - these will be passed to child components if needed
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const securitySectionRef = useRef<HTMLDivElement>(null);
  const securityTextRef = useRef<HTMLDivElement>(null);
  const securityImageRef = useRef<HTMLDivElement>(null);

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

  const generatePassword = () => {
    generateRandomPassword(passwordLength, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Divider />
        <SecuritySection />
        <Divider />
        <ZeroKnowledgeSection />
        <Divider />
        <EncryptionFlowSection />
        <Divider />
        <DecryptionDemoSection />
        <Divider />
        <FeaturesSection />
        <BackToTopButton />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
