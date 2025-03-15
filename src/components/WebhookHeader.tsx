
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook } from "lucide-react";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl animate-fade-in text-white">
          Discord Webhook Configuration
        </h1>
        
        <p className="text-muted-foreground text-balance animate-fade-in max-w-2xl">
          Configure and send messages directly to your Discord server using webhooks.
          Complete the form below to begin sending messages.
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-accent/80 animate-fade-in mb-8">
        <Webhook className="h-4 w-4" />
        <span>Messages sent directly to your Discord server via webhooks</span>
      </div>
    </div>
  );
};

export default WebhookHeader;
