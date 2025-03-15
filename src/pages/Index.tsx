
import React, { useEffect, useState } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { Webhook, ShieldAlert, X } from "lucide-react";
import WebhookHeader from "@/components/WebhookHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);
  
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
        <div className="container mx-auto flex items-center justify-between">
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
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-12 container mx-auto">
        <WebhookHeader />
        
        {showSecurityAlert && (
          <Alert className="bg-primary/5 border-primary/30 mb-8 mx-auto relative">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm pr-8">
              This service implements advanced rate limiting and security measures to prevent abuse. Misuse may result in temporary blocks with increasing duration.
            </AlertDescription>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-primary/10" 
              onClick={() => setShowSecurityAlert(false)}
            >
              <X className="h-3.5 w-3.5 text-primary/80" />
              <span className="sr-only">Close</span>
            </Button>
          </Alert>
        )}
        
        <div className="flex flex-col gap-8 items-center w-full">
          <WebhookForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
