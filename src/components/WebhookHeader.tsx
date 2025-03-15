
import React from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, Webhook } from "lucide-react";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("text-center space-y-4 mb-8", className)}>
      <div className="inline-flex items-center justify-center space-x-2 mb-1">
        <Webhook className="h-5 w-5 text-primary" />
        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium tracking-wide animate-fade-in">
          Discord Integration
        </span>
        <MessageSquare className="h-5 w-5 text-primary" />
      </div>
      
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance animate-slide-down relative">
        Discord Webhook Messenger
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary/30 rounded-full"></div>
      </h1>
      
      <p className="text-muted-foreground max-w-md mx-auto text-balance animate-fade-in">
        Send messages directly to your Discord server using webhooks.
        Simple, secure, and beautifully designed.
      </p>
      
      <div className="pt-1 flex justify-center">
        <div className="inline-flex items-center text-xs text-muted-foreground gap-2 animate-fade-in delay-150">
          <Send className="h-3 w-3" />
          <span>Messages sent instantly</span>
        </div>
      </div>
    </div>
  );
};

export default WebhookHeader;
