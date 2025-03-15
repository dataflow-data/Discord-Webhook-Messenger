
import React, { useState } from "react";
import { Send, User, Image, ExternalLink, ChevronDown, ChevronUp, MessageSquare, Webhook, Info } from "lucide-react";
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <div className="space-y-2 sticky top-24">
            <div className="discord-sidebar-item active">
              <Webhook className="h-4 w-4" />
              <span>Webhook Setup</span>
            </div>
            <div className="discord-sidebar-item text-white/70">
              <MessageSquare className="h-4 w-4" />
              <span>Message Formatting</span>
            </div>
            <div className="discord-sidebar-item text-white/70">
              <User className="h-4 w-4" />
              <span>Authentication</span>
            </div>
          </div>
        </div>
        
        {/* Main Form Section */}
        <div className="lg:col-span-2">
          <Card className="discord-card shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6">
                <div className="space-y-1.5 mb-5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    Webhook Configuration
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Configure your webhook to send messages to Discord channels
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    {/* Webhook URL Field */}
                    <div className="relative">
                      <Label 
                        htmlFor="webhookUrl" 
                        className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/70"
                      >
                        WEBHOOK URL
                      </Label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={state.webhookUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className={cn(
                          "discord-input",
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
                        <div className="space-y-4 animate-fade-in pt-2 bg-muted p-4 rounded-lg">
                          <div>
                            <Label 
                              htmlFor="username" 
                              className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/70"
                            >
                              USERNAME
                            </Label>
                            <Input
                              id="username"
                              type="text"
                              placeholder="Custom Bot Name"
                              value={state.username}
                              onChange={(e) => updateField("username", e.target.value)}
                              className="discord-input"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Replace the default webhook username
                            </p>
                          </div>
                          
                          <div>
                            <Label 
                              htmlFor="avatarUrl" 
                              className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/70"
                            >
                              AVATAR URL
                            </Label>
                            <Input
                              id="avatarUrl"
                              type="url"
                              placeholder="https://example.com/avatar.png"
                              value={state.avatarUrl}
                              onChange={(e) => updateField("avatarUrl", e.target.value)}
                              className="discord-input"
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
                        className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/70"
                      >
                        MESSAGE CONTENT
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Type your message here..."
                        value={state.content}
                        onChange={(e) => updateField("content", e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="message-field min-h-[120px]"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">⌘</span>
                        <span>+</span>
                        <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">↵</span>
                        <span className="ml-1">to send</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <Button
                      type="submit"
                      disabled={!state.isValidUrl || !state.content.trim() || state.isSending}
                      className="w-full discord-button-primary"
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
              
              {/* Preview Card */}
              <div className="bg-muted w-full md:w-[280px] border-t md:border-t-0 md:border-l border-border p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Message Preview</h3>
                    <Info className="h-4 w-4 text-white/50" />
                  </div>
                  
                  <div className="bg-card rounded-lg p-3 border border-border/50">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8 rounded-full mt-0.5">
                        {state.avatarUrl ? (
                          <AvatarImage src={state.avatarUrl} alt="Bot Avatar" />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <Webhook className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm text-primary truncate max-w-[120px]">
                            {state.username || "Webhook Bot"}
                          </span>
                          <span className="text-[10px] text-white/50">Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        <div className="text-sm text-white/90 break-words">
                          {state.content || "Your message preview..."}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/50 space-y-2 mt-3">
                    <p>Messages sent directly to Discord. No content is stored.</p>
                  </div>
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
