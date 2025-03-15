
import { useState, useEffect } from "react";
import { WebhookMessageData, sendWebhookMessage, isValidWebhookUrl, validateContent, validateUsername } from "@/services/webhookService";
import { toast } from "sonner";

export interface WebhookState {
  webhookUrl: string;
  username: string;
  avatarUrl: string;
  content: string;
  isSending: boolean;
  isValidUrl: boolean;
}

// Rate limiting constants
const MAX_MESSAGES_PERIOD = 10;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const TEMP_BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

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
  
  const [isBlockedTemporarily, setIsBlockedTemporarily] = useState<boolean>(() => {
    const blockUntil = localStorage.getItem("webhook-blocked-until");
    if (blockUntil) {
      const blockTime = parseInt(blockUntil, 10);
      return blockTime > Date.now();
    }
    return false;
  });
  
  // Check if user is still blocked on mount
  useEffect(() => {
    const blockUntil = localStorage.getItem("webhook-blocked-until");
    if (blockUntil) {
      const blockTime = parseInt(blockUntil, 10);
      if (blockTime > Date.now()) {
        setIsBlockedTemporarily(true);
        
        // Set timeout to unblock
        const timeoutId = setTimeout(() => {
          setIsBlockedTemporarily(false);
          localStorage.removeItem("webhook-blocked-until");
        }, blockTime - Date.now());
        
        return () => clearTimeout(timeoutId);
      } else {
        // No longer blocked
        localStorage.removeItem("webhook-blocked-until");
      }
    }
  }, []);
  
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
  
  // Perform rate limiting check
  const checkRateLimit = (): boolean => {
    if (isBlockedTemporarily) {
      return false;
    }
    
    // If we're over the threshold, block temporarily
    if (usageCount >= MAX_MESSAGES_PERIOD) {
      const blockUntil = Date.now() + TEMP_BLOCK_DURATION_MS;
      localStorage.setItem("webhook-blocked-until", blockUntil.toString());
      setIsBlockedTemporarily(true);
      
      // Set timeout to automatically unblock
      setTimeout(() => {
        setIsBlockedTemporarily(false);
        localStorage.removeItem("webhook-blocked-until");
      }, TEMP_BLOCK_DURATION_MS);
      
      toast.error(`Rate limit exceeded. You can send messages again in ${TEMP_BLOCK_DURATION_MS / 60000} minutes.`);
      return false;
    }
    
    return true;
  };
  
  // Send message function
  const sendMessage = async () => {
    if (!state.isValidUrl) {
      toast.error("Please enter a valid webhook URL");
      return;
    }
    
    if (!state.content.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    // Check additional content validation
    const contentValidation = validateContent(state.content);
    if (!contentValidation.valid) {
      toast.error(contentValidation.reason || "Invalid message content");
      return;
    }
    
    // Check username validation if provided
    if (state.username) {
      const usernameValidation = validateUsername(state.username);
      if (!usernameValidation.valid) {
        toast.error(usernameValidation.reason || "Invalid username");
        return;
      }
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
  
  return {
    state,
    handleUrlChange,
    updateField,
    resetContent,
    sendMessage,
    usageCount,
    isBlockedTemporarily,
  };
};
