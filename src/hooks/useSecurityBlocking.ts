
import { useState, useEffect } from "react";
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
  
  // Format remaining block time as mm:ss
  const formattedBlockTime = () => formatTime(blockRemainingTime);
  
  // Block user temporarily with progressive duration
  const applyTemporaryBlock = (reason: string) => {
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
    
    // Set timeout to automatically unblock
    setTimeout(() => {
      setIsBlockedTemporarily(false);
      localStorage.removeItem("webhook-blocked-until");
      setBlockRemainingTime(0);
    }, blockDuration);
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
    securityViolations,
    isBlockedTemporarily,
    blockRemainingTime,
    formattedBlockTime,
    applyTemporaryBlock,
    resetSecurityViolations,
    clearSecurityBlock
  };
};
