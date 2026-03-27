"use client";

import { useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import type { UIMessage } from "ai";
import { getUIMessageText } from "@/lib/chat/uimessage-text";

interface ChatMessagesProps {
  messages: UIMessage[];
  className?: string;
}

export function ChatMessages({ messages, className }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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
    </div>
  );
}
