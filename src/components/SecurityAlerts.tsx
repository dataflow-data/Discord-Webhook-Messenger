
import React from "react";
import { Shield, Clock, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      {showSecurityAlert && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500">
          <Shield className="h-4 w-4" />
          <AlertTitle>Responsible Use Notice</AlertTitle>
          <AlertDescription className="text-sm">
            This tool sends messages to Discord webhooks. Please use responsibly and respect Discord's Terms of Service.
            Abuse may result in IP blocking or other security measures.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-background/30 border-amber-500/20 hover:bg-background/50 text-amber-500"
              onClick={hideSecurityAlert}
            >
              I understand
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isBlockedTemporarily && (
        <Alert className="mb-4 bg-destructive/10 border-destructive/30 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Block Active</AlertTitle>
          <AlertDescription>
            <p>Your access is temporarily blocked due to rate limiting or security violations.</p>
            <div className="flex items-center gap-2 mt-1.5 bg-destructive/5 p-2 rounded-md">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formattedBlockTime()}</span>
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
      
      {usageCount > 8 && !isBlockedTemporarily && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-500">
          <Info className="h-4 w-4" />
          <AlertTitle>Usage Limit Approaching</AlertTitle>
          <AlertDescription>
            You've sent {usageCount} messages. Rate limits may apply after 10 messages in a 5-minute period.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SecurityAlerts;
