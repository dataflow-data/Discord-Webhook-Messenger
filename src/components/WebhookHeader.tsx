
import React from "react";
import { cn } from "@/lib/utils";
import { Webhook, Info, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebhookHeaderProps {
  className?: string;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ className }) => {
  return (
    <div className={cn("mb-8 animate-in", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Webhook className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Webhook Messenger
              </h1>
              <Badge 
                variant="secondary" 
                className="uppercase font-semibold text-[10px] tracking-wider py-0.5 bg-primary/20 text-primary border-none"
              >
                Beta
              </Badge>
            </div>
            <div className="flex text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span>Resources</span>
                <ArrowRight className="h-3 w-3 mt-0.5" />
                <span className="text-primary">Webhook Tools</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-border/70 pb-6 mt-2">
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Webhooks provide a way to send automated messages to text channels without needing a Discord application. 
            Configure your webhook below to start sending messages directly from this interface.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 bg-secondary/40 border border-border/50 p-3 rounded-lg text-sm text-white/80">
        <Info className="h-4 w-4 text-primary/90" />
        <p>Discord webhooks allow you to send messages to specific channels without requiring a bot account.</p>
      </div>
    </div>
  );
};

export default WebhookHeader;
