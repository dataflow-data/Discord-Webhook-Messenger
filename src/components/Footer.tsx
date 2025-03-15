
import React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-6 px-4 mt-12 text-center text-sm text-muted-foreground",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <p>
          &copy; {currentYear} Discord Webhook Messenger. All rights reserved.
        </p>
        <p className="mt-1">
          Not affiliated with Discord Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
