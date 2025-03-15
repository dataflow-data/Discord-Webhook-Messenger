
import { useState, useEffect } from "react";
import { WebhookMessageData, sendWebhookMessage, isValidWebhookUrl } from "@/services/webhookService";
import { toast } from "sonner";

export interface WebhookState {
  webhookUrl: string;
  username: string;
  avatarUrl: string;
  content: string;
  isSending: boolean;
  isValidUrl: boolean;
}

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
  
  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      webhookUrl: state.webhookUrl,
      username: state.username,
      avatarUrl: state.avatarUrl,
    };
    
    localStorage.setItem("webhook-data", JSON.stringify(dataToSave));
  }, [state.webhookUrl, state.username, state.avatarUrl]);
  
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
  };
};
