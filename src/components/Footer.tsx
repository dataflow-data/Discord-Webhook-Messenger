
import React from "react";
import { cn } from "@/lib/utils";
import { Github, Twitter } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-6 px-4 mt-8 text-sm relative z-10 border-t border-border",
      className
    )}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
              alt="Discord Logo"
              className="w-5 h-4 object-contain"
            />
            <span className="text-white/90 text-sm">Discord Webhook Tool</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Support</a>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-white/50 text-xs">
            &copy; {currentYear} Discord Webhook Tool (unofficial)
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
