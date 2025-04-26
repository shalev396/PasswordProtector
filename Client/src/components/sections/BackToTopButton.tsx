import React from "react";
import { motion } from "framer-motion";

const BackToTopButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-up"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </motion.button>
    </div>
  );
};

export default BackToTopButton;
