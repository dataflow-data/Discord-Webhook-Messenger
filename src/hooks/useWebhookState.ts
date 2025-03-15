
import { useState, useEffect } from "react";
import { WebhookState } from "./useWebhook";
import { isValidWebhookUrl } from "@/services/webhookService";

// Initialize and manage webhook form state
export const useWebhookState = () => {
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
  
  // Set sending state
  const setSending = (isSending: boolean) => {
    setState(prevState => ({
      ...prevState,
      isSending
    }));
  };
  
  return {
    state,
    handleUrlChange,
    updateField,
    resetContent,
    setSending
  };
};
