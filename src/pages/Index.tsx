
import React, { useEffect } from "react";
import WebhookForm from "@/components/WebhookForm";
import Footer from "@/components/Footer";

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
      <main className="flex-1 py-12 px-4">
        <WebhookForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
