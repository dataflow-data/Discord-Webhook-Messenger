
// Utility functions for security features

// Security constants
export const MAX_MESSAGES_PERIOD = 10;
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
export const TEMP_BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
export const PROGRESSIVE_BLOCK_MULTIPLIER = 2; // Doubles block time for repeated violations

// Format remaining block time as mm:ss
export const formatBlockTime = (milliseconds: number): string => {
  if (!milliseconds) return "0:00";
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Check if a timestamp is within the rate limit window
export const isWithinRateLimitWindow = (timestamp: number): boolean => {
  return Date.now() - timestamp < RATE_LIMIT_WINDOW_MS;
};

// Calculate progressive block duration based on violation count
export const calculateBlockDuration = (violationCount: number): number => {
  return TEMP_BLOCK_DURATION_MS * Math.pow(PROGRESSIVE_BLOCK_MULTIPLIER, Math.min(violationCount - 1, 3));
};
