"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  /** 親から入力欄へ追記するドラフト（id が変わるたびに追記） */
  draftInjection?: { id: number; text: string } | null;
  onDraftConsumed?: () => void;
  inputId?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "メッセージを入力...",
  voiceEnabled = false,
  onVoiceToggle,
  className,
  draftInjection,
  onDraftConsumed,
  inputId,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draftInjection == null || draftInjection.text === "") return;
    setInput((prev) => {
      const t = prev.trim();
      return t ? `${t}\n\n${draftInjection.text}` : draftInjection.text;
    });
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      const len = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(len, len);
    });
    onDraftConsumed?.();
  }, [draftInjection, onDraftConsumed]);

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
        ref={inputRef}
        id={inputId}
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
