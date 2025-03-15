
import React from "react";
import Footer from "@/components/Footer";
import { Webhook, ShieldAlert } from "lucide-react";
import SecurityContent from "@/components/SecurityContent";

const Security: React.FC = () => {
  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="app-header py-4 px-4 md:px-6 sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-sm">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">
                Webhook Messenger Security
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4 md:px-6 max-w-[1400px] mx-auto w-full">
        <SecurityContent className="w-full max-w-3xl mx-auto" />
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;
