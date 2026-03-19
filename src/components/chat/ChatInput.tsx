"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceToggle } from "./VoiceToggle";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  voiceEnabled?: boolean;
  onVoiceToggle?: () => void;
  className?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "メッセージを入力...",
  voiceEnabled = false,
  onVoiceToggle,
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !disabled) {
        onSend(trimmed);
        setInput("");
      }
    },
    [input, disabled, onSend]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2 p-4", className)}>
      {onVoiceToggle && (
        <VoiceToggle
          enabled={voiceEnabled}
          onToggle={onVoiceToggle}
          disabled={disabled}
        />
      )}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !input.trim()}>
        送信
      </Button>
    </form>
  );
}
