
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Webhook, ShieldAlert } from "lucide-react";
import WebhookHeader from "@/components/WebhookHeader";
import WebhookDocumentation from "@/components/WebhookDocumentation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      {/* Modern header */}
      <header className="app-header py-4 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-sm">
                <Webhook className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">
                Webhook Messenger
              </span>
            </div>
            
            {/* Desktop Nav Items - simplified */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#documentation" className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#security" className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4 md:px-6 max-w-[1400px] mx-auto w-full">
        <WebhookHeader />
        
        <Alert className="bg-primary/5 border-primary/30 mb-8">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            This service implements advanced rate limiting and security measures to prevent abuse. Misuse may result in temporary blocks with increasing duration.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[55%]">
            <WebhookForm />
          </div>
          <div id="documentation" className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <WebhookDocumentation />
            
            <div id="security" className="mt-8 p-5 bg-card/60 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                Enhanced Security Measures
              </h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>Progressive rate limiting: Block duration increases with repeated violations</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>Content filtering to prevent spam, phishing, and malicious content</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>Suspicious pattern detection for username and avatar impersonation</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>URL validation and sanitization with strict image format requirements</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>Security event logging and analysis to detect abuse patterns</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
                  <span>Anti-spam measures: Detection of character repetition, excessive emoji, ASCII art</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
