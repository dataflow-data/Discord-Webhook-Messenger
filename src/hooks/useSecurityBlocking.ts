
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  calculateBlockDuration, 
  formatBlockTime as formatTime 
} from "@/utils/securityUtils";

export const useSecurityBlocking = () => {
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
  
  // Function to check block status - made with useCallback to ensure reference stability
  const checkBlockStatus = useCallback(() => {
    const blockUntil = localStorage.getItem("webhook-blocked-until");
    if (blockUntil) {
      const blockTime = parseInt(blockUntil, 10);
      const remaining = Math.max(0, blockTime - Date.now());
      
      setBlockRemainingTime(remaining);
      
      if (blockTime > Date.now()) {
        setIsBlockedTemporarily(true);
      } else {
        // No longer blocked
        setIsBlockedTemporarily(false);
        localStorage.removeItem("webhook-blocked-until");
        setBlockRemainingTime(0);
      }
    } else {
      // Ensure state is consistent when no block exists
      setIsBlockedTemporarily(false);
      setBlockRemainingTime(0);
    }
  }, []);
  
  // Check if user is still blocked on mount and update remaining time
  useEffect(() => {
    // Check immediately on mount
    checkBlockStatus();
    
    // Then check every second
    const interval = setInterval(checkBlockStatus, 1000);
    
    return () => clearInterval(interval);
  }, [checkBlockStatus]);
  
  // Save security violations to localStorage
  useEffect(() => {
    localStorage.setItem("webhook-security-violations", securityViolations.toString());
  }, [securityViolations]);
  
  // Format remaining block time as mm:ss
  const formattedBlockTime = useCallback(() => formatTime(blockRemainingTime), [blockRemainingTime]);
  
  // Block user temporarily with progressive duration
  const applyTemporaryBlock = useCallback((reason: string) => {
    // Increment violation count
    const newViolationCount = securityViolations + 1;
    setSecurityViolations(newViolationCount);
    
    // Calculate block duration with progressive increase
    const blockDuration = calculateBlockDuration(newViolationCount);
    const blockUntil = Date.now() + blockDuration;
    
    localStorage.setItem("webhook-blocked-until", blockUntil.toString());
    setIsBlockedTemporarily(true);
    setBlockRemainingTime(blockDuration);
    
    // Format minutes for display
    const blockMinutes = Math.ceil(blockDuration / 60000);
    
    toast.error(`${reason} You're temporarily blocked for ${blockMinutes} minutes.`);
  }, [securityViolations]);
  
  // Reset security violations (for testing)
  const resetSecurityViolations = useCallback(() => {
    setSecurityViolations(0);
    localStorage.removeItem("webhook-security-violations");
  }, []);
  
  // Clear security block (for testing)
  const clearSecurityBlock = useCallback(() => {
    setIsBlockedTemporarily(false);
    localStorage.removeItem("webhook-blocked-until");
    setBlockRemainingTime(0);
  }, []);
  
  return {
    securityViolations,
    isBlockedTemporarily,
    blockRemainingTime,
    formattedBlockTime,
    applyTemporaryBlock,
    resetSecurityViolations,
    clearSecurityBlock
  };
};
