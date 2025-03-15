
import React from "react";
import { cn } from "@/lib/utils";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("text-center space-y-2 mb-8", className)}>
      <span className="inline-block px-2.5 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium tracking-wide animate-fade-in">
        Discord Integration
      </span>
      
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance animate-slide-down">
        Discord Webhook Messenger
      </h1>
      
      <p className="text-muted-foreground max-w-md mx-auto text-balance animate-fade-in">
        Send messages directly to your Discord server using webhooks.
        Simple, secure, and beautifully designed.
      </p>
    </div>
  );
};

export default WebhookHeader;
