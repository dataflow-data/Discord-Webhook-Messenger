
import React from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-6 px-4 text-sm relative z-10 bg-background/50 backdrop-blur-sm border-t border-border/30",
      className
    )}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-white/90 text-sm font-medium">Webhook Messenger</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-6">
              <a href="/documentation" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">
                Documentation
              </a>
              
              <a href="/security" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">
                Security
              </a>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-white/70 hover:text-white transition-colors text-sm">Terms</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <div className="mt-4 space-y-4 text-sm">
                      <p>These Terms of Service ("Terms") govern your access to and use of the Webhook Messenger service ("Service"). By using the Service, you agree to be bound by these Terms.</p>
                      
                      <h4 className="font-semibold text-foreground">1. Acceptable Use</h4>
                      <p>You agree to use this Service in compliance with all applicable laws and Discord's Terms of Service. You are solely responsible for the content you send through our Service.</p>
                      
                      <h4 className="font-semibold text-foreground">2. Limitations</h4>
                      <p>The Service implements rate limiting and security measures to prevent abuse. Misuse may result in temporary blocks of your access.</p>
                      
                      <h4 className="font-semibold text-foreground">3. Disclaimer</h4>
                      <p>The Service is provided "as is" without warranties of any kind. We are not responsible for any damages that may result from your use of the Service.</p>
                      
                      <h4 className="font-semibold text-foreground">4. Modifications</h4>
                      <p>We reserve the right to modify these Terms at any time. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms.</p>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-white/70 hover:text-white transition-colors text-sm">Privacy</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <div className="mt-4 space-y-4 text-sm">
                      <p>This Privacy Policy describes how Webhook Messenger ("we", "our", or "us") collects, uses, and shares your information when you use our Service.</p>
                      
                      <h4 className="font-semibold text-foreground">1. Information We Collect</h4>
                      <p>We collect usage data such as timestamps of messages sent for rate limiting purposes. We do not store the content of messages you send through our Service.</p>
                      
                      <h4 className="font-semibold text-foreground">2. How We Use Information</h4>
                      <p>We use the information we collect solely for security purposes and to prevent abuse of our Service. This includes enforcing rate limits and temporary blocking.</p>
                      
                      <h4 className="font-semibold text-foreground">3. Data Storage</h4>
                      <p>Usage data is stored in your browser's localStorage and is not transmitted to our servers. This data is automatically cleared after the rate limit window expires.</p>
                      
                      <h4 className="font-semibold text-foreground">4. Your Rights</h4>
                      <p>You can clear all stored data by clearing your browser's localStorage. No personal data is retained on our servers.</p>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="text-white/50 text-xs flex items-center gap-1.5">
            <span>&copy; {currentYear} Webhook Messenger</span>
            <span className="text-[10px] text-white/30">•</span>
            <span className="inline-flex items-center gap-1 text-white/40">
              Made with <Heart className="h-3 w-3 text-destructive/70" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
