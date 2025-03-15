
import React from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-6 px-4 mt-8 text-center text-sm text-muted-foreground relative z-10",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for Discord communities</span>
          </div>
          
          <p className="text-xs opacity-75">
            &copy; {currentYear} Discord Webhook Messenger. All rights reserved.
          </p>
          
          <p className="text-xs opacity-60 mt-1">
            Not affiliated with Discord Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
