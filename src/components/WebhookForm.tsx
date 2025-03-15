
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWebhook } from "@/hooks/useWebhook";
import { cn } from "@/lib/utils";
import WebhookHeader from "./WebhookHeader";

const WebhookForm: React.FC = () => {
  const { state, handleUrlChange, updateField, sendMessage } = useWebhook();
  const [showOptional, setShowOptional] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="webhook-container px-4 py-8 animate-slide-up">
      <WebhookHeader />
      
      <Card className="p-6 shadow-lg border border-border/50 bg-card/95 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="webhookUrl" 
                className="text-sm font-medium mb-1.5 block"
              >
                Discord Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={state.webhookUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={cn(
                  "transition-all duration-200 bg-background/50 border-input",
                  state.webhookUrl && !state.isValidUrl && "border-destructive focus:ring-destructive/50"
                )}
                required
              />
              {state.webhookUrl && !state.isValidUrl && (
                <p className="text-destructive text-sm mt-1 animate-fade-in">
                  Please enter a valid Discord webhook URL
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 focus:outline-none"
              >
                {showOptional ? "Hide" : "Show"} optional settings
              </button>
              
              {showOptional && (
                <div className="space-y-4 animate-fade-in pt-2">
                  <div>
                    <Label 
                      htmlFor="username" 
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Username Override (optional)
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Custom Bot Name"
                      value={state.username}
                      onChange={(e) => updateField("username", e.target.value)}
                      className="bg-background/50 border-input"
                    />
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="avatarUrl" 
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Avatar URL Override (optional)
                    </Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      placeholder="https://example.com/avatar.png"
                      value={state.avatarUrl}
                      onChange={(e) => updateField("avatarUrl", e.target.value)}
                      className="bg-background/50 border-input"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <Label 
                htmlFor="content" 
                className="text-sm font-medium mb-1.5 block"
              >
                Message
              </Label>
              <Textarea
                id="content"
                placeholder="Type your message here..."
                value={state.content}
                onChange={(e) => updateField("content", e.target.value)}
                onKeyDown={handleKeyDown}
                className="message-field bg-background/50 border-input min-h-[120px]"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Press Ctrl+Enter or Cmd+Enter to send quickly
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!state.isValidUrl || !state.content.trim() || state.isSending}
              className="w-full group"
            >
              {state.isSending ? (
                <span className="inline-flex items-center">
                  <span className="animate-pulse">Sending</span>
                  <span className="ml-1 opacity-70">...</span>
                </span>
              ) : (
                <span className="inline-flex items-center">
                  Send Message
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in">
        Messages are sent directly to Discord via webhooks. <br />
        No data is stored on our servers.
      </p>
    </div>
  );
};

export default WebhookForm;
