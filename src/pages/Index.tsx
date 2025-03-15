
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";
import { MessagesSquare } from "lucide-react";

const Index: React.FC = () => {
  // Add subtle background animation on component mount
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 via-background to-background" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <header className="py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <MessagesSquare className="h-8 w-8 text-primary mr-2" />
          <span className="text-xl font-semibold">Webhook Messenger</span>
        </div>
      </header>
      
      <main className="flex-1 py-6 px-4">
        <WebhookForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
