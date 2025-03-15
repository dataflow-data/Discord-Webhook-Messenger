import { WebhookMessageData, sendWebhookMessage, validateContent, validateUsername, validateAvatarUrl, getSecurityLogs, validateImageUrl } from "@/services/webhookService";
import { toast } from "sonner";
import { useWebhookState } from "./useWebhookState";
import { useSecurityBlocking } from "./useSecurityBlocking";
import { useRateLimiting } from "./useRateLimiting";

export interface WebhookState {
  webhookUrl: string;
  username: string;
  avatarUrl: string;
  content: string;
  contentImageUrl: string;
  isSending: boolean;
  isValidUrl: boolean;
  useEmbed: boolean;
  embedTitle: string;
  embedDescription: string;
  embedColor: string;
  embedImageUrl: string;
  termsAccepted: boolean;
}

export const useWebhook = () => {
  // Get state management from hooks
  const { state, handleUrlChange, updateField, resetContent, setSending } = useWebhookState();
  const { 
    securityViolations, 
    isBlockedTemporarily, 
    formattedBlockTime, 
    applyTemporaryBlock,
    resetSecurityViolations, 
    clearSecurityBlock 
  } = useSecurityBlocking();
  
  const { 
    usageCount, 
    checkRateLimit, 
    recordUsage, 
    resetUsageHistory 
  } = useRateLimiting(isBlockedTemporarily, applyTemporaryBlock);
  
  // Check if validations pass
  const validateInputs = (): boolean => {
    if (!state.isValidUrl) {
      toast.error("Please enter a valid webhook URL");
      return false;
    }
    
    // Check if terms are accepted
    if (!state.termsAccepted) {
      toast.error("You must accept the terms before sending");
      return false;
    }
    
    // If not using embeds, content or image is required
    if (!state.useEmbed && !state.content.trim() && !state.contentImageUrl.trim()) {
      toast.error("Message content or image is required when not using embeds");
      return false;
    }
    
    // If using embeds, at least title, description, or image is required
    if (state.useEmbed && !state.embedTitle.trim() && !state.embedDescription.trim() && !state.embedImageUrl.trim()) {
      toast.error("Embed must have at least a title, description, or image");
      return false;
    }
    
    // Check additional content validation if content exists
    if (state.content.trim()) {
      const contentValidation = validateContent(state.content);
      if (!contentValidation.valid) {
        toast.error(contentValidation.reason || "Invalid message content");
        return false;
      }
    }

    // Validate content image if provided
    if (state.contentImageUrl.trim() && !state.useEmbed) {
      const imageValidation = validateImageUrl(state.contentImageUrl);
      if (!imageValidation.valid) {
        toast.error(imageValidation.reason || "Invalid image format or size");
        return false;
      }
    }

    // Validate embed image if provided
    if (state.embedImageUrl.trim() && state.useEmbed) {
      const imageValidation = validateImageUrl(state.embedImageUrl);
      if (!imageValidation.valid) {
        toast.error(imageValidation.reason || "Invalid embed image format or size");
        return false;
      }
    }
    
    // Check username validation if provided
    if (state.username) {
      const usernameValidation = validateUsername(state.username);
      if (!usernameValidation.valid) {
        toast.error(usernameValidation.reason || "Invalid username");
        return false;
      }
    }
    
    // Check avatar URL validation if provided
    if (state.avatarUrl) {
      const avatarValidation = validateAvatarUrl(state.avatarUrl);
      if (!avatarValidation.valid) {
        toast.error(avatarValidation.reason || "Invalid avatar URL");
        return false;
      }
    }
    
    return true;
  };
  
  // Send message function
  const sendMessage = async () => {
    if (!validateInputs()) {
      return;
    }
    
    // Check rate limiting
    if (!checkRateLimit()) {
      return;
    }
    
    setSending(true);
    
    try {
      // Prepare the message data
      const messageData: WebhookMessageData = {
        content: state.content,
      };
      
      // Add username if provided
      if (state.username.trim()) {
        messageData.username = state.username;
      }
      
      // Add avatar URL if provided
      if (state.avatarUrl.trim()) {
        messageData.avatar_url = state.avatarUrl;
      }
      
      // Handle text message with image
      if (!state.useEmbed) {
        // If we have an image URL (for non-embed messages)
        if (state.contentImageUrl.trim()) {
          // If it's a data URL, we need to tell the user we can't send it directly
          if (state.contentImageUrl.startsWith('data:image/')) {
            toast.error("Discord webhooks don't support direct image uploads. Please host your image and provide the URL.");
            setSending(false);
            return;
          }
          
          // For regular URLs, append to message content
          messageData.content = state.content.trim() 
            ? `${state.content}\n${state.contentImageUrl}` 
            : state.contentImageUrl;
        }
      } else {
        // Handle embed with proper formatting
        // Parse color from hex to decimal
        let colorDecimal;
        if (state.embedColor && state.embedColor.startsWith("#")) {
          colorDecimal = parseInt(state.embedColor.slice(1), 16);
        }
        
        // Create properly formatted embed
        const embed: any = {};
        
        // Only add properties that have values to keep the embed clean
        if (state.embedTitle.trim()) {
          embed.title = state.embedTitle;
        }
        
        if (state.embedDescription.trim()) {
          embed.description = state.embedDescription;
        }
        
        if (colorDecimal) {
          embed.color = colorDecimal;
        }
        
        // Add embed image if provided
        if (state.embedImageUrl.trim()) {
          // If it's a data URL, we need to tell the user we can't send it directly
          if (state.embedImageUrl.startsWith('data:image/')) {
            toast.error("Discord embeds don't support data URLs for images. Please host your image and provide the URL.");
            setSending(false);
            return;
          }
          
          // For regular URLs, add to embed
          embed.image = { url: state.embedImageUrl };
        }
        
        // Add the embed to the message
        messageData.embeds = [embed];
      }
      
      const result = await sendWebhookMessage(state.webhookUrl, messageData);
      
      if (result.success) {
        // Record this successful usage for rate limiting
        recordUsage();
        
        toast.success(result.message);
        resetContent();
      } else {
        toast.error(result.message);
        
        // Apply block if security action is returned
        if (result.securityAction) {
          applyTemporaryBlock("Security violation detected.");
        }
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setSending(false);
    }
  };
  
  // Toggle the terms accepted state
  const toggleTermsAccepted = () => {
    updateField("termsAccepted", state.termsAccepted ? "" : "true");
  };
  
  // Toggle embed mode
  const toggleEmbed = () => {
    updateField("useEmbed", state.useEmbed ? "" : "true");
  };
  
  return {
    state,
    handleUrlChange,
    updateField,
    sendMessage,
    toggleTermsAccepted,
    toggleEmbed,
    usageCount,
    isBlockedTemporarily,
    formattedBlockTime,
    securityViolations,
    resetSecurityViolations,
    clearSecurityBlock,
    getSecurityLogs,
    resetUsageHistory
  };
};
