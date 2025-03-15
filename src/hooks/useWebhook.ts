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
  
  // Check if validations pass - relaxed validation
  const validateInputs = (): boolean => {
    // Skip validation if already blocked
    if (isBlockedTemporarily) {
      toast.error("You're currently blocked from sending messages. Please wait for the block to expire.");
      return false;
    }
    
    if (!state.isValidUrl) {
      toast.error("Please enter a valid webhook URL");
      return false;
    }
    
    // Check if terms are accepted
    if (!state.termsAccepted) {
      toast.error("You must accept the terms before sending");
      return false;
    }
    
    // If not using embeds, at least content is required (image URL is optional)
    if (!state.useEmbed && !state.content.trim()) {
      toast.error("Message content is required when not using embeds");
      return false;
    }
    
    // If using embeds, at least title, description, or image is required
    if (state.useEmbed && !state.embedTitle.trim() && !state.embedDescription.trim() && !state.embedImageUrl.trim()) {
      toast.error("Embed must have at least a title, description, or image");
      return false;
    }
    
    // Relaxed content validation - only check length
    if (state.content.trim()) {
      if (state.content.length > 2000) {
        toast.error("Message content exceeds maximum length of 2000 characters");
        return false;
      }
    }

    // Validate content image if provided - relaxed validation
    if (state.contentImageUrl.trim() && !state.useEmbed) {
      // Check if it's a data URL (direct upload)
      if (state.contentImageUrl.startsWith('data:image/')) {
        toast.error("Discord webhooks don't support direct image uploads. Please use an image URL from a hosting service instead.");
        return false;
      }
      
      if (!state.contentImageUrl.startsWith('https://')) {
        toast.error("Image URL must use HTTPS.");
        return false;
      }
    }

    // Validate embed image if provided - relaxed validation
    if (state.embedImageUrl.trim() && state.useEmbed) {
      // Check if it's a data URL (direct upload)
      if (state.embedImageUrl.startsWith('data:image/')) {
        toast.error("Discord webhooks don't support direct image uploads. Please use an image URL from a hosting service instead.");
        return false;
      }
      
      if (!state.embedImageUrl.startsWith('https://')) {
        toast.error("Image URL must use HTTPS.");
        return false;
      }
    }
    
    // Check username length only
    if (state.username && state.username.length > 80) {
      toast.error("Username exceeds maximum length of 80 characters");
      return false;
    }
    
    // Check avatar URL protocol only
    if (state.avatarUrl && !state.avatarUrl.startsWith('https://')) {
      toast.error("Avatar URL must use HTTPS");
      return false;
    }
    
    return true;
  };
  
  // Send message function
  const sendMessage = async () => {
    // First check if blocked before doing any validation
    if (isBlockedTemporarily) {
      toast.error(`You're currently blocked from sending messages. Please wait ${formattedBlockTime()} before trying again.`);
      return;
    }
    
    console.log("Validating inputs...");
    if (!validateInputs()) {
      return;
    }
    
    console.log("Checking rate limit...");
    // Check rate limiting
    if (!checkRateLimit()) {
      return;
    }
    
    console.log("Preparing to send message...");
    console.log("Current state:", state);
    
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
          embed.image = { url: state.embedImageUrl };
        }
        
        // Add the embed to the message
        messageData.embeds = [embed];
      }
      
      console.log("Sending message data:", JSON.stringify(messageData));
      const result = await sendWebhookMessage(state.webhookUrl, messageData);
      console.log("Send result:", result);
      
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
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message. Please try again.");
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
