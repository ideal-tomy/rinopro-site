"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { MessageCircle } from "lucide-react";
import { ChatSheet } from "./ChatSheet";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { PresetQuestions } from "./PresetQuestions";
import { useChatSession } from "@/hooks/use-chat-session";
import { Button } from "@/components/ui/button";

export function ChatContainer() {
  const pathname = usePathname();
  const isTopPage = pathname === "/";

  const [open, setOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
  });

  const { shouldShowDemoPrompt, demoPrompt } = useChatSession(messages);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (isTopPage) {
      const timer = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(timer);
    } else {
      setOpen(false);
    }
  }, [isTopPage]);

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full border-silver/30 bg-base-dark shadow-lg hover:border-accent/50 md:bottom-8 md:right-8"
        onClick={() => setOpen(true)}
        aria-label="チャットを開く"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatSheet
        open={open}
        onOpenChange={setOpen}
        title="AIコンシェルジュ"
        description="音声またはテキストでお気軽にご相談ください。"
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {messages.length === 0 ? (
            <PresetQuestions onSelect={handleSend} disabled={isLoading} />
          ) : (
            <ChatMessages messages={messages} />
          )}

          {shouldShowDemoPrompt && (
            <div className="border-t border-silver/20 bg-base/50 px-4 py-3">
              <p className="text-sm text-text-sub">{demoPrompt}</p>
            </div>
          )}

          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            voiceEnabled={voiceEnabled}
            onVoiceToggle={() => setVoiceEnabled((v) => !v)}
          />
        </div>
      </ChatSheet>
    </>
  );
}
