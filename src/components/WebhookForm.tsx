
import React, { useState } from "react";
import { Send, User, Image, Link2, ChevronDown, ChevronUp, MessageSquare, Webhook, Info, AlertCircle, CheckCircle2, Copy, ExternalLink, MessageCircle, PanelLeft, Code, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWebhook } from "@/hooks/useWebhook";
import { cn } from "@/lib/utils";
import WebhookHeader from "./WebhookHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const WebhookForm: React.FC = () => {
  const { state, handleUrlChange, updateField, sendMessage } = useWebhook();
  const [showOptional, setShowOptional] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  
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
      <WebhookHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2 sticky top-[5.5rem]">
            <div className="sidebar-item active">
              <Webhook className="h-4 w-4" />
              <span>Webhook Setup</span>
            </div>
            <div className="sidebar-item text-white/70">
              <MessageSquare className="h-4 w-4" />
              <span>Message Formatting</span>
            </div>
            <div className="sidebar-item text-white/70">
              <User className="h-4 w-4" />
              <span>Authentication</span>
            </div>
            <div className="sidebar-item text-white/70">
              <Link2 className="h-4 w-4" />
              <span>API References</span>
            </div>
            <div className="sidebar-item text-white/70">
              <Code className="h-4 w-4" />
              <span>Examples</span>
            </div>
            <div className="sidebar-item text-white/70">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </div>
          </div>
        </div>
        
        {/* Main Form Section */}
        <div className="lg:col-span-4">
          <Card className="app-card shadow-lg overflow-hidden animate-in card-gradient border-border/30">
            <div className="flex flex-col">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-card/80 to-card border-b border-border/30 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Webhook className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Webhook Configuration</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-secondary/50 border-border/50 hover:bg-secondary"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    API Docs
                  </Button>
                </div>
              </div>
              
              {/* Tabs Navigation */}
              <div className="p-1 bg-card/90 border-b border-border/30">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-9 bg-muted/70">
                    <TabsTrigger 
                      value="message" 
                      className="text-xs font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </TabsTrigger>
                    <TabsTrigger 
                      value="advanced" 
                      className="text-xs font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Code className="h-3.5 w-3.5 mr-1.5" />
                      Advanced
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Message Tab Content */}
                  <TabsContent value="message" className="pt-0 border-none outline-none">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 p-6">
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
                      
                      {/* Preview Panel */}
                      <div className="w-full sm:w-[280px] border-t sm:border-t-0 sm:border-l border-border/30 bg-gradient-to-b from-muted/30 to-card/50 p-5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white">Message Preview</h3>
                            <Badge 
                              variant="outline" 
                              className="text-[10px] py-0 h-4 px-1.5 border-border/40 text-muted-foreground"
                            >
                              LIVE
                            </Badge>
                          </div>
                          
                          <div className="bg-card rounded-lg p-3 border border-border/20 card-highlight">
                            <div className="flex items-start gap-2">
                              <Avatar className="h-8 w-8 rounded-full mt-0.5 border border-border/20">
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
                                  <span className="text-[10px] text-white/50">Now</span>
                                </div>
                                
                                <div className="text-sm text-white/90 break-words">
                                  {state.content || "Your message preview..."}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-white/50 space-y-2 mt-3">
                            <p>Messages sent directly to the endpoint. No content is stored.</p>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-3">
                              <span className="text-white/80 text-[11px] font-medium uppercase">Documentation</span>
                              <a href="#" className="text-primary text-xs hover:underline flex items-center gap-1">
                                View
                                <ChevronRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Advanced Tab Content */}
                  <TabsContent value="advanced" className="pt-0 border-none outline-none">
                    <div className="p-6">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-4 rounded-lg border border-border/30 text-center">
                        <p className="text-sm text-muted-foreground">
                          Advanced webhook configuration coming soon.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebhookForm;
