
import { useState, useEffect } from "react";
import { 
  WebhookMessageData, 
  sendWebhookMessage, 
  isValidWebhookUrl, 
  validateContent, 
  validateUsername,
  validateAvatarUrl,
  getSecurityLogs
} from "@/services/webhookService";
import { toast } from "sonner";

export interface WebhookState {
  webhookUrl: string;
  username: string;
  avatarUrl: string;
  content: string;
  isSending: boolean;
  isValidUrl: boolean;
}

// Security constants
const MAX_MESSAGES_PERIOD = 10;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const TEMP_BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const PROGRESSIVE_BLOCK_MULTIPLIER = 2; // Doubles block time for repeated violations

export const useWebhook = () => {
  // Initialize state from localStorage if available
  const [state, setState] = useState<WebhookState>(() => {
    const savedData = localStorage.getItem("webhook-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          webhookUrl: parsed.webhookUrl || "",
          username: parsed.username || "",
          avatarUrl: parsed.avatarUrl || "",
          content: "",
          isSending: false,
          isValidUrl: parsed.webhookUrl ? isValidWebhookUrl(parsed.webhookUrl) : false,
        };
      } catch (e) {
        console.error("Failed to parse saved webhook data:", e);
      }
    }
    
    return {
      webhookUrl: "",
      username: "",
      avatarUrl: "",
      content: "",
      isSending: false,
      isValidUrl: false,
    };
  });
  
  // Track usage for rate limiting
  const [usageHistory, setUsageHistory] = useState<number[]>(() => {
    const savedHistory = localStorage.getItem("webhook-usage-history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  // Track security violations for progressive blocking
  const [securityViolations, setSecurityViolations] = useState<number>(() => {
    return parseInt(localStorage.getItem("webhook-security-violations") || "0", 10);
  });
  
  const [isBlockedTemporarily, setIsBlockedTemporarily] = useState<boolean>(() => {
    const blockUntil = localStorage.getItem("webhook-blocked-until");
    if (blockUntil) {
      const blockTime = parseInt(blockUntil, 10);
      return blockTime > Date.now();
    }
    return false;
  });

  const [blockRemainingTime, setBlockRemainingTime] = useState<number>(0);
  
  // Check if user is still blocked on mount and update remaining time
  useEffect(() => {
    const blockUntil = localStorage.getItem("webhook-blocked-until");
    if (blockUntil) {
      const blockTime = parseInt(blockUntil, 10);
      if (blockTime > Date.now()) {
        setIsBlockedTemporarily(true);
        
        // Update remaining time every second
        const interval = setInterval(() => {
          const remaining = Math.max(0, blockTime - Date.now());
          setBlockRemainingTime(remaining);
          
          if (remaining === 0) {
            setIsBlockedTemporarily(false);
            localStorage.removeItem("webhook-blocked-until");
            clearInterval(interval);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        // No longer blocked
        localStorage.removeItem("webhook-blocked-until");
      }
    }
  }, []);
  
  // Save security violations to localStorage
  useEffect(() => {
    localStorage.setItem("webhook-security-violations", securityViolations.toString());
  }, [securityViolations]);
  
  // Save usage history to localStorage
  useEffect(() => {
    localStorage.setItem("webhook-usage-history", JSON.stringify(usageHistory));
  }, [usageHistory]);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      webhookUrl: state.webhookUrl,
      username: state.username,
      avatarUrl: state.avatarUrl,
    };
    
    localStorage.setItem("webhook-data", JSON.stringify(dataToSave));
  }, [state.webhookUrl, state.username, state.avatarUrl]);
  
  // Clean up old usage history entries
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setUsageHistory(prev => prev.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS));
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Calculate current usage count in the rate limit window
  const usageCount = usageHistory.filter(
    timestamp => Date.now() - timestamp < RATE_LIMIT_WINDOW_MS
  ).length;
  
  // Format remaining block time as mm:ss
  const formattedBlockTime = () => {
    if (!blockRemainingTime) return "0:00";
    const minutes = Math.floor(blockRemainingTime / 60000);
    const seconds = Math.floor((blockRemainingTime % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle URL change and validation
  const handleUrlChange = (url: string) => {
    setState({
      ...state,
      webhookUrl: url,
      isValidUrl: isValidWebhookUrl(url),
    });
  };
  
  // Update form fields
  const updateField = (field: keyof WebhookState, value: string) => {
    setState({
      ...state,
      [field]: value,
    });
  };
  
  // Reset content field
  const resetContent = () => {
    setState({
      ...state,
      content: "",
    });
  };
  
  // Block user temporarily with progressive duration
  const applyTemporaryBlock = (reason: string) => {
    // Increment violation count
    const newViolationCount = securityViolations + 1;
    setSecurityViolations(newViolationCount);
    
    // Calculate block duration with progressive increase
    const blockDuration = TEMP_BLOCK_DURATION_MS * Math.pow(PROGRESSIVE_BLOCK_MULTIPLIER, Math.min(newViolationCount - 1, 3));
    const blockUntil = Date.now() + blockDuration;
    
    localStorage.setItem("webhook-blocked-until", blockUntil.toString());
    setIsBlockedTemporarily(true);
    setBlockRemainingTime(blockDuration);
    
    // Format minutes for display
    const blockMinutes = Math.ceil(blockDuration / 60000);
    
    toast.error(`${reason} You're temporarily blocked for ${blockMinutes} minutes.`);
    
    // Set timeout to automatically unblock
    setTimeout(() => {
      setIsBlockedTemporarily(false);
      localStorage.removeItem("webhook-blocked-until");
      setBlockRemainingTime(0);
    }, blockDuration);
  };
  
  // Perform rate limiting check
  const checkRateLimit = (): boolean => {
    if (isBlockedTemporarily) {
      return false;
    }
    
    // If we're over the threshold, block temporarily
    if (usageCount >= MAX_MESSAGES_PERIOD) {
      applyTemporaryBlock("Rate limit exceeded.");
      return false;
    }
    
    return true;
  };
  
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
    
    setState({
      ...state,
      isSending: true,
    });
    
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
        setUsageHistory(prev => [...prev, Date.now()]);
        
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
      setState((prevState) => ({
        ...prevState,
        isSending: false,
      }));
    }
  };
  
  // Reset security violations (for testing)
  const resetSecurityViolations = () => {
    setSecurityViolations(0);
    localStorage.setItem("webhook-security-violations", "0");
  };
  
  // Clear security block (for testing)
  const clearSecurityBlock = () => {
    setIsBlockedTemporarily(false);
    localStorage.removeItem("webhook-blocked-until");
    setBlockRemainingTime(0);
  };
  
  return {
    state,
    handleUrlChange,
    updateField,
    resetContent,
    sendMessage,
    usageCount,
    isBlockedTemporarily,
    blockRemainingTime,
    formattedBlockTime,
    securityViolations,
    resetSecurityViolations,
    clearSecurityBlock,
    getSecurityLogs
  };
};
