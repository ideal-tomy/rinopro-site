"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceToggleProps {
  /** マイクがブラウザで利用可能か */
  supported: boolean;
  /** 音声認識をリスニング中 */
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceToggle({
  supported,
  isListening,
  onClick,
  disabled = false,
  className,
}: VoiceToggleProps) {
  const busy = disabled || !supported;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={busy}
      aria-label={
        !supported
          ? "このブラウザでは音声入力を利用できません"
          : isListening
            ? "聞き取り中。タップで停止"
            : "音声入力を開始"
      }
      aria-pressed={isListening}
      className={cn(
        supported && isListening && "text-action ring-2 ring-action/45 ring-offset-2 ring-offset-base animate-pulse",
        !supported && "opacity-50",
        className
      )}
    >
      {supported ? (
        <Mic className="h-5 w-5" />
      ) : (
        <MicOff className="h-5 w-5" />
      )}
    </Button>
  );
}
