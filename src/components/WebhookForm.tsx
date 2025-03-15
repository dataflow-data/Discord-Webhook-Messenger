
import React, { useState } from "react";
import { Send, User, Image, ExternalLink, ChevronDown, ChevronUp, MessageSquare, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWebhook } from "@/hooks/useWebhook";
import { cn } from "@/lib/utils";
import WebhookHeader from "./WebhookHeader";
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
    <div className="webhook-container animate-fade-in">
      <WebhookHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Main Form Section */}
        <div className="md:col-span-3">
          <Card className="bg-card border-border/30 overflow-hidden shadow-lg">
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Webhook className="h-5 w-5 text-primary" />
                  Webhook Configuration
                </h2>
                <p className="text-sm text-muted-foreground">
                  Set up your webhook details to send messages to Discord
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  {/* Webhook URL Field */}
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
                        "transition-all duration-200 bg-secondary border-input",
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
                  
                  {/* Optional Settings Toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOptional(!showOptional)}
                      className="text-sm flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors mb-2 focus:outline-none"
                    >
                      {showOptional ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {showOptional ? "Hide" : "Show"} optional settings
                    </button>
                    
                    {showOptional && (
                      <div className="space-y-4 animate-fade-in pt-2 bg-secondary/30 p-4 rounded-lg border border-border/30">
                        <div>
                          <Label 
                            htmlFor="username" 
                            className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          >
                            <User className="h-3.5 w-3.5 text-primary/70" />
                            Username Override
                          </Label>
                          <Input
                            id="username"
                            type="text"
                            placeholder="Custom Bot Name"
                            value={state.username}
                            onChange={(e) => updateField("username", e.target.value)}
                            className="bg-secondary border-input"
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
                            Avatar URL Override
                          </Label>
                          <Input
                            id="avatarUrl"
                            type="url"
                            placeholder="https://example.com/avatar.png"
                            value={state.avatarUrl}
                            onChange={(e) => updateField("avatarUrl", e.target.value)}
                            className="bg-secondary border-input"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Replace the default webhook avatar image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content Field */}
                  <div className="pt-2">
                    <Label 
                      htmlFor="content" 
                      className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-primary/70" />
                      Message Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Type your message here..."
                      value={state.content}
                      onChange={(e) => updateField("content", e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="message-field min-h-[120px] focus:border-primary/60 bg-secondary"
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
                    className="w-full bg-accent hover:bg-accent/90"
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
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="md:col-span-2">
          <Card className="bg-card border-border/30 overflow-hidden shadow-lg h-full">
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Message Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                  How your message will appear in Discord
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4 border border-border/30">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 rounded-full">
                    {state.avatarUrl ? (
                      <AvatarImage src={state.avatarUrl} alt="Bot Avatar" />
                    ) : (
                      <AvatarFallback className="bg-accent text-white">
                        <Webhook className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-accent">
                        {state.username || "Webhook Bot"}
                      </span>
                      <span className="text-xs text-muted-foreground">Today at {new Date().toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="text-foreground break-words">
                      {state.content || "Your message will appear here..."}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-3">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <p>Messages are sent directly from your browser to Discord</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <p>No message content is stored on our servers</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <p>Preview may differ slightly from actual Discord appearance</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebhookForm;
