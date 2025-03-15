
import React from "react";
import { 
  Send, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Image, 
  FileText, 
  BookImage, 
  Trash2, 
  Link, 
  User, 
  AtSign, 
  Palette, 
  File, 
  Terminal, 
  BookText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { WebhookState } from "@/hooks/useWebhook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
  // Function to clear content image URL
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
            <Link className="h-3.5 w-3.5 text-primary/80" />
            WEBHOOK URL
            <div className="w-1.5 h-1.5 rounded-full bg-destructive/70 mt-0.5"></div>
          </Label>
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Terminal className="h-4 w-4" />
              </div>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={state.webhookUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={cn(
                  "form-input pl-10 pr-10",
                  state.webhookUrl && !state.isValidUrl && "border-destructive focus:ring-destructive/50"
                )}
                required
                disabled={isBlockedTemporarily}
              />
            </div>
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
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5 text-primary/80" />
                  USERNAME
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <AtSign className="h-4 w-4" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Custom Bot Name"
                    value={state.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className="form-input pl-10"
                    disabled={isBlockedTemporarily}
                    maxLength={80}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Override the default username (blocked terms: discord, admin, mod, system, etc.)
                </p>
              </div>
              
              <div>
                <Label 
                  htmlFor="avatarUrl" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <Image className="h-3.5 w-3.5 text-primary/80" />
                  AVATAR URL
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Link className="h-4 w-4" />
                  </div>
                  <Input
                    id="avatarUrl"
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={state.avatarUrl}
                    onChange={(e) => updateField("avatarUrl", e.target.value)}
                    className="form-input pl-10"
                    disabled={isBlockedTemporarily}
                  />
                </div>
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
                  <MessageSquare className="h-3.5 w-3.5 text-primary/80" />
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
                    required={!state.useEmbed}
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
              
              {/* Image URL for Text Messages - Now Optional */}
              <div>
                <Label 
                  htmlFor="contentImageUrl" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <BookImage className="h-3.5 w-3.5 text-primary/80" />
                  IMAGE URL (OPTIONAL)
                </Label>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Link className="h-4 w-4" />
                    </div>
                    <Input
                      id="contentImageUrl"
                      type="url"
                      placeholder="https://example.com/image.png"
                      value={state.contentImageUrl}
                      onChange={(e) => updateField("contentImageUrl", e.target.value)}
                      className="pl-10 flex-1"
                      disabled={isBlockedTemporarily}
                    />
                  </div>
                  {state.contentImageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={clearContentImage}
                      disabled={isBlockedTemporarily}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 text-yellow-200/80">
                  <AlertCircle className="h-3 w-3" />
                  <span>Discord only accepts image URLs. You must host your images elsewhere first.</span>
                </p>
                
                <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <p className="text-xs text-white/80 flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>
                      To use images, upload them to an image hosting service like Imgur, Discord CDN, or similar, 
                      then paste the direct image URL here. Discord does not accept direct file uploads through webhooks.
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4">
              {/* Embed Fields */}
              <div>
                <Label 
                  htmlFor="embedTitle" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <BookText className="h-3.5 w-3.5 text-primary/80" />
                  EMBED TITLE
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <File className="h-4 w-4" />
                  </div>
                  <Input
                    id="embedTitle"
                    type="text"
                    placeholder="Your embed title"
                    value={state.embedTitle}
                    onChange={(e) => updateField("embedTitle", e.target.value)}
                    className="form-input pl-10"
                    disabled={isBlockedTemporarily}
                    maxLength={256}
                  />
                </div>
              </div>
              
              <div>
                <Label 
                  htmlFor="embedDescription" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5 text-primary/80" />
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
              
              {/* Embed Image URL Input */}
              <div>
                <Label 
                  htmlFor="embedImageUrl" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <Image className="h-3.5 w-3.5 text-primary/80" />
                  EMBED IMAGE URL
                </Label>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Link className="h-4 w-4" />
                    </div>
                    <Input
                      id="embedImageUrl"
                      type="url"
                      placeholder="https://example.com/image.png"
                      value={state.embedImageUrl}
                      onChange={(e) => updateField("embedImageUrl", e.target.value)}
                      className="pl-10 flex-1"
                      disabled={isBlockedTemporarily}
                    />
                  </div>
                  {state.embedImageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={clearEmbedImage}
                      disabled={isBlockedTemporarily}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 text-yellow-200/80">
                  <AlertCircle className="h-3 w-3" />
                  <span>Discord only accepts image URLs. You must host your images elsewhere first.</span>
                </p>
                
                <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <p className="text-xs text-white/80 flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>
                      To use images, upload them to an image hosting service like Imgur, Discord CDN, or similar, 
                      then paste the direct image URL here. Discord does not accept direct file uploads through webhooks.
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <Label 
                  htmlFor="embedColor" 
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <Palette className="h-3.5 w-3.5 text-primary/80" />
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
                  className="text-xs font-medium uppercase tracking-wider mb-1.5 text-white/80 flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-primary/80" />
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
            (!state.content.trim() && !state.useEmbed) || 
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
