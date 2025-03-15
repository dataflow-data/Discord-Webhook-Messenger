
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook } from "lucide-react";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Webhook className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Webhooks
          </h1>
        </div>
        
        <div className="border-b border-border pb-6 mt-2">
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Use webhooks to send messages to text channels without needing a Discord application. 
            Configure your webhook below to begin sending messages directly from this interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebhookHeader;
