
import React, { useState, useEffect } from "react";
import { Send, ChevronDown, ChevronUp, MessageSquare, Webhook, Info, AlertCircle, CheckCircle2, Image, Shield, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWebhook } from "@/hooks/useWebhook";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WebhookForm: React.FC = () => {
  const { 
    state, 
    handleUrlChange, 
    updateField, 
    sendMessage, 
    usageCount, 
    isBlockedTemporarily,
    formattedBlockTime,
    securityViolations
  } = useWebhook();
  
  const [showOptional, setShowOptional] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  
  // Show security alert to first-time users
  useEffect(() => {
    const hasSeenAlert = localStorage.getItem("security-alert-shown");
    if (!hasSeenAlert) {
      setShowSecurityAlert(true);
      localStorage.setItem("security-alert-shown", "true");
    }
  }, []);
  
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
      {showSecurityAlert && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500">
          <Shield className="h-4 w-4" />
          <AlertTitle>Responsible Use Notice</AlertTitle>
          <AlertDescription className="text-sm">
            This tool sends messages to Discord webhooks. Please use responsibly and respect Discord's Terms of Service.
            Abuse may result in IP blocking or other security measures.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-background/30 border-amber-500/20 hover:bg-background/50 text-amber-500"
              onClick={() => setShowSecurityAlert(false)}
            >
              I understand
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isBlockedTemporarily && (
        <Alert className="mb-4 bg-destructive/10 border-destructive/30 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Block Active</AlertTitle>
          <AlertDescription>
            <p>Your access is temporarily blocked due to rate limiting or security violations.</p>
            <div className="flex items-center gap-2 mt-1.5 bg-destructive/5 p-2 rounded-md">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formattedBlockTime()}</span>
              <span className="text-xs">remaining</span>
            </div>
            {securityViolations > 1 && (
              <p className="mt-2 text-xs flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Multiple violations detected. Block duration increases with each violation.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {usageCount > 8 && !isBlockedTemporarily && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500">
          <Info className="h-4 w-4" />
          <AlertTitle>Usage Limit Approaching</AlertTitle>
          <AlertDescription>
            You've sent {usageCount} messages. Rate limits may apply after 10 messages in a 5-minute period.
          </AlertDescription>
        </Alert>
      )}
      
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
                      placeholder="https://discord.com/api/webhooks/..."
                      value={state.webhookUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={cn(
                        "form-input pr-10",
                        state.webhookUrl && !state.isValidUrl && "border-destructive focus:ring-destructive/50"
                      )}
                      required
                      disabled={isBlockedTemporarily}
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
                    disabled={isBlockedTemporarily}
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
                          disabled={isBlockedTemporarily}
                          maxLength={80}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Override the default username (blocked terms: discord, admin, mod, system, etc.)
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
                          disabled={isBlockedTemporarily}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Override the default avatar image (only https:// URLs with .jpg, .png, .gif, or .webp)
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
                      disabled={isBlockedTemporarily}
                      maxLength={2000}
                    />
                    
                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors text-white/70 hover:text-white"
                        title="Format text"
                        disabled={isBlockedTemporarily}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button" 
                        className="p-1.5 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors text-white/70 hover:text-white"
                        title="Add image"
                        disabled={isBlockedTemporarily}
                      >
                        <Image className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">⌘</span>
                      <span>+</span>
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] font-medium">↵</span>
                      <span className="ml-1">to send message</span>
                    </p>
                    {state.content && (
                      <p className="text-xs text-muted-foreground">
                        {state.content.length}/2000
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border/30 flex justify-end">
                <Button
                  type="submit"
                  disabled={!state.isValidUrl || !state.content.trim() || state.isSending || isBlockedTemporarily}
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
      
      {/* Security information for users */}
      <div className="mt-6 p-4 rounded-lg bg-card/40 border border-border/30 text-sm">
        <h3 className="text-primary font-medium mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Enhanced Security Measures
        </h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
            <span>Progressive rate limiting: Block duration increases with repeated violations</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
            <span>Enhanced content filtering: Blocks malicious content, spam patterns, and prohibited words</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
            <span>URL validation: Only allows secure image URLs with common formats (.jpg, .png, .gif, .webp)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
            <span>Username restrictions: Prevents impersonation of Discord staff or system accounts</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
            <span>Security event logging: All suspicious activity is logged for review</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WebhookForm;
