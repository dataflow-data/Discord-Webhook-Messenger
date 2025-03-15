
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
          contentImageUrl: "",
          isSending: false,
          isValidUrl: parsed.webhookUrl ? isValidWebhookUrl(parsed.webhookUrl) : false,
          useEmbed: parsed.useEmbed || false,
          embedTitle: parsed.embedTitle || "",
          embedDescription: parsed.embedDescription || "",
          embedColor: parsed.embedColor || "#5865F2", // Discord blue as default
          embedImageUrl: "",
          termsAccepted: false,
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
      contentImageUrl: "",
      isSending: false,
      isValidUrl: false,
      useEmbed: false,
      embedTitle: "",
      embedDescription: "",
      embedColor: "#5865F2",
      embedImageUrl: "",
      termsAccepted: false,
    };
  });
  
  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      webhookUrl: state.webhookUrl,
      username: state.username,
      avatarUrl: state.avatarUrl,
      useEmbed: state.useEmbed,
      embedTitle: state.embedTitle,
      embedDescription: state.embedDescription,
      embedColor: state.embedColor,
    };
    
    localStorage.setItem("webhook-data", JSON.stringify(dataToSave));
  }, [state.webhookUrl, state.username, state.avatarUrl, state.useEmbed, state.embedTitle, state.embedDescription, state.embedColor]);
  
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
      [field]: field === "useEmbed" || field === "termsAccepted" ? Boolean(value) : value,
    });
  };
  
  // Reset content field
  const resetContent = () => {
    setState({
      ...state,
      content: "",
      contentImageUrl: "",
      embedTitle: "",
      embedDescription: "",
      embedImageUrl: "",
      termsAccepted: false,
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
