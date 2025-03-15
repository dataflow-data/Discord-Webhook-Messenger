
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Webhook, MessageSquare } from "lucide-react";
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
    <div className="app-container min-h-screen flex flex-col bg-[#36393F]">
      {/* Discord-styled header */}
      <header className="app-header py-3 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-md bg-[#2F3136]/90 border-b border-[#202225]/50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5865F2] to-[#5865F2]/60 rounded-lg flex items-center justify-center">
                <Webhook className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Discord Webhook
              </span>
            </div>
            
            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#documentation" className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Documentation
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 max-w-[1200px] mx-auto w-full">
        <WebhookHeader />
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-3/5">
            <WebhookForm />
          </div>
          <div id="documentation" className="w-full lg:w-2/5">
            <WebhookDocumentation />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
