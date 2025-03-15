
import React from "react";
import { Send, ChevronDown, ChevronUp, MessageSquare, Info, AlertCircle, CheckCircle2, Image, FileText, BookImage, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { WebhookState } from "@/hooks/useWebhook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebhookFormFieldsProps {
  state: WebhookState;
  showOptional: boolean;
  isBlockedTemporarily: boolean;
  handleUrlChange: (url: string) => void;
  updateField: (field: keyof WebhookState, value: string) => void;
  toggleOptional: () => void;
  toggleEmbed: () => void;
  toggleTermsAccepted: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const WebhookFormFields: React.FC<WebhookFormFieldsProps> = ({
  state,
  showOptional,
  isBlockedTemporarily,
  handleUrlChange,
  updateField,
  toggleOptional,
  toggleEmbed,
  toggleTermsAccepted,
  handleKeyDown,
  handleSubmit
}) => {
  // Handle image upload for text messages
  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) { // 8MB limit for Discord
        alert("Image is too large. Maximum size is 8MB.");
        return;
      }
      
      // Use direct URL input instead of file upload (in a real app, you'd upload to a hosting service)
      const reader = new FileReader();
      reader.onload = () => {
        updateField("contentImageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image upload for embeds
  const handleEmbedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) { // 8MB limit for Discord
        alert("Image is too large. Maximum size is 8MB.");
        return;
      }
      
      // Use direct URL input instead of file upload (in a real app, you'd upload to a hosting service)
      const reader = new FileReader();
      reader.onload = () => {
        updateField("embedImageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to clear image URL
  const clearContentImage = () => {
    updateField("contentImageUrl", "");
  };
  
  // Function to clear embed image URL
  const clearEmbedImage = () => {
    updateField("embedImageUrl", "");
  };

  return (
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
            onClick={toggleOptional}
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
        
        {/* Message Format Tabs */}
        <div className="pt-2 border-t border-border/30">
          <Tabs 
            defaultValue={state.useEmbed ? "embed" : "text"} 
            className="w-full"
            onValueChange={(value) => {
              if (value === "embed" && !state.useEmbed) {
                toggleEmbed();
              } else if (value === "text" && state.useEmbed) {
                toggleEmbed();
              }
            }}
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text" disabled={isBlockedTemporarily}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Message
              </TabsTrigger>
              <TabsTrigger value="embed" disabled={isBlockedTemporarily}>
                <FileText className="h-4 w-4 mr-2" />
                Rich Embed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              {/* Message Content Field for Text */}
              <div>
                <Label 
                  htmlFor="content" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  MESSAGE CONTENT
                  {(!state.contentImageUrl) && <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>}
                </Label>
                <div className="relative">
                  <Textarea
                    id="content"
                    placeholder="Type your message here..."
                    value={state.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="message-field min-h-[120px]"
                    required={!state.contentImageUrl && !state.useEmbed}
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
              
              {/* Image Upload for Text Messages */}
              <div>
                <Label 
                  htmlFor="contentImage" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  ATTACH IMAGE
                  {(!state.content) && <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>}
                </Label>
                
                {!state.contentImageUrl ? (
                  <div className="border-2 border-dashed border-border/50 rounded-md p-6 text-center hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Image className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag & drop an image here or click to browse</p>
                      <input
                        id="contentImage"
                        type="file"
                        accept="image/*"
                        onChange={handleContentImageUpload}
                        className="hidden"
                        disabled={isBlockedTemporarily}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('contentImage')?.click()}
                        disabled={isBlockedTemporarily}
                      >
                        Choose Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Maximum file size: 8MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border rounded-md overflow-hidden">
                    <div className="relative pt-[56.25%]">
                      <img 
                        src={state.contentImageUrl} 
                        alt="Message attachment" 
                        className="absolute inset-0 w-full h-full object-contain bg-background/50" 
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearContentImage}
                      disabled={isBlockedTemporarily}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-1.5">
                  Either message content or an image is required
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4">
              {/* Embed Fields */}
              <div>
                <Label 
                  htmlFor="embedTitle" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                >
                  EMBED TITLE
                </Label>
                <Input
                  id="embedTitle"
                  type="text"
                  placeholder="Your embed title"
                  value={state.embedTitle}
                  onChange={(e) => updateField("embedTitle", e.target.value)}
                  className="form-input"
                  disabled={isBlockedTemporarily}
                  maxLength={256}
                />
              </div>
              
              <div>
                <Label 
                  htmlFor="embedDescription" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                >
                  EMBED DESCRIPTION
                </Label>
                <Textarea
                  id="embedDescription"
                  placeholder="Your embed description..."
                  value={state.embedDescription}
                  onChange={(e) => updateField("embedDescription", e.target.value)}
                  className="message-field min-h-[120px]"
                  disabled={isBlockedTemporarily}
                  maxLength={4000}
                />
                <div className="flex justify-end mt-1.5">
                  {state.embedDescription && (
                    <p className="text-xs text-muted-foreground">
                      {state.embedDescription.length}/4000
                    </p>
                  )}
                </div>
              </div>
              
              {/* Embed Image Upload */}
              <div>
                <Label 
                  htmlFor="embedImage" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  EMBED IMAGE
                </Label>
                
                {!state.embedImageUrl ? (
                  <div className="border-2 border-dashed border-border/50 rounded-md p-6 text-center hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <BookImage className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Add an image to your embed</p>
                      <input
                        id="embedImage"
                        type="file"
                        accept="image/*"
                        onChange={handleEmbedImageUpload}
                        className="hidden"
                        disabled={isBlockedTemporarily}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('embedImage')?.click()}
                        disabled={isBlockedTemporarily}
                      >
                        Choose Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Maximum file size: 8MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border rounded-md overflow-hidden">
                    <div className="relative pt-[56.25%]">
                      <img 
                        src={state.embedImageUrl} 
                        alt="Embed image" 
                        className="absolute inset-0 w-full h-full object-contain bg-background/50" 
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearEmbedImage}
                      disabled={isBlockedTemporarily}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <Label 
                  htmlFor="embedColor" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                >
                  EMBED COLOR
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="embedColor"
                    type="color"
                    value={state.embedColor}
                    onChange={(e) => updateField("embedColor", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                    disabled={isBlockedTemporarily}
                  />
                  <Input
                    type="text"
                    value={state.embedColor}
                    onChange={(e) => updateField("embedColor", e.target.value)}
                    placeholder="#5865F2"
                    className="w-32"
                    maxLength={7}
                    disabled={isBlockedTemporarily}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  The color for the embed's left border (hex format)
                </p>
              </div>
              
              <div>
                <Label 
                  htmlFor="content" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80"
                >
                  ADDITIONAL MESSAGE (OPTIONAL)
                </Label>
                <Textarea
                  id="content"
                  placeholder="Add an optional message above the embed..."
                  value={state.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  className="message-field min-h-[80px]"
                  disabled={isBlockedTemporarily}
                  maxLength={2000}
                />
                {state.content && (
                  <div className="flex justify-end mt-1.5">
                    <p className="text-xs text-muted-foreground">
                      {state.content.length}/2000
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Terms and Conditions Checkbox */}
        <div className="pt-4 border-t border-border/30">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={state.termsAccepted}
              onCheckedChange={toggleTermsAccepted}
              disabled={isBlockedTemporarily}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                I understand that I am responsible for the content I send using this tool and will not abuse it.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-border/30 flex justify-end">
        <Button
          type="submit"
          disabled={
            !state.isValidUrl || 
            ((!state.content.trim() && !state.contentImageUrl) && !state.useEmbed) || 
            (state.useEmbed && !state.embedTitle.trim() && !state.embedDescription.trim() && !state.embedImageUrl) || 
            !state.termsAccepted ||
            state.isSending || 
            isBlockedTemporarily
          }
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
  );
};

export default WebhookFormFields;
