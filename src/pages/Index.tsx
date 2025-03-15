
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Webhook } from "lucide-react";

const Index: React.FC = () => {
  // Add subtle background animation on component mount
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      {/* Discord-inspired header */}
      <header className="border-b border-border/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center gap-2">
            <Webhook className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">webhook.dev</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full">
        <WebhookForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
