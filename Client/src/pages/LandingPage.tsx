import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-blue-950">
      <div className="text-center p-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 dark:bg-blue-500 rounded-full mb-6 shadow-lg">
          <LockKeyhole className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          Welcome to Password Protector
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          The secure and easy way to manage all your passwords. Never forget a
          password again and keep your online accounts safe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="shadow-md">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="shadow-md">
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-0 p-4 text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Password Protector. All rights
        reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
