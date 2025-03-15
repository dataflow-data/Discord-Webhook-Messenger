
import React from "react";
import { cn } from "@/lib/utils";
import { Github, Twitter, Discord, Heart } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-6 px-4 text-sm relative z-10 bg-card/50 backdrop-blur-sm border-t border-border/50",
      className
    )}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Discord className="h-5 w-5 text-primary" />
            <span className="text-white/90 text-sm font-medium">Discord Webhook Tool</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Support</a>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-white/70 hover:text-primary transition-colors rounded-full p-1.5 hover:bg-primary/10"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-primary transition-colors rounded-full p-1.5 hover:bg-primary/10"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-primary transition-colors rounded-full p-1.5 hover:bg-primary/10"
                aria-label="Discord"
              >
                <Discord className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="text-white/50 text-xs flex items-center gap-1.5">
            <span>&copy; {currentYear} Discord Webhook Tool</span>
            <span className="text-[10px] text-white/30">•</span>
            <span className="inline-flex items-center gap-1 text-white/40">
              Made with <Heart className="h-3 w-3 text-destructive/70" /> <span className="text-white/50">Unofficial</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
