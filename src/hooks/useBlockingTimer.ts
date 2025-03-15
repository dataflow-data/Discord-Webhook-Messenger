
import { useState, useEffect } from "react";

/**
 * Hook for handling countdown timer functionality for security blocks
 * 
 * @param isBlocked Whether the user is currently blocked
 * @param getFormattedTime Function that returns the formatted time string
 * @returns Current formatted time string
 */
export const useBlockingTimer = (isBlocked: boolean, getFormattedTime: () => string) => {
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  
  // Update the timer display every second when blocked
  useEffect(() => {
    if (isBlocked) {
      // Set initial time
      setCurrentTime(getFormattedTime());
      
      // Setup interval to update time every second
      const interval = setInterval(() => {
        setCurrentTime(getFormattedTime());
      }, 1000);
      
      // Clean up interval on unmount or when no longer blocked
      return () => clearInterval(interval);
    }
  }, [isBlocked, getFormattedTime]);
  
  return currentTime;
};
