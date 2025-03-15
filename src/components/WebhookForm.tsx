
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Webhook } from "lucide-react";
import { useWebhook } from "@/hooks/useWebhook";
import SecurityAlerts from "./SecurityAlerts";
import WebhookFormFields from "./WebhookFormFields";
import SecurityInfo from "./SecurityInfo";

const WebhookForm: React.FC = () => {
  const { 
    state, 
    handleUrlChange, 
    updateField, 
    sendMessage, 
    usageCount, 
    isBlockedTemporarily,
    formattedBlockTime,
    securityViolations
  } = useWebhook();
  
  const [showOptional, setShowOptional] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  
  // Show security alert to first-time users
  useEffect(() => {
    const hasSeenAlert = localStorage.getItem("security-alert-shown");
    if (!hasSeenAlert) {
      setShowSecurityAlert(true);
      localStorage.setItem("security-alert-shown", "true");
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const toggleOptional = () => setShowOptional(!showOptional);
  const hideSecurityAlert = () => setShowSecurityAlert(false);

  return (
    <div className="webhook-container animate-in">
      <SecurityAlerts 
        showSecurityAlert={showSecurityAlert}
        isBlockedTemporarily={isBlockedTemporarily}
        usageCount={usageCount}
        securityViolations={securityViolations}
        formattedBlockTime={formattedBlockTime}
        hideSecurityAlert={hideSecurityAlert}
      />
      
      <Card className="app-card shadow-lg overflow-hidden animate-in card-gradient border-border/30 max-w-3xl mx-auto">
        <div className="flex flex-col">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary/20 to-card/80 border-b border-border/30 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 p-2 rounded-lg">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-white">Send Webhook Message</h2>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <WebhookFormFields 
              state={state}
              showOptional={showOptional}
              isBlockedTemporarily={isBlockedTemporarily}
              handleUrlChange={handleUrlChange}
              updateField={updateField}
              toggleOptional={toggleOptional}
              handleKeyDown={handleKeyDown}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </Card>
      
      <SecurityInfo />
    </div>
  );
};

export default WebhookForm;
