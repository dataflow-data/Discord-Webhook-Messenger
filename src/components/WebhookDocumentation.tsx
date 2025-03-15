
import React from "react";
import { Book, Code, FileText, MessageSquare, Sparkles, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WebhookDocumentationProps {
  className?: string;
}

const WebhookDocumentation: React.FC<WebhookDocumentationProps> = ({ className }) => {
  return (
    <Card className={cn("p-6 shadow-lg border-border/30 card-gradient h-fit", className)}>
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-primary/15 p-2 rounded-lg">
          <Book className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-white">Discord Webhook Documentation</h2>
      </div>
      
      <div className="space-y-7 text-sm text-white/90 overflow-y-auto max-h-[calc(100vh-240px)] pr-1 scrollbar-none">
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
            Basic Embeds
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
        </section>
        
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Rich Embed Components
          </h3>
          <p className="leading-relaxed">
            Discord embeds support many more advanced properties:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3 rounded-md border border-border/30 bg-black/20">
              <h4 className="font-medium mb-2 text-primary/90">Author</h4>
              <div className="bg-black/30 p-2 rounded-md font-mono text-xs overflow-x-auto">
                {`"author": {
  "name": "Author Name",
  "url": "https://example.com",
  "icon_url": "https://example.com/icon.png"
}`}
              </div>
            </div>
            
            <div className="p-3 rounded-md border border-border/30 bg-black/20">
              <h4 className="font-medium mb-2 text-primary/90">Thumbnail</h4>
              <div className="bg-black/30 p-2 rounded-md font-mono text-xs overflow-x-auto">
                {`"thumbnail": {
  "url": "https://example.com/thumbnail.png"
}`}
              </div>
            </div>
            
            <div className="p-3 rounded-md border border-border/30 bg-black/20">
              <h4 className="font-medium mb-2 text-primary/90">Image</h4>
              <div className="bg-black/30 p-2 rounded-md font-mono text-xs overflow-x-auto">
                {`"image": {
  "url": "https://example.com/image.png"
}`}
              </div>
            </div>
            
            <div className="p-3 rounded-md border border-border/30 bg-black/20">
              <h4 className="font-medium mb-2 text-primary/90">Timestamp</h4>
              <div className="bg-black/30 p-2 rounded-md font-mono text-xs overflow-x-auto">
                {`"timestamp": "2023-08-15T12:00:00.000Z"`}
              </div>
              <p className="text-xs mt-1 text-white/70">ISO8601 format for automatic localization</p>
            </div>
          </div>
        </section>
        
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Embed Colors
          </h3>
          <p className="leading-relaxed">
            Colors in Discord embeds are specified as decimal color values:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <div className="font-mono text-xs">15548997 (Red)</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="font-mono text-xs">3447003 (Blue)</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <div className="font-mono text-xs">5763719 (Green)</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <div className="font-mono text-xs">16776960 (Yellow)</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <div className="font-mono text-xs">10181046 (Purple)</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-pink-500"></div>
              <div className="font-mono text-xs">15277667 (Pink)</div>
            </div>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Use our utility function {`hexToDecimal("#HEX")`} to convert hex colors to decimal format.
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
