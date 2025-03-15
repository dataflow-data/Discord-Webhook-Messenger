
import React, { useState } from "react";
import { Send, User, Image, ChevronDown, ChevronUp, MessageSquare, Webhook, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWebhook } from "@/hooks/useWebhook";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="webhook-container animate-in">
      <Card className="app-card shadow-lg overflow-hidden animate-in card-gradient border-border/30 max-w-3xl mx-auto">
        <div className="flex flex-col">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary/20 to-card/80 border-b border-border/30 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 p-2 rounded-lg">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-white">Send Webhook Message</h2>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                {/* Webhook URL Field */}
                <div className="relative">
                  <Label 
                    htmlFor="webhookUrl" 
                    className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                  >
                    WEBHOOK URL
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>
                  </Label>
                  <div className="relative">
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://example.com/webhooks/..."
                      value={state.webhookUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={cn(
                        "form-input pr-10",
                        state.webhookUrl && !state.isValidUrl && "border-destructive focus:ring-destructive/50"
                      )}
                      required
                    />
                    {state.webhookUrl && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {state.isValidUrl ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 animate-in" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive animate-in" />
                        )}
                      </div>
                    )}
                  </div>
                  {state.webhookUrl && !state.isValidUrl && (
                    <p className="text-destructive text-xs mt-1 animate-in flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Please enter a valid webhook URL
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Info className="h-3 w-3 text-primary/70" />
                    <span>Find this in your platform settings</span>
                  </p>
                </div>
                
                {/* Optional Settings Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="text-xs flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors mb-2 focus:outline-none"
                  >
                    {showOptional ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showOptional ? "Hide" : "Show"} sender identity
                  </button>
                  
                  {showOptional && (
                    <div className="space-y-4 animate-in pt-2 bg-muted/50 p-4 rounded-lg border border-border/30">
                      <div>
                        <Label 
                          htmlFor="username" 
                          className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                        >
                          USERNAME
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Custom Bot Name"
                          value={state.username}
                          onChange={(e) => updateField("username", e.target.value)}
                          className="form-input"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Override the default username
                        </p>
                      </div>
                      
                      <div>
                        <Label 
                          htmlFor="avatarUrl" 
                          className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                        >
                          AVATAR URL
                        </Label>
                        <Input
                          id="avatarUrl"
                          type="url"
                          placeholder="https://example.com/avatar.png"
                          value={state.avatarUrl}
                          onChange={(e) => updateField("avatarUrl", e.target.value)}
                          className="form-input"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Override the default avatar image
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message Content Field */}
                <div className="pt-2">
                  <Label 
                    htmlFor="content" 
                    className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                  >
                    MESSAGE CONTENT
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="content"
                      placeholder="Type your message here..."
                      value={state.content}
                      onChange={(e) => updateField("content", e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="message-field min-h-[120px]"
                      required
                    />
                    
                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors text-white/70 hover:text-white"
                        title="Format text"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors text-white/70 hover:text-white"
                        title="Add image"
                      >
                        <Image className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">⌘</span>
                    <span>+</span>
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">↵</span>
                    <span className="ml-1">to send message</span>
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border/30 flex justify-end">
                <Button
                  type="submit"
                  disabled={!state.isValidUrl || !state.content.trim() || state.isSending}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                >
                  {state.isSending ? (
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse delay-75"></span>
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse delay-150"></span>
                      <span className="ml-1">Sending</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebhookForm;
