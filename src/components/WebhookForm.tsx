
import React, { useState } from "react";
import { Send, User, Image, ChevronDown, ChevronUp, MessageSquare, Webhook, Info, AlertCircle, CheckCircle2, Hash } from "lucide-react";
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
      <Card className="app-card shadow-lg overflow-hidden animate-in border-[#202225] bg-[#2F3136] max-w-3xl mx-auto">
        <div className="flex flex-col">
          {/* Card Header - Discord style */}
          <div className="bg-gradient-to-r from-[#5865F2]/20 to-[#2F3136] border-b border-[#202225] p-5">
            <div className="flex items-center gap-3">
              <div className="bg-[#5865F2]/15 p-2 rounded-lg">
                <Hash className="h-5 w-5 text-[#5865F2]" />
              </div>
              <h2 className="text-lg font-semibold text-white">Discord Webhook Message</h2>
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
                    DISCORD WEBHOOK URL
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>
                  </Label>
                  <div className="relative">
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={state.webhookUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={cn(
                        "form-input pr-10 bg-[#40444B] border-[#202225]",
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
                      Please enter a valid Discord webhook URL
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Info className="h-3 w-3 text-[#5865F2]/70" />
                    <span>Find this in your Discord server's Integrations settings</span>
                  </p>
                </div>
                
                {/* Optional Settings Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="text-xs flex items-center gap-1.5 text-[#5865F2] hover:text-[#5865F2]/80 transition-colors mb-2 focus:outline-none"
                  >
                    {showOptional ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showOptional ? "Hide" : "Show"} webhook identity
                  </button>
                  
                  {showOptional && (
                    <div className="space-y-4 animate-in pt-2 bg-[#202225]/50 p-4 rounded-lg border border-[#202225]">
                      <div>
                        <Label 
                          htmlFor="username" 
                          className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                        >
                          BOT USERNAME
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Override webhook bot name"
                          value={state.username}
                          onChange={(e) => updateField("username", e.target.value)}
                          className="form-input bg-[#40444B] border-[#202225]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Customize the sender name (defaults to webhook name)
                        </p>
                      </div>
                      
                      <div>
                        <Label 
                          htmlFor="avatarUrl" 
                          className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                        >
                          BOT AVATAR URL
                        </Label>
                        <Input
                          id="avatarUrl"
                          type="url"
                          placeholder="https://example.com/avatar.png"
                          value={state.avatarUrl}
                          onChange={(e) => updateField("avatarUrl", e.target.value)}
                          className="form-input bg-[#40444B] border-[#202225]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Custom avatar image URL (defaults to webhook avatar)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message Content Field - Discord styled */}
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
                      placeholder="Message @everyone with your announcement..."
                      value={state.content}
                      onChange={(e) => updateField("content", e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="message-field min-h-[120px] bg-[#40444B] border-[#202225]"
                      required
                    />
                    
                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-[#202225]/70 hover:bg-[#202225] transition-colors text-white/70 hover:text-white"
                        title="Format as markdown"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-[#202225]/70 hover:bg-[#202225] transition-colors text-white/70 hover:text-white"
                        title="Add image"
                      >
                        <Image className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-[#202225] text-[10px] font-medium">⌘</span>
                      <span>+</span>
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-[#202225] text-[10px] font-medium">↵</span>
                      <span className="ml-1">to send</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Supports Discord markdown</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[#202225] flex justify-end">
                <Button
                  type="submit"
                  disabled={!state.isValidUrl || !state.content.trim() || state.isSending}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
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
                      Send to Discord
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
