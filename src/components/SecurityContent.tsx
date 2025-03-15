
import React from "react";
import { ShieldAlert, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityContentProps {
  className?: string;
}

const SecurityContent: React.FC<SecurityContentProps> = ({ className }) => {
  return (
    <Card className={cn("p-6 shadow-lg border-border/30 card-gradient h-fit", className)}>
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-primary/15 p-2 rounded-lg">
          <ShieldAlert className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-white">Enhanced Security Measures</h2>
      </div>
      
      <Alert className="bg-primary/5 border-primary/30 mb-6">
        <ShieldAlert className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          This service implements advanced rate limiting and security measures to prevent abuse. 
          Misuse may result in temporary blocks with increasing duration.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-7 text-sm text-white/90 overflow-y-auto max-h-[calc(100vh-240px)] pr-1 scrollbar-none">
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Enforcement
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Progressive rate limiting: Block duration increases with repeated violations</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Content filtering to prevent spam, phishing, and malicious content</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Suspicious pattern detection for username and avatar impersonation</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>URL validation and sanitization with strict image format requirements</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Security event logging and analysis to detect abuse patterns</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Anti-spam measures: Detection of character repetition, excessive emoji, ASCII art</span>
            </li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="font-medium text-primary flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Current Rate Limits
          </h3>
          <p className="leading-relaxed">
            To maintain service quality and prevent abuse, the following limits are enforced:
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Maximum 30 messages per 5-minute window</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Temporary blocks start at 30 seconds and increase with repeated violations</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Maximum content length: 2000 characters</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Maximum embed title length: 256 characters</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/20 p-1 rounded-full text-primary text-xs mt-0.5">•</span>
              <span>Maximum embed description length: 4096 characters</span>
            </li>
          </ul>
        </section>
      </div>
    </Card>
  );
};

export default SecurityContent;
