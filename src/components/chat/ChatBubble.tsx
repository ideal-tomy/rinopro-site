"use client";

import { AssistantMarkdown } from "@/components/chat/assistant-markdown";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  className?: string;
}

export function ChatBubble({ role, content, className }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-2",
          role === "user"
            ? "bg-accent/20 text-text"
            : "bg-base-dark text-text border border-silver/20"
        )}
      >
        {role === "assistant" ? (
          <AssistantMarkdown content={content} />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-text">{content}</p>
        )}
      </div>
    </div>
  );
}
