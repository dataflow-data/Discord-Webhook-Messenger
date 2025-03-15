
import React, { useState } from "react";
import { Send, User, Image, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
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
      
      <Card className="p-6 shadow-xl border border-border/50 bg-card/95 backdrop-blur-sm rounded-xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Label 
                htmlFor="webhookUrl" 
                className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5 text-primary/70" />
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
                  state.webhookUrl && !state.isValidUrl && "border-destructive focus:ring-destructive/50",
                  "pr-10"
                )}
                required
              />
              {state.webhookUrl && (
                <div className="absolute right-3 top-[34px]">
                  {state.isValidUrl ? (
                    <div className="text-green-500 animate-fade-in h-5 w-5 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  ) : (
                    <div className="text-destructive animate-fade-in h-5 w-5 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-destructive"></div>
                    </div>
                  )}
                </div>
              )}
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
                className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-2 focus:outline-none"
              >
                {showOptional ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showOptional ? "Hide" : "Show"} optional settings
              </button>
              
              {showOptional && (
                <div className="space-y-4 animate-fade-in pt-2 bg-muted/30 p-3 rounded-lg">
                  <div>
                    <Label 
                      htmlFor="username" 
                      className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
                    >
                      <User className="h-3.5 w-3.5 text-primary/70" />
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Replace the default webhook name
                    </p>
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor="avatarUrl" 
                      className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
                    >
                      <Image className="h-3.5 w-3.5 text-primary/70" />
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Replace the default webhook avatar image
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-3">
              <Label 
                htmlFor="content" 
                className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5 text-primary/70" />
                Message
              </Label>
              <Textarea
                id="content"
                placeholder="Type your message here..."
                value={state.content}
                onChange={(e) => updateField("content", e.target.value)}
                onKeyDown={handleKeyDown}
                className="message-field bg-background/50 border-input min-h-[120px] focus:border-primary/30"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">⌘</span>
                <span>+</span>
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">↵</span>
                <span className="ml-1">to send quickly</span>
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!state.isValidUrl || !state.content.trim() || state.isSending}
              className="w-full group relative overflow-hidden"
            >
              <span className="relative z-10 inline-flex items-center">
                {state.isSending ? (
                  <>
                    <span className="animate-pulse">Sending</span>
                    <span className="ml-1 opacity-70">...</span>
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transform group-hover:scale-105 transition-transform duration-300"></div>
            </Button>
          </div>
        </form>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground mt-8 animate-fade-in delay-300 space-y-1">
        <p>
          Messages are sent directly to Discord via webhooks.
        </p>
        <p className="text-xs">
          No data is stored on our servers. Your information remains private.
        </p>
      </div>
    </div>
  );
};

export default WebhookForm;
