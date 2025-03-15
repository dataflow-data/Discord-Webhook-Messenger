// Utility functions for security features

// Security constants
export const MAX_MESSAGES_PERIOD = 10;
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
export const TEMP_BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
export const PROGRESSIVE_BLOCK_MULTIPLIER = 2; // Doubles block time for repeated violations

// Content limits
export const CONTENT_MAX_LENGTH = 2000;
export const EMBED_TITLE_MAX_LENGTH = 256;
export const EMBED_DESCRIPTION_MAX_LENGTH = 4096;
export const USERNAME_MAX_LENGTH = 80;
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB - Discord's limit

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

// Validate hexadecimal color codes
export const isValidHexColor = (color: string): boolean => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

// Convert hex color to decimal for Discord embeds
export const hexToDecimal = (hex: string): number | undefined => {
  if (!hex || !hex.startsWith('#')) return undefined;
  return parseInt(hex.slice(1), 16);
};

// Validate image URLs and data URLs
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a data URL
  if (url.startsWith('data:image/')) {
    return /^data:image\/(jpeg|png|gif|webp);base64,/.test(url);
  }
  
  // Otherwise check if it's a valid https URL with allowed extension
  if (!url.startsWith('https://')) return false;
  
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// Estimate size of a base64 data URL
export const estimateBase64Size = (dataUrl: string): number => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return 0;
  
  // Extract the base64 part
  const base64 = dataUrl.split(',')[1];
  if (!base64) return 0;
  
  // Base64 represents 6 bits per character, so 4 characters represent 3 bytes
  return Math.ceil((base64.length * 3) / 4);
};
