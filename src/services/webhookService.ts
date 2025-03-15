/**
 * Discord Webhook Service
 * Handles sending messages to Discord webhooks with security measures
 */

// Interface for message data
export interface WebhookMessageData {
  username?: string;
  avatar_url?: string;
  content: string;
}

// Interface for webhook response
export interface WebhookResponse {
  success: boolean;
  message: string;
  securityAction?: string;
}

// Add security and rate limiting
const CONTENT_MAX_LENGTH = 2000;
const USERNAME_MAX_LENGTH = 80;
const BLOCKED_CONTENT_PATTERNS = [
  /\b(hack|ddos|attack|exploit|bomb|terrorist|threat)\b/i,  // Block potentially malicious intent
  /@everyone/i,  // Block @everyone pings
  /@here/i,      // Block @here pings
  /discord\.gift/i, // Block fake gift links
  /nitro/i,      // Block potential scam words
  /\b(http|https):\/\/(?!discord\.com|cdn\.discordapp\.com)/i, // Block non-Discord URLs
  /<@&?\d+>/i,   // Block role and user mentions
  /(\u202E|\u200F|\u061C)/i, // Block right-to-left override characters used in attacks
];

// Block patterns for usernames
const BLOCKED_USERNAME_PATTERNS = [
  /\b(discord|admin|mod|moderator|system|official|staff|support)/i,
  /\b(webhook|bot|server|nitro)/i
];

// Block suspicious avatar URLs
const BLOCKED_AVATAR_PATTERNS = [
  /\.(php|exe|bat|cmd|sh|pl|cgi|js)\b/i,
  /\b(drive\.google|anonfiles|mega\.nz|mediafire)/i
];

/**
 * Validates a Discord webhook URL
 * @param url The webhook URL to validate
 * @returns boolean indicating if URL is valid
 */
export const isValidWebhookUrl = (url: string): boolean => {
  // Discord webhook URL pattern
  const pattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return pattern.test(url);
};

/**
 * Detect suspicious content traits
 * @param content Message to analyze
 * @returns Object with flags for suspicious content
 */
const detectSuspiciousContent = (content: string): { suspicious: boolean; reason?: string } => {
  // Check for repeated characters (potential spam)
  if (/(.)\1{10,}/i.test(content)) {
    return { suspicious: true, reason: "Repeated character spam detected" };
  }
  
  // Check for excessive capitalization
  const capitalRatio = content.split('').filter(c => c.match(/[A-Z]/)).length / content.length;
  if (capitalRatio > 0.7 && content.length > 10) {
    return { suspicious: true, reason: "Excessive capitalization detected" };
  }
  
  // Check for excessive emoji
  const emojiCount = (content.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g) || []).length;
  if (emojiCount > content.length / 5 && content.length > 20) {
    return { suspicious: true, reason: "Excessive emoji usage detected" };
  }
  
  // Check for ASCII art (potential spam)
  if (content.includes('░') || content.includes('█') || content.includes('▓') || content.includes('▒')) {
    return { suspicious: true, reason: "ASCII art detected" };
  }
  
  return { suspicious: false };
};

/**
 * Checks content for potentially abusive patterns
 * @param content Message content to check
 * @returns Object with validation result and reason if invalid
 */
export const validateContent = (content: string): { valid: boolean; reason?: string } => {
  if (!content || content.trim() === "") {
    return { valid: false, reason: "Message content cannot be empty." };
  }
  
  if (content.length > CONTENT_MAX_LENGTH) {
    return { 
      valid: false, 
      reason: `Message exceeds maximum length of ${CONTENT_MAX_LENGTH} characters.` 
    };
  }
  
  // Check for blocked content patterns
  for (const pattern of BLOCKED_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      return { 
        valid: false, 
        reason: "Your message contains prohibited content or patterns." 
      };
    }
  }
  
  // Check for suspicious content
  const suspiciousCheck = detectSuspiciousContent(content);
  if (suspiciousCheck.suspicious) {
    return {
      valid: false,
      reason: suspiciousCheck.reason || "Message looks suspicious."
    };
  }
  
  return { valid: true };
};

/**
 * Validates username to prevent abuse
 * @param username Username to validate
 * @returns Object with validation result and reason if invalid
 */
export const validateUsername = (username?: string): { valid: boolean; reason?: string } => {
  if (!username) {
    return { valid: true };
  }
  
  if (username.length > USERNAME_MAX_LENGTH) {
    return { 
      valid: false, 
      reason: `Username exceeds maximum length of ${USERNAME_MAX_LENGTH} characters.` 
    };
  }
  
  // Check for blocked username patterns
  for (const pattern of BLOCKED_USERNAME_PATTERNS) {
    if (pattern.test(username)) {
      return { 
        valid: false, 
        reason: "Username contains prohibited terms." 
      };
    }
  }
  
  return { valid: true };
};

/**
 * Validates avatar URL
 * @param avatarUrl URL to validate
 * @returns Object with validation result and reason if invalid
 */
export const validateAvatarUrl = (avatarUrl?: string): { valid: boolean; reason?: string } => {
  if (!avatarUrl) {
    return { valid: true };
  }
  
  if (!avatarUrl.startsWith("https://")) {
    return {
      valid: false,
      reason: "Avatar URL must use HTTPS."
    };
  }
  
  // Check for blocked avatar patterns
  for (const pattern of BLOCKED_AVATAR_PATTERNS) {
    if (pattern.test(avatarUrl)) {
      return { 
        valid: false, 
        reason: "Avatar URL contains prohibited patterns." 
      };
    }
  }
  
  // Only allow common image extensions
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(avatarUrl)) {
    return {
      valid: false,
      reason: "Avatar URL must point to a common image format (jpg, png, gif, webp)."
    };
  }
  
  return { valid: true };
};

/**
 * Logs security events for monitoring
 * @param event Security event to log
 */
const logSecurityEvent = (event: { 
  type: 'validation_failure' | 'rate_limit' | 'blocked' | 'suspicious'; 
  reason: string; 
  metadata?: Record<string, any>;
}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ...event
  };
  
  console.warn("SECURITY EVENT:", logData);
  
  // In a production environment, you would send this to a logging service
  // or store in localStorage for admin review
  try {
    const securityLogs = JSON.parse(localStorage.getItem('webhook-security-logs') || '[]');
    securityLogs.push(logData);
    // Keep only the last 100 logs
    if (securityLogs.length > 100) {
      securityLogs.shift();
    }
    localStorage.setItem('webhook-security-logs', JSON.stringify(securityLogs));
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};

/**
 * Sends a message to a Discord webhook with security checks
 * @param webhookUrl The Discord webhook URL
 * @param messageData The message data to send
 * @returns Promise resolving to the webhook response
 */
export const sendWebhookMessage = async (
  webhookUrl: string,
  messageData: WebhookMessageData
): Promise<WebhookResponse> => {
  try {
    // Validate webhook URL
    if (!isValidWebhookUrl(webhookUrl)) {
      logSecurityEvent({
        type: 'validation_failure',
        reason: 'Invalid webhook URL format',
        metadata: { url: webhookUrl.slice(0, 30) + '...' }
      });
      
      return {
        success: false,
        message: "Invalid webhook URL format. Please check the URL and try again.",
      };
    }
    
    // Validate content
    const contentValidation = validateContent(messageData.content);
    if (!contentValidation.valid) {
      logSecurityEvent({
        type: 'validation_failure',
        reason: contentValidation.reason || 'Invalid content',
        metadata: { contentLength: messageData.content.length }
      });
      
      return {
        success: false,
        message: contentValidation.reason || "Invalid message content.",
        securityAction: "content_blocked"
      };
    }
    
    // Validate username if provided
    if (messageData.username) {
      const usernameValidation = validateUsername(messageData.username);
      if (!usernameValidation.valid) {
        logSecurityEvent({
          type: 'validation_failure',
          reason: usernameValidation.reason || 'Invalid username',
          metadata: { username: messageData.username }
        });
        
        return {
          success: false,
          message: usernameValidation.reason || "Invalid username.",
          securityAction: "username_blocked"
        };
      }
    }
    
    // Validate avatar URL if provided
    if (messageData.avatar_url) {
      const avatarValidation = validateAvatarUrl(messageData.avatar_url);
      if (!avatarValidation.valid) {
        logSecurityEvent({
          type: 'validation_failure',
          reason: avatarValidation.reason || 'Invalid avatar URL',
          metadata: { avatarUrl: messageData.avatar_url }
        });
        
        return {
          success: false,
          message: avatarValidation.reason || "Invalid avatar URL.",
          securityAction: "avatar_blocked"
        };
      }
    }
    
    // Send the request to the webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
    
    // Check for rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      
      logSecurityEvent({
        type: 'rate_limit',
        reason: 'Discord rate limited the request',
        metadata: { retryAfter }
      });
      
      return {
        success: false,
        message: `Rate limited by Discord. Please try again in ${retryAfter ? retryAfter : "a few"} seconds.`,
        securityAction: "rate_limited"
      };
    }
    
    // Check for other errors
    if (!response.ok) {
      logSecurityEvent({
        type: 'validation_failure',
        reason: `Error: ${response.status} - ${response.statusText}`,
        metadata: { status: response.status }
      });
      
      return {
        success: false,
        message: `Error: ${response.status} - ${response.statusText}`,
      };
    }
    
    return {
      success: true,
      message: "Message sent successfully!",
    };
  } catch (error) {
    console.error("Error sending webhook message:", error);
    
    logSecurityEvent({
      type: 'validation_failure',
      reason: 'Request failed',
      metadata: { error: String(error) }
    });
    
    return {
      success: false,
      message: "Failed to send message. Please check your connection and try again.",
    };
  }
};

/**
 * Gets recent security logs
 * @returns Array of security log entries
 */
export const getSecurityLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('webhook-security-logs') || '[]');
  } catch (error) {
    console.error("Failed to retrieve security logs:", error);
    return [];
  }
};
