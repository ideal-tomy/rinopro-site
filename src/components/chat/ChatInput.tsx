"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceToggle } from "./VoiceToggle";
import { cn } from "@/lib/utils";
import { normalizeVoiceSearchQuery } from "@/lib/chat/voice-normalize-query";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
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
  className,
  draftInjection,
  onDraftConsumed,
  inputId,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const pendingSendTimerRef = useRef<number | null>(null);
  const listeningRef = useRef(false);
  const onSendRef = useRef(onSend);

  useEffect(() => {
    onSendRef.current = onSend;
  }, [onSend]);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  useEffect(() => {
    return () => {
      if (pendingSendTimerRef.current) {
        clearTimeout(pendingSendTimerRef.current);
        pendingSendTimerRef.current = null;
      }
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

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

  const setupRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      listeningRef.current = true;
      setIsListening(true);
      console.info("[concierge] 聞き取り中...");
    };

    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      listeningRef.current = false;
      setIsListening(false);
      console.warn("[concierge] Speech recognition error:", e.error);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let display = "";
      for (let i = 0; i < event.results.length; i++) {
        display += event.results[i][0].transcript;
      }
      const trimmed = display.trim();
      setInput(trimmed);

      let gotFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          gotFinal = true;
          break;
        }
      }
      if (!gotFinal) return;

      let fullRaw = "";
      for (let i = 0; i < event.results.length; i++) {
        fullRaw += event.results[i][0].transcript;
      }
      const raw = fullRaw.trim();
      if (!raw) return;

      if (pendingSendTimerRef.current) {
        clearTimeout(pendingSendTimerRef.current);
        pendingSendTimerRef.current = null;
      }

      pendingSendTimerRef.current = window.setTimeout(() => {
        pendingSendTimerRef.current = null;
        const normalized = normalizeVoiceSearchQuery(raw) || raw;
        setVoiceHint(`検索語に整形: 「${normalized}」`);
        onSendRef.current(normalized);
        setInput("");
        window.setTimeout(() => setVoiceHint(null), 2800);
      }, 400);
    };

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const handleVoiceClick = useCallback(() => {
    setVoiceHint(null);
    if (pendingSendTimerRef.current) {
      clearTimeout(pendingSendTimerRef.current);
      pendingSendTimerRef.current = null;
    }

    const r = setupRecognition();
    if (!r) return;

    if (listeningRef.current) {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      r.start();
    } catch {
      try {
        r.abort();
        r.start();
      } catch {
        /* ignore */
      }
    }
  }, [setupRecognition]);

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
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-2 p-4", className)}
    >
      <div className="flex gap-2">
        <VoiceToggle
          supported={speechSupported}
          isListening={isListening}
          onClick={handleVoiceClick}
          disabled={disabled}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input
            ref={inputRef}
            id={inputId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
          />
          {voiceHint ? (
            <p className="text-xs text-accent/90" aria-live="polite">
              {voiceHint}
            </p>
          ) : null}
        </div>
        <Button type="submit" disabled={disabled || !input.trim()}>
          送信
        </Button>
      </div>
    </form>
  );
}
