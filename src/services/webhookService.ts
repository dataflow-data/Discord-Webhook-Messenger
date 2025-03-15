
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
}

// Add security and rate limiting
const CONTENT_MAX_LENGTH = 2000;
const USERNAME_MAX_LENGTH = 80;
const BLOCKED_CONTENT_PATTERNS = [
  /\b(hack|ddos|attack|exploit)\b/i,  // Block potentially malicious intent
  /@everyone/i,  // Block @everyone pings
  /@here/i,      // Block @here pings
  /discord\.gift/i, // Block fake gift links
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
  
  // Check for impersonation attempts or offensive usernames
  const blockedUsernames = ["discord", "admin", "moderator", "system"];
  if (blockedUsernames.some(blocked => username.toLowerCase().includes(blocked))) {
    return { 
      valid: false, 
      reason: "Username contains prohibited terms." 
    };
  }
  
  return { valid: true };
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
      return {
        success: false,
        message: "Invalid webhook URL format. Please check the URL and try again.",
      };
    }
    
    // Validate content
    const contentValidation = validateContent(messageData.content);
    if (!contentValidation.valid) {
      return {
        success: false,
        message: contentValidation.reason || "Invalid message content.",
      };
    }
    
    // Validate username if provided
    if (messageData.username) {
      const usernameValidation = validateUsername(messageData.username);
      if (!usernameValidation.valid) {
        return {
          success: false,
          message: usernameValidation.reason || "Invalid username.",
        };
      }
    }
    
    // Validate avatar URL if provided
    if (messageData.avatar_url && !messageData.avatar_url.startsWith("https://")) {
      return {
        success: false,
        message: "Avatar URL must use HTTPS.",
      };
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
      return {
        success: false,
        message: `Rate limited by Discord. Please try again in ${retryAfter ? retryAfter : "a few"} seconds.`,
      };
    }
    
    // Check for other errors
    if (!response.ok) {
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
    return {
      success: false,
      message: "Failed to send message. Please check your connection and try again.",
    };
  }
};
