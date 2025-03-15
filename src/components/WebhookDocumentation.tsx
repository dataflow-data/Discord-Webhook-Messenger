
import React from "react";
import { Book, Code, FileText, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WebhookDocumentationProps {
  className?: string;
}

const WebhookDocumentation: React.FC<WebhookDocumentationProps> = ({ className }) => {
  return (
    <Card className={cn("p-6 shadow-lg border-border/30 card-gradient", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/15 p-2 rounded-lg">
          <Book className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-white">Discord Webhook Documentation</h2>
      </div>
      
      <div className="space-y-6 text-sm text-white/90">
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Basic Message Structure
          </h3>
          <p className="leading-relaxed">
            Discord webhooks accept JSON payloads with the following structure:
          </p>
          <div className="bg-black/30 p-3 rounded-md font-mono text-xs overflow-x-auto">
            {`{
  "content": "Hello, Discord!",
  "username": "Custom Bot Name",
  "avatar_url": "https://example.com/avatar.png"
}`}
          </div>
          <ul className="space-y-1 list-disc list-inside pl-1">
            <li><strong>content</strong>: The message text (required if no embeds)</li>
            <li><strong>username</strong>: Override the webhook's default name</li>
            <li><strong>avatar_url</strong>: Override the webhook's default avatar</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <Code className="h-4 w-4" />
            Markdown Formatting
          </h3>
          <p className="leading-relaxed">
            Discord supports various markdown formatting in webhook messages:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">*italic*</div>
            <div className="p-2">→ <em>italic</em></div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">**bold**</div>
            <div className="p-2">→ <strong>bold</strong></div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">***bold italic***</div>
            <div className="p-2">→ <strong><em>bold italic</em></strong></div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">__underline__</div>
            <div className="p-2">→ underlined text</div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">~~strikethrough~~</div>
            <div className="p-2">→ <del>strikethrough</del></div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs">\`code\`</div>
            <div className="p-2">→ <code>code</code></div>
            
            <div className="bg-black/30 p-2 rounded-md font-mono text-xs overflow-hidden">\`\`\`
code block
\`\`\`</div>
            <div className="p-2">→ block of code</div>
          </div>
        </section>
        
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Embeds
          </h3>
          <p className="leading-relaxed">
            You can create rich embeds with the following structure:
          </p>
          <div className="bg-black/30 p-3 rounded-md font-mono text-xs overflow-x-auto">
            {`{
  "embeds": [{
    "title": "Embed Title",
    "description": "Embed description text",
    "color": 5814783,
    "fields": [
      {
        "name": "Field 1",
        "value": "Field value",
        "inline": true
      }
    ],
    "footer": {
      "text": "Footer text"
    }
  }]
}`}
          </div>
          <p>
            Discord embeds support many more properties like author, image, thumbnail, and timestamp. 
            See the <a href="https://discord.com/developers/docs/resources/channel#embed-object" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">official Discord documentation</a> for more details.
          </p>
        </section>
        
        <div className="mt-4 pt-4 border-t border-border/30 text-xs text-white/60">
          <p>
            For comprehensive information about Discord webhooks, visit the 
            <a href="https://discord.com/developers/docs/resources/webhook" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
              Discord Developer Documentation
            </a>.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WebhookDocumentation;
