
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
  isSending: boolean;
  isValidUrl: boolean;
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
    
    if (!state.content.trim()) {
      toast.error("Message cannot be empty");
      return false;
    }
    
    // Check additional content validation
    const contentValidation = validateContent(state.content);
    if (!contentValidation.valid) {
      toast.error(contentValidation.reason || "Invalid message content");
      return false;
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
  
  return {
    state,
    handleUrlChange,
    updateField,
    sendMessage,
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
