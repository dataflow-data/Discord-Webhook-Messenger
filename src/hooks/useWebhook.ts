
import { WebhookMessageData, sendWebhookMessage, validateContent, validateUsername, validateAvatarUrl, getSecurityLogs } from "@/services/webhookService";
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
    
    const messageData: WebhookMessageData = {
      content: state.content,
    };
    
    if (state.username.trim()) {
      messageData.username = state.username;
    }
    
    if (state.avatarUrl.trim()) {
      messageData.avatar_url = state.avatarUrl;
    }
    
    // Add image to text message if provided
    if (state.contentImageUrl.trim() && !state.useEmbed) {
      messageData.content = state.content.trim() 
        ? `${state.content}\n${state.contentImageUrl}` 
        : state.contentImageUrl;
    }
    
    // Add embeds if needed
    if (state.useEmbed) {
      // Parse color from hex to decimal
      let colorDecimal;
      if (state.embedColor && state.embedColor.startsWith("#")) {
        colorDecimal = parseInt(state.embedColor.slice(1), 16);
      }
      
      messageData.embeds = [{
        title: state.embedTitle || undefined,
        description: state.embedDescription || undefined,
        color: colorDecimal,
        image: state.embedImageUrl ? { url: state.embedImageUrl } : undefined
      }];
    }
    
    try {
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
