
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-8 animate-in text-center max-w-3xl mx-auto", className)}>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Discord Webhook Messenger
              </h1>
              <Badge 
                variant="secondary" 
                className="uppercase font-semibold text-[10px] tracking-wider py-0.5 bg-primary/20 text-primary border-none"
              >
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Send messages directly to Discord
            </p>
          </div>
        </div>
        
        <div className="border-b border-border/30 pb-6 mt-2 w-full">
          <p className="text-muted-foreground leading-relaxed">
            Send messages to Discord channels using webhooks. Enter your Discord webhook URL,
            compose your message with markdown formatting, and send it instantly.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg text-sm text-white/90 border border-primary/20">
        <Info className="h-5 w-5 text-primary" />
        <p>Enter your Discord webhook URL below, compose a message with markdown, and click send to deliver it instantly.</p>
      </div>
    </div>
  );
};

export default WebhookHeader;
