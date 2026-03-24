"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle } from "lucide-react";
import { ChatPopup } from "./ChatPopup";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { HomeConciergeFlow } from "./HomeConciergeFlow";
import { ServicesConciergeFlow } from "./ServicesConciergeFlow";
import { ConciergeEmptyPanel } from "./ConciergeEmptyPanel";
import { ConciergeEntryPicker } from "./ConciergeEntryPicker";
import type { ConciergeEntryChoice } from "./ConciergeEntryPicker";
import { useChatSession } from "@/hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import {
  useConciergeChat,
  type ConciergeMode,
} from "@/components/chat/concierge-chat-context";
import {
  chatAutoOpenStorageKey,
  consumeSuppressChatAutoOnce,
  shouldAttemptChatAutoOpen,
  writeServicesFlowPick,
  readServicesFlowPick,
  suppressNextChatAutoOpen,
  type ServicesFlowPick,
} from "@/lib/chat/chat-auto-open";

type ConciergeSurface = "pick" | "page" | "global";

/** メッセージなし時の仮セッション ID（表面・パス・モードから決定） */
function provisionalChatSessionId(
  pathname: string,
  mode: ConciergeMode,
  surface: ConciergeSurface
): string {
  if (surface === "pick") return "concierge-entry-pick";
  if (surface === "global") return "concierge-home";
  if (pathname === "/services") return "concierge-services-hub";
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

  const dismissConciergeForSiteLink = useCallback(() => {
    suppressNextChatAutoOpen();
    setOpen(false);
  }, [setOpen]);

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [draftInjection, setDraftInjection] = useState<{
    id: number;
    text: string;
  } | null>(null);
  const [servicesIntroComplete, setServicesIntroComplete] = useState(false);

  /** FAB 直後の選択: ページ文脈 / 全体ガイド */
  const [conciergeSurface, setConciergeSurface] =
    useState<ConciergeSurface>("pick");

  const clearDraftInjection = useCallback(() => {
    setDraftInjection(null);
  }, []);

  const provisionalId = useMemo(
    () => provisionalChatSessionId(pathname, mode, conciergeSurface),
    [pathname, mode, conciergeSurface]
  );

  const [chatSessionId, setChatSessionId] = useState("concierge-entry-pick");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { mode },
      }),
    [mode]
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: chatSessionId,
    transport,
  });

  /** メッセージがないときだけセッション ID を追随。会話開始後は固定（ページ遷移でも履歴を切らない） */
  useEffect(() => {
    if (messages.length > 0) return;
    setChatSessionId(provisionalId);
  }, [provisionalId, messages.length]);

  const { shouldShowDemoPrompt, demoPrompt } = useChatSession(messages);
  const isLoading = status === "streaming" || status === "submitted";

  useLayoutEffect(() => {
    if (pathname === "/services") {
      setServicesIntroComplete(readServicesFlowPick() !== null);
    } else {
      setServicesIntroComplete(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/flow" || pathname === "/services/development") {
      setMode("development");
    } else if (
      pathname === "/consulting" ||
      pathname === "/services/consulting"
    ) {
      setMode("consulting");
    } else if (pathname === "/services") {
      const picked = readServicesFlowPick();
      if (picked) setMode(picked);
      else setMode("default");
    } else {
      setMode("default");
    }
  }, [pathname, setMode]);

  useEffect(() => {
    if (!shouldAttemptChatAutoOpen(pathname)) return;
    const key = chatAutoOpenStorageKey(pathname);
    if (!key) return;
    if (consumeSuppressChatAutoOnce()) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(key) === "1") return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname, setOpen]);

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  const handleServicesPick = useCallback(
    (next: ServicesFlowPick) => {
      writeServicesFlowPick(next);
      setMode(next);
      setServicesIntroComplete(true);
    },
    [setMode]
  );

  const handleEntryChoice = useCallback((choice: ConciergeEntryChoice) => {
    if (choice === "global") {
      setConciergeSurface("global");
      return;
    }
    setConciergeSurface("page");
  }, []);

  const handlePopupOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        setConciergeSurface("pick");
      }
    },
    [setOpen]
  );

  const popupMeta = POPUP_COPY[mode];

  const showGlobalHomeFlow =
    conciergeSurface === "global" && messages.length === 0;

  const showEntryPicker = messages.length === 0 && conciergeSurface === "pick";

  let mainContent: ReactNode;
  if (messages.length > 0) {
    mainContent = <ChatMessages messages={messages} />;
  } else if (showEntryPicker) {
    mainContent = (
      <ConciergeEntryPicker
        disabled={isLoading}
        onChoose={handleEntryChoice}
      />
    );
  } else if (showGlobalHomeFlow) {
    mainContent = (
      <HomeConciergeFlow
        disabled={isLoading}
        onInjectDraft={(draft) =>
          setDraftInjection({ id: Date.now(), text: draft })
        }
      />
    );
  } else if (
    pathname === "/services" &&
    conciergeSurface === "page" &&
    !servicesIntroComplete
  ) {
    mainContent = (
      <ServicesConciergeFlow
        disabled={isLoading}
        onPickService={handleServicesPick}
      />
    );
  } else {
    mainContent = (
      <ConciergeEmptyPanel pathname={pathname}>
        {pathname === "/services" &&
          conciergeSurface === "page" &&
          servicesIntroComplete && (
            <div className="border-b border-silver/15 px-4 py-3 text-sm text-text-sub">
              <p className="font-medium text-text">
                {mode === "development" ? "開発" : "コンサルティング"}
                についてお答えします。下の入力欄から自由にご質問ください。
              </p>
            </div>
          )}
      </ConciergeEmptyPanel>
    );
  }

  const showChatInput = !showEntryPicker;
  const wideHomeLayout = showGlobalHomeFlow;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="fixed bottom-5 right-4 z-[45] box-border flex min-h-[3.5rem] min-w-[3.5rem] flex-col items-center justify-center gap-1 rounded-full border-2 border-silver/35 bg-base-dark/95 px-3 py-2 shadow-[0_6px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-[0_8px_32px_rgba(0,242,255,0.12)] sm:bottom-6 sm:right-6 sm:min-h-[3.75rem] sm:min-w-[10.5rem] sm:flex-row sm:gap-2 sm:px-4 sm:py-0 md:bottom-8 md:right-8"
        onClick={() => setOpen(true)}
        aria-label="相談・ガイド（AIコンシェルジュ）を開く"
      >
        <MessageCircle className="h-6 w-6 shrink-0 text-accent" aria-hidden />
        <span className="max-w-[4.75rem] text-center text-[0.62rem] font-semibold leading-snug tracking-tight text-text sm:max-w-none sm:text-sm sm:font-medium sm:tracking-normal">
          相談・ガイド
        </span>
      </Button>

      <ChatPopup
        open={open}
        onOpenChange={handlePopupOpenChange}
        title={popupMeta.title}
        description={popupMeta.description}
        className={
          wideHomeLayout
            ? "md:max-h-[min(90vh,880px)] md:max-w-2xl lg:max-w-3xl"
            : undefined
        }
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {mainContent}

          {shouldShowDemoPrompt &&
            mode === "default" &&
            !showEntryPicker && (
              <div className="border-t border-silver/20 bg-base/50 px-4 py-3">
                <p className="text-sm text-text-sub">{demoPrompt}</p>
              </div>
            )}

          {messages.length > 0 && (
            <div className="border-t border-silver/15 bg-base/30 px-4 py-2.5 text-xs leading-relaxed text-text-sub">
              <p className="mb-1.5 font-medium text-text/85">
                次の一歩（サイト内）
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link
                  href="/demo/list"
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={() => dismissConciergeForSiteLink()}
                >
                  demo一覧
                </Link>
                <Link
                  href="/estimate-detailed"
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={() => dismissConciergeForSiteLink()}
                >
                  詳細見積もり（概算レンジ）
                </Link>
                <Link
                  href="/contact"
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={() => dismissConciergeForSiteLink()}
                >
                  お問い合わせ
                </Link>
              </div>
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

          {showChatInput ? (
            <ChatInput
              onSend={handleSend}
              disabled={isLoading}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={() => setVoiceEnabled((v) => !v)}
              draftInjection={draftInjection}
              onDraftConsumed={clearDraftInjection}
              inputId="concierge-chat-input"
            />
          ) : (
            <div className="border-t border-silver/15 bg-base/40 px-4 py-3 text-center text-xs text-text-sub">
              上の2択から選ぶと、入力欄が使えるようになります。
            </div>
          )}
        </div>
      </ChatPopup>
    </>
  );
}
