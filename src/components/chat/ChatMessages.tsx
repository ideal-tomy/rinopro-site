"use client";

import { useRef, useEffect, useMemo } from "react";
import { ChatBubble } from "./ChatBubble";
import { ConciergeThinkingIndicator } from "./ConciergeThinkingIndicator";
import type { UIMessage } from "ai";
import { getUIMessageText } from "@/lib/chat/uimessage-text";

interface ChatMessagesProps {
  messages: UIMessage[];
  /** 送信中・ストリーミング中（本文未着の間は思考インジケーターを表示） */
  isLoading?: boolean;
  className?: string;
}

function shouldShowThinking(messages: UIMessage[], isLoading: boolean): boolean {
  if (!isLoading) return false;
  const last = messages[messages.length - 1];
  if (!last) return false;
  if (last.role === "user") return true;
  if (last.role === "assistant" && !getUIMessageText(last).trim()) return true;
  return false;
}

export function ChatMessages({
  messages,
  isLoading = false,
  className,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showThinking = useMemo(
    () => shouldShowThinking(messages, isLoading),
    [messages, isLoading]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showThinking]);

  return (
    <div
      ref={scrollRef}
      className={`flex flex-1 flex-col gap-4 overflow-y-auto p-4 ${className ?? ""}`}
    >
      {messages.map((message) => {
        const text = getUIMessageText(message);
        if (!text) return null;
        return (
          <ChatBubble
            key={message.id}
            role={message.role === "user" ? "user" : "assistant"}
            content={text}
          />
        );
      })}
      {showThinking ? <ConciergeThinkingIndicator /> : null}
    </div>
  );
}
