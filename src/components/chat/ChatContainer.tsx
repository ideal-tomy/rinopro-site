"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle } from "lucide-react";
import { ChatPopup } from "./ChatPopup";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { PresetQuestions } from "./PresetQuestions";
import { useChatSession } from "@/hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import {
  useConciergeChat,
  type ConciergeMode,
} from "@/components/chat/concierge-chat-context";

function chatSessionId(pathname: string, mode: ConciergeMode): string {
  if (pathname === "/") return "concierge-home";
  if (pathname.startsWith("/demo")) {
    return `concierge-demo-${pathname.replace(/\//g, "_")}`;
  }
  if (mode === "development") return "concierge-session-development";
  if (mode === "consulting") return "concierge-session-consulting";
  const slug = pathname.slice(1).replace(/\//g, "-") || "root";
  return `concierge-path-${slug}`;
}

const POPUP_COPY: Record<
  ConciergeMode,
  { title: string; description: string }
> = {
  default: {
    title: "AIコンシェルジュ",
    description: "音声またはテキストでお気軽にご相談ください。",
  },
  development: {
    title: "開発について",
    description: "要件や実装の進め方について、対話で整理できます。",
  },
  consulting: {
    title: "コンサルティングについて",
    description: "業務課題の整理から、検証・開発への道筋まで相談できます。",
  },
};

export function ChatContainer() {
  const pathname = usePathname();
  const { open, setOpen, mode, setMode } = useConciergeChat();

  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const chatId = useMemo(
    () => chatSessionId(pathname, mode),
    [pathname, mode]
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { mode },
      }),
    [mode]
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: chatId,
    transport,
  });

  const { shouldShowDemoPrompt, demoPrompt } = useChatSession(messages);
  const isLoading = status === "streaming" || status === "submitted";

  const hideFabOnServicesIndex = pathname === "/services";

  useEffect(() => {
    if (pathname === "/flow" || pathname === "/services/development")
      setMode("development");
    else if (pathname === "/consulting" || pathname === "/services/consulting")
      setMode("consulting");
    else setMode("default");
  }, [pathname, setMode]);

  useEffect(() => {
    if (pathname !== "/") return;
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (pathname === "/services") {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  useEffect(() => {
    if (pathname.startsWith("/demo")) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  const popupMeta = POPUP_COPY[mode];

  return (
    <>
      {!hideFabOnServicesIndex && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full border-silver/30 bg-base-dark shadow-lg hover:border-accent/50 md:bottom-8 md:right-8"
          onClick={() => setOpen(true)}
          aria-label="チャットを開く"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <ChatPopup
        open={open}
        onOpenChange={setOpen}
        title={popupMeta.title}
        description={popupMeta.description}
        className={
          pathname === "/"
            ? "md:max-h-[min(90vh,880px)] md:max-w-2xl lg:max-w-3xl"
            : undefined
        }
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {messages.length === 0 ? (
            <PresetQuestions onSelect={handleSend} disabled={isLoading} />
          ) : (
            <ChatMessages messages={messages} />
          )}

          {shouldShowDemoPrompt && mode === "default" && (
            <div className="border-t border-silver/20 bg-base/50 px-4 py-3">
              <p className="text-sm text-text-sub">{demoPrompt}</p>
            </div>
          )}

          {error && (
            <div className="border-t border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="mb-2">{error.message}</p>
              <button
                type="button"
                className="underline underline-offset-2"
                onClick={() => clearError()}
              >
                閉じる
              </button>
            </div>
          )}

          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            voiceEnabled={voiceEnabled}
            onVoiceToggle={() => setVoiceEnabled((v) => !v)}
          />
        </div>
      </ChatPopup>
    </>
  );
}
