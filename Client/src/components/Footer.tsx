import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 px-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          {/* Can add logo here later */}
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Password Protector. All rights
            reserved.
          </p>
        </div>
        {/* Optional: Add social links or other footer links here */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {/* <Link href="#" className="hover:underline">Privacy Policy</Link>
           <Link href="#" className="hover:underline">Terms of Service</Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
