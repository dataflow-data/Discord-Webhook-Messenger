
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-8 animate-in", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Webhook Messenger
              </h1>
              <Badge 
                variant="secondary" 
                className="uppercase font-semibold text-[10px] tracking-wider py-0.5 bg-primary/20 text-primary border-none"
              >
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Simple, powerful webhook messaging for any platform
            </p>
          </div>
        </div>
        
        <div className="border-b border-border/30 pb-6 mt-2">
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Webhooks provide a way to send automated messages to channels without needing a full application. 
            Configure your webhook below to start sending messages directly from this interface.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg text-sm text-white/90 border border-primary/20">
        <Info className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p>Webhooks allow you to send messages to specific channels without requiring a bot account.</p>
          <a href="#" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-xs mt-1">
            Learn more about webhooks <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WebhookHeader;
