
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { LogOut, Menu, ChevronsLeft, Bell, User, Search, LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      {/* Discord Developer Portal-inspired header */}
      <header className="discord-header py-3 px-4 md:px-6 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Discord Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
                alt="Discord Logo"
                className="w-8 h-6 object-contain"
              />
              <span className="hidden md:block text-lg font-semibold tracking-tight text-white">
                Developer Portal
              </span>
            </div>
            
            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6">
              <div className="h-5 w-[1px] bg-border/80"></div>
              <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                Tools
              </span>
              <span className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Documentation
              </span>
              <span className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Applications
              </span>
              <span className="text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                Team
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
            
            <button className="md:hidden text-white/70 hover:text-white transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              <div className="h-[28px] w-[1px] bg-border/80"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/5 transition-colors text-sm font-medium text-white/80 hover:text-white">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 max-w-[1200px] mx-auto w-full">
        <WebhookForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
