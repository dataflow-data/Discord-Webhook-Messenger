
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-10 animate-in text-center lg:text-left max-w-4xl mx-auto", className)}>
      <div className="flex flex-col gap-4 items-center lg:items-start">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-start">
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl shadow-sm">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Discord Webhook Messenger
              </h1>
              <Badge 
                variant="secondary" 
                className="uppercase font-semibold text-[10px] tracking-wider py-0.5 bg-primary/20 text-primary border-none"
              >
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Send messages directly to Discord
            </p>
          </div>
        </div>
        
        <div className="border-b border-border/30 pb-6 mt-2 w-full">
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Send messages to Discord channels using webhooks. Enter your Discord webhook URL,
            compose your message with markdown formatting, and send it instantly.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg text-sm text-white/90 border border-primary/20 max-w-2xl mx-auto lg:mx-0">
        <Info className="h-5 w-5 text-primary flex-shrink-0" />
        <p>Enter your Discord webhook URL below, compose a message with markdown, and click send to deliver it instantly.</p>
      </div>
    </div>
  );
};

export default WebhookHeader;
