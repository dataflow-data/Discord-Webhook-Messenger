
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Bell, User, Search, LayoutGrid, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebhookHeader from "@/components/WebhookHeader";

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
      <header className="app-header py-3 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Webhook className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Webhook Messenger
              </span>
            </div>
            
            {/* Desktop Nav Items - simplified */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                Tools
              </span>
              <span className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Documentation
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:flex items-center gap-3">
              <button className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full">
                <Bell className="h-5 w-5" />
              </button>
            </div>
            
            <Button variant="secondary" className="bg-secondary/60 border border-border/30 hover:bg-secondary/80">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <div className="hidden md:flex ml-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10">
                <User className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 max-w-[1200px] mx-auto w-full">
        <WebhookHeader />
        <WebhookForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
