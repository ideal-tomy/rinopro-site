"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceToggle({
  enabled,
  onToggle,
  disabled = false,
  className,
}: VoiceToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={disabled}
      aria-label={enabled ? "音声入力をオフ" : "音声入力をオン"}
      className={cn(enabled && "text-accent", className)}
    >
      {enabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
    </Button>
  );
}
