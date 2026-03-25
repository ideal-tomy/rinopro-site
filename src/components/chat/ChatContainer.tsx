"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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
import { DemoListConciergeFlow } from "./DemoListConciergeFlow";
import { ServiceCardConciergeStartFlow } from "./ServiceCardConciergeStartFlow";
import { useChatSession } from "@/hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import { ConciergeCtaLink } from "@/components/chat/ConciergeChoiceButton";
import {
  useConciergeChat,
  type ConciergeMode,
} from "@/components/chat/concierge-chat-context";
import {
  chatAutoOpenStorageKey,
  clearServicesFlowPick,
  consumeSuppressChatAutoOnce,
  shouldAttemptChatAutoOpen,
  writeServicesFlowPick,
  readServicesFlowPick,
  suppressNextChatAutoOpen,
  type ServicesFlowPick,
} from "@/lib/chat/chat-auto-open";
import { getServiceCardPresetReply } from "@/lib/chat/service-card-preset-content";
import {
  buildConciergeChatSessionId,
  CONCIERGE_CHAT_SESSION_INITIAL,
  type ConciergeChatSurface,
} from "@/lib/chat/concierge-session-id";

type ConciergeSurface = ConciergeChatSurface;

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
  const {
    open,
    setOpen,
    mode,
    setMode,
    entrySource,
    setEntrySource,
    setDemoListWizardSnapshot,
    demoListPageOpenSeq,
  } = useConciergeChat();

  const lastDemoListOpenSeqHandled = useRef(0);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

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
    () =>
      buildConciergeChatSessionId({
        pathname,
        mode,
        surface: conciergeSurface,
        entrySource,
      }),
    [pathname, mode, conciergeSurface, entrySource]
  );

  const [chatSessionId, setChatSessionId] = useState(CONCIERGE_CHAT_SESSION_INITIAL);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { mode },
      }),
    [mode]
  );

  const { messages, sendMessage, setMessages, status, error, clearError } =
    useChat({
      id: chatSessionId,
      transport,
    });

  /** パス・文脈が変わったら必ずセッションを切り替え（サービスカードの会話が全ページに漏れないようにする） */
  useEffect(() => {
    setChatSessionId(provisionalId);
  }, [provisionalId]);

  const { shouldShowDemoPrompt, demoPrompt } = useChatSession(messages);
  const isLoading = status === "streaming" || status === "submitted";

  /** sessionStorage の pick と React 状態を同期（同一 /services 上でカードを押した直後も取りこぼさない） */
  useLayoutEffect(() => {
    if (pathname === "/services") {
      setServicesIntroComplete(readServicesFlowPick() !== null);
    } else {
      setServicesIntroComplete(false);
    }
  }, [pathname, open, entrySource]);

  /** `/demo/list` の「コンシェルジュを開く」と同一経路（page 表面の DemoListConciergeFlow） */
  useEffect(() => {
    if (pathname !== "/demo/list") return;
    if (demoListPageOpenSeq === 0) return;
    if (demoListPageOpenSeq === lastDemoListOpenSeqHandled.current) return;
    lastDemoListOpenSeqHandled.current = demoListPageOpenSeq;
    setEntrySource("fab");
    setConciergeSurface("page");
    setOpen(true);
  }, [demoListPageOpenSeq, pathname, setEntrySource, setOpen]);

  /** `/demo/list` の自動オープン直後に `/demo` へ遷移したとき、モーダルが開いたまま残らないようにする */
  useEffect(() => {
    if (pathname !== "/demo") return;
    if (entrySource !== "auto") return;
    setOpen(false);
  }, [pathname, entrySource, setOpen]);

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
      // 既にユーザーが FAB 等で開いている場合は表面を上書きしない
      if (openRef.current) return;
      /**
       * /demo/list・/services は「そのページにいる＝文脈が決まっている」ため、
       * 自動オープンでは入口の 2 択（このページ / サイト全体）を挟まず page に入る。
       * `/` は pick のまま（ホームの分岐フロー）。
       */
      if (pathname === "/demo/list" || pathname === "/services") {
        setEntrySource("auto");
        setConciergeSurface("page");
      }
      setOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname, setOpen, setEntrySource]);

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

  const handleEntryChoice = useCallback(
    (choice: ConciergeEntryChoice) => {
      if (choice === "global") {
        setConciergeSurface("global");
        return;
      }
      if (pathname === "/") {
        setConciergeSurface("global");
        return;
      }
      if (pathname === "/services") {
        clearServicesFlowPick();
        setMode("default");
      }
      setConciergeSurface("page");
    },
    [pathname, setMode]
  );

  const handleDemoRouteFreeform = useCallback(() => {
    setConciergeSurface("page");
  }, []);

  const isServiceCardDirect =
    entrySource === "services-card-development" ||
    entrySource === "services-card-consulting";

  const [serviceCardStartDone, setServiceCardStartDone] = useState(false);

  /** サービスカード経路は常に page 表面（閉じると pick に戻るため、カード再開で入口ピッカーと混線しないようにする） */
  useEffect(() => {
    if (open && isServiceCardDirect) {
      setConciergeSurface("page");
    }
  }, [open, isServiceCardDirect]);

  useEffect(() => {
    if (pathname !== "/services" && isServiceCardDirect) {
      setEntrySource("fab");
    }
  }, [pathname, isServiceCardDirect, setEntrySource]);

  useEffect(() => {
    if (pathname !== "/services") {
      setServiceCardStartDone(false);
    }
  }, [pathname]);

  const handleServiceCardPreset = useCallback(
    (label: string) => {
      const variant = mode === "consulting" ? "consulting" : "development";
      const reply = getServiceCardPresetReply(variant, label);
      const userMsg = {
        id: crypto.randomUUID(),
        role: "user" as const,
        parts: [{ type: "text" as const, text: label }],
      };
      if (reply) {
        setMessages((prev) => [
          ...prev,
          userMsg,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            parts: [{ type: "text" as const, text: reply }],
          },
        ]);
        return;
      }
      const topicPrefix =
        mode === "development"
          ? "【開発相談の開始メモ】"
          : "【コンサル相談の開始メモ】";
      setDraftInjection({
        id: Date.now(),
        text: `${topicPrefix}\n- 相談したい項目: ${label}`,
      });
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          parts: [
            {
              type: "text" as const,
              text: "ご選択を確認しました。詳細は入力欄の下書きを編集のうえ送信してください。",
            },
          ],
        },
      ]);
    },
    [mode, setDraftInjection, setMessages]
  );

  const handleServiceCardFreeform = useCallback(() => {
    setServiceCardStartDone(true);
  }, []);

  const handleServiceCardRestart = useCallback(() => {
    setMessages([]);
    setServiceCardStartDone(false);
    clearDraftInjection();
    clearError();
  }, [setMessages, clearDraftInjection, clearError]);

  const handlePopupOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        setConciergeSurface("pick");
        setEntrySource("fab");
        setServiceCardStartDone(false);
      }
    },
    [setOpen, setEntrySource]
  );

  const isHomePage = pathname === "/";
  const showGlobalHomeFlow =
    messages.length === 0 &&
    (conciergeSurface === "global" || (isHomePage && conciergeSurface === "pick"));

  const showEntryPicker =
    messages.length === 0 &&
    conciergeSurface === "pick" &&
    !isHomePage &&
    !isServiceCardDirect;

  /** /services で FAB 経路の入口ピッカー中は、カード用レーンに引っ張られない中立タイトル */
  const neutralServicesFabEntry =
    pathname === "/services" &&
    showEntryPicker &&
    entrySource === "fab";
  const popupMeta = neutralServicesFabEntry ? POPUP_COPY.default : POPUP_COPY[mode];
  const showDemoRouteFlow =
    messages.length === 0 &&
    conciergeSurface === "page" &&
    (pathname === "/demo/list" || pathname === "/demo");
  /**
   * プリセット「はじめに」UI。
   * FAB→このページについて→開発/コンサル は page 表面。
   * サービスカードから開き直すと閉じる処理で surface が pick に戻るため、カード経路は pick でも表示する。
   */
  const showServiceCardStartFlow =
    pathname === "/services" &&
    servicesIntroComplete &&
    (mode === "development" || mode === "consulting") &&
    !serviceCardStartDone &&
    messages.length === 0 &&
    (conciergeSurface === "page" || isServiceCardDirect);

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
  } else if (showServiceCardStartFlow) {
    mainContent = (
      <ServiceCardConciergeStartFlow
        variant={mode === "consulting" ? "consulting" : "development"}
        disabled={isLoading}
        onChoosePreset={handleServiceCardPreset}
        onChooseFreeform={handleServiceCardFreeform}
      />
    );
  } else if (showDemoRouteFlow) {
    mainContent = (
      <DemoListConciergeFlow
        disabled={isLoading}
        onUseFreeform={handleDemoRouteFreeform}
        onDismissForNavigation={dismissConciergeForSiteLink}
        onWizardComplete={(answers, picks) =>
          setDemoListWizardSnapshot({ answers, picks })
        }
        onWizardReset={() => setDemoListWizardSnapshot(null)}
      />
    );
  } else {
    mainContent = (
      <ConciergeEmptyPanel pathname={pathname}>
        {pathname === "/services" &&
          servicesIntroComplete &&
          (mode === "development" || mode === "consulting") && (
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

  const showChatInput = !showEntryPicker && !showServiceCardStartFlow;
  const wideHomeLayout = showGlobalHomeFlow;
  const onServicesDevOrConsult =
    pathname === "/services" &&
    (mode === "development" || mode === "consulting");
  const isDevOrConsultMode =
    mode === "development" || mode === "consulting";

  const chatPlaceholder = useMemo(() => {
    if (onServicesDevOrConsult) {
      if (mode === "development") {
        return "例: 資料がまとまっていなくて探すのに時間がかかる / 売上計算と利益計算で同じデータを何度も入力して面倒";
      }
      return "例: 現場課題が整理できていない / どこから改善すべきか迷っている";
    }
    return "メッセージを入力...";
  }, [onServicesDevOrConsult, mode]);

  return (
    <>
      <div className="pointer-events-none fixed bottom-5 right-4 z-[80] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
        <Button
          type="button"
          variant="outline"
          className="pointer-events-auto box-border flex min-h-[3.5rem] min-w-[3.5rem] flex-col items-center justify-center gap-1 rounded-full border-2 border-silver/35 bg-base-dark/95 px-3 py-2 shadow-[0_6px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-[0_8px_32px_rgba(0,242,255,0.12)] sm:min-h-[3.75rem] sm:min-w-[10.5rem] sm:flex-row sm:gap-2 sm:px-4 sm:py-0"
          onClick={() => {
            setEntrySource("fab");
            setServiceCardStartDone(false);
            if (pathname === "/services") {
              clearServicesFlowPick();
              setMode("default");
            }
            setOpen(true);
          }}
          aria-label="相談・ガイド（AIコンシェルジュ）を開く"
        >
          <MessageCircle className="h-6 w-6 shrink-0 text-accent" aria-hidden />
          <span className="max-w-[4.75rem] text-center text-[0.62rem] font-semibold leading-snug tracking-tight text-text sm:max-w-none sm:text-sm sm:font-medium sm:tracking-normal">
            相談・ガイド
          </span>
        </Button>
      </div>

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

          {messages.length > 0 &&
            pathname === "/services" &&
            onServicesDevOrConsult && (
              <div className="border-b border-silver/15 bg-base/40 px-4 py-2">
                <button
                  type="button"
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                  onClick={handleServiceCardRestart}
                >
                  はじめの選択に戻る
                </button>
              </div>
            )}

          {shouldShowDemoPrompt &&
            mode === "default" &&
            !showEntryPicker && (
              <div className="border-t border-silver/20 bg-base/50 px-4 py-3">
                <p className="text-sm text-text-sub">{demoPrompt}</p>
              </div>
            )}

          {messages.length > 0 && isDevOrConsultMode && (
            <div className="border-t border-silver/15 bg-base/30 px-4 py-3">
              <p className="mb-2 text-xs font-medium leading-relaxed text-text/85">
                次の一歩（サイト内）
              </p>
              <div className="grid grid-cols-2 gap-2">
                <ConciergeCtaLink
                  href="/demo"
                  variant="secondary"
                  onClick={() => dismissConciergeForSiteLink()}
                >
                  体験demo
                </ConciergeCtaLink>
                <ConciergeCtaLink
                  href="/estimate-detailed"
                  variant="primary"
                  onClick={() => dismissConciergeForSiteLink()}
                >
                  概算見積もり
                </ConciergeCtaLink>
              </div>
            </div>
          )}

          {messages.length > 0 &&
            !isDevOrConsultMode &&
            mode === "default" &&
            !showEntryPicker && (
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
              placeholder={chatPlaceholder}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={() => setVoiceEnabled((v) => !v)}
              draftInjection={draftInjection}
              onDraftConsumed={clearDraftInjection}
              inputId="concierge-chat-input"
            />
          ) : (
            <div className="border-t border-silver/15 bg-base/40 px-4 py-3 text-center text-xs text-text-sub">
              {showServiceCardStartFlow
                ? "上の選択肢か自由記述を選ぶと、入力欄が使えるようになります。"
                : "上の2択から選ぶと、入力欄が使えるようになります。"}
            </div>
          )}
        </div>
      </ChatPopup>
    </>
  );
}
