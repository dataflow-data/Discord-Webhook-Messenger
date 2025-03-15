
/**
 * Discord Webhook Service
 * Handles sending messages to Discord webhooks
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
 * Sends a message to a Discord webhook
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
    if (!messageData.content || messageData.content.trim() === "") {
      return {
        success: false,
        message: "Message content cannot be empty.",
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
        message: `Rate limited. Please try again in ${retryAfter ? retryAfter : "a few"} seconds.`,
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
