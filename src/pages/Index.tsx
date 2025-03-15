
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Webhook } from "lucide-react";
import WebhookHeader from "@/components/WebhookHeader";
import WebhookDocumentation from "@/components/WebhookDocumentation";

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
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4 md:px-6 max-w-[1400px] mx-auto w-full">
        <WebhookHeader />
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[55%]">
            <WebhookForm />
          </div>
          <div id="documentation" className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <WebhookDocumentation />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
