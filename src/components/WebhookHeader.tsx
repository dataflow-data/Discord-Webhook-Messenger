
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook, Info, Discord } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-8 animate-in text-center max-w-3xl mx-auto", className)}>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-[#5865F2]/20 p-3 rounded-xl">
            <Webhook className="h-6 w-6 text-[#5865F2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Discord Webhook Messenger
              </h1>
              <Badge 
                variant="secondary" 
                className="uppercase font-semibold text-[10px] tracking-wider py-0.5 bg-[#5865F2]/20 text-[#5865F2] border-none"
              >
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Send messages directly to your Discord channels
            </p>
          </div>
        </div>
        
        <div className="border-b border-border/30 pb-6 mt-2 w-full">
          <p className="text-muted-foreground leading-relaxed">
            Send custom messages to Discord channels using webhooks. Enter your Discord webhook URL,
            compose your message with markdown formatting, and deliver it instantly to your server.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-3 bg-gradient-to-r from-[#5865F2]/10 to-transparent p-4 rounded-lg text-sm text-white/90 border border-[#5865F2]/20">
        <Info className="h-5 w-5 text-[#5865F2]" />
        <p>To get started, create a webhook in your Discord server settings and paste the URL below.</p>
      </div>
    </div>
  );
};

export default WebhookHeader;
