
import React from "react";
import { Shield } from "lucide-react";

const SecurityInfo: React.FC = () => {
  return (
    <div className="mt-6 p-4 rounded-lg bg-card/40 border border-border/30 text-sm">
      <h3 className="text-primary font-medium mb-2 flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Enhanced Security Measures
      </h3>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-start gap-2">
          <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
          <span>Progressive rate limiting: Block duration increases with repeated violations</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
          <span>Enhanced content filtering: Blocks malicious content, spam patterns, and prohibited words</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
          <span>URL validation: Only allows secure image URLs with common formats (.jpg, .png, .gif, .webp)</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
          <span>Username restrictions: Prevents impersonation of Discord staff or system accounts</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="min-w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">•</div>
          <span>Security event logging: All suspicious activity is logged for review</span>
        </li>
      </ul>
    </div>
  );
};

export default SecurityInfo;
