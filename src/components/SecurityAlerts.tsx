
import React, { useState } from "react";
import { Shield, Clock, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useBlockingTimer } from "@/hooks/useBlockingTimer";
import { MAX_MESSAGES_PERIOD, RATE_LIMIT_WINDOW_MS } from "@/utils/securityUtils";

interface SecurityAlertsProps {
  showSecurityAlert: boolean;
  isBlockedTemporarily: boolean;
  usageCount: number;
  securityViolations: number;
  formattedBlockTime: () => string;
  hideSecurityAlert: () => void;
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({
  showSecurityAlert,
  isBlockedTemporarily,
  usageCount,
  securityViolations,
  formattedBlockTime,
  hideSecurityAlert
}) => {
  // Use the blocking timer hook to manage time display
  const currentTime = useBlockingTimer(isBlockedTemporarily, formattedBlockTime);
  const [hideUsageLimitAlert, setHideUsageLimitAlert] = useState(false);
  
  const usageLimitThreshold = Math.floor(MAX_MESSAGES_PERIOD * 0.75); // 75% of limit
  const usageLimitMinutes = Math.floor(RATE_LIMIT_WINDOW_MS / 60000);
  
  return (
    <>
      {showSecurityAlert && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500 relative">
          <Shield className="h-4 w-4" />
          <AlertTitle>Responsible Use Notice</AlertTitle>
          <AlertDescription className="text-sm pr-8">
            This tool sends messages to Discord webhooks. Please use responsibly and respect Discord's Terms of Service.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-background/30 border-amber-500/20 hover:bg-background/50 text-amber-500"
              onClick={hideSecurityAlert}
            >
              I understand
            </Button>
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-amber-500/10" 
            onClick={hideSecurityAlert}
          >
            <X className="h-3.5 w-3.5 text-amber-500/80" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      )}
      
      {isBlockedTemporarily && (
        <Alert className="mb-4 bg-destructive/10 border-destructive/30 text-destructive relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Block Active</AlertTitle>
          <AlertDescription>
            <p>Your access is temporarily blocked due to rate limiting or security violations.</p>
            <div className="flex items-center gap-2 mt-1.5 bg-destructive/5 p-2 rounded-md">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{currentTime}</span>
              <span className="text-xs">remaining</span>
            </div>
            {securityViolations > 1 && (
              <p className="mt-2 text-xs flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Multiple violations detected. Block duration increases with each violation.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {usageCount > usageLimitThreshold && !isBlockedTemporarily && !hideUsageLimitAlert && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500 relative">
          <Info className="h-4 w-4" />
          <AlertTitle>Usage Limit Approaching</AlertTitle>
          <AlertDescription className="pr-8">
            You've sent {usageCount} messages. Rate limits may apply after {MAX_MESSAGES_PERIOD} messages in a {usageLimitMinutes}-minute period.
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-amber-500/10" 
            onClick={() => setHideUsageLimitAlert(true)}
          >
            <X className="h-3.5 w-3.5 text-amber-500/80" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      )}
    </>
  );
};

export default SecurityAlerts;
