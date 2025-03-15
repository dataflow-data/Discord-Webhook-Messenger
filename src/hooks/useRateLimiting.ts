
import { useState, useEffect } from "react";
import { 
  MAX_MESSAGES_PERIOD, 
  RATE_LIMIT_WINDOW_MS, 
  isWithinRateLimitWindow 
} from "@/utils/securityUtils";

export const useRateLimiting = (
  isBlocked: boolean, 
  applyBlock: (reason: string) => void
) => {
  // Track usage for rate limiting
  const [usageHistory, setUsageHistory] = useState<number[]>(() => {
    const savedHistory = localStorage.getItem("webhook-usage-history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  // Save usage history to localStorage
  useEffect(() => {
    localStorage.setItem("webhook-usage-history", JSON.stringify(usageHistory));
  }, [usageHistory]);
  
  // Clean up old usage history entries
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setUsageHistory(prev => prev.filter(timestamp => isWithinRateLimitWindow(timestamp)));
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Calculate current usage count in the rate limit window
  const usageCount = usageHistory.filter(timestamp => isWithinRateLimitWindow(timestamp)).length;
  
  // Perform rate limiting check
  const checkRateLimit = (): boolean => {
    if (isBlocked) {
      return false;
    }
    
    // If we're over the threshold, block temporarily
    if (usageCount >= MAX_MESSAGES_PERIOD) {
      applyBlock("Rate limit exceeded.");
      return false;
    }
    
    return true;
  };
  
  // Record successful message send
  const recordUsage = () => {
    setUsageHistory(prev => [...prev, Date.now()]);
  };
  
  // Reset usage history (for testing)
  const resetUsageHistory = () => {
    setUsageHistory([]);
    localStorage.removeItem("webhook-usage-history");
  };
  
  return {
    usageCount,
    checkRateLimit,
    recordUsage,
    resetUsageHistory
  };
};
