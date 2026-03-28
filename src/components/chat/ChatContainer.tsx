"use client";

/**
 * コンシェルジュの遷移・自動オープン・session 境界は意図した仕様。
 * 変更する場合は `docs/concierge-chat-scopes.md` と整合を確認すること。
 * 本ファイルでは主に「回答表示・CTAタイミング・計測」を扱う。
 */

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
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { emitConciergeKpi } from "@/lib/chat/concierge-analytics";
import { getConciergeCtaDelayMs } from "@/lib/chat/concierge-cta-delay";
import { getUIMessageText } from "@/lib/chat/uimessage-text";
import { ChatPopup } from "./ChatPopup";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import {
  HomeConciergeFlow,
  type HomeConciergeFooterPhase,
} from "./HomeConciergeFlow";
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

  const [draftInjection, setDraftInjection] = useState<{
    id: number;
    text: string;
  } | null>(null);
  const [servicesIntroComplete, setServicesIntroComplete] = useState(false);
  const [serviceCardResetKey, setServiceCardResetKey] = useState(0);
  const [homeFooterPhase, setHomeFooterPhase] =
    useState<HomeConciergeFooterPhase>("wizard");

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
        body: { mode, pathname },
      }),
    [mode, pathname]
  );

  const { messages, sendMessage, setMessages, status, error, clearError } =
    useChat({
      id: chatSessionId,
      transport,
    });

  const prefersReducedMotion = useReducedMotion();
  const [showDelayedCta, setShowDelayedCta] = useState(false);
  const lastEmittedAnswerIdRef = useRef<string | null>(null);

  /** パス・文脈が変わったら必ずセッションを切り替え（サービスカードの会話が全ページに漏れないようにする） */
  useEffect(() => {
    setChatSessionId(provisionalId);
  }, [provisionalId]);

  useEffect(() => {
    lastEmittedAnswerIdRef.current = null;
  }, [chatSessionId]);

  const { shouldShowDemoPrompt, demoPrompt } = useChatSession(messages);
  const isLoading = status === "streaming" || status === "submitted";

  /** アシスタント回答完了時の計測（ストリーミング終了後の最終テキスト長） */
  useEffect(() => {
    if (isLoading || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    if (lastEmittedAnswerIdRef.current === last.id) return;
    lastEmittedAnswerIdRef.current = last.id;
    const text = getUIMessageText(last);
    emitConciergeKpi({
      name: "answer_complete",
      messageId: last.id,
      textLength: text.length,
      pathname,
      mode,
    });
  }, [isLoading, messages, pathname, mode]);

  /** 本文を先に読ませ、次の一歩CTAは遅延表示 */
  useEffect(() => {
    if (!open || messages.length === 0) {
      setShowDelayedCta(false);
      return;
    }
    if (isLoading) {
      setShowDelayedCta(false);
      return;
    }
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) {
      setShowDelayedCta(false);
      return;
    }
    const len = getUIMessageText(lastAssistant).length;
    const delayMs = getConciergeCtaDelayMs(len, prefersReducedMotion);
    setShowDelayedCta(false);
    const timer = setTimeout(() => {
      setShowDelayedCta(true);
      emitConciergeKpi({
        name: "cta_visible",
        pathname,
        mode,
        delayMs,
        textLength: len,
      });
    }, delayMs);
    return () => clearTimeout(timer);
  }, [open, messages, isLoading, prefersReducedMotion, pathname, mode]);

  /**
   * sessionStorage の pick と React 状態を同期。
   * /flow・/consulting の専用ページでは mode が既に決まっているため常に complete 扱いにする。
   */
  useLayoutEffect(() => {
    if (pathname === "/services") {
      setServicesIntroComplete(readServicesFlowPick() !== null);
    } else if (
      (pathname === "/flow" && mode === "development") ||
      (pathname === "/consulting" && mode === "consulting")
    ) {
      setServicesIntroComplete(true);
    } else {
      setServicesIntroComplete(false);
    }
  }, [pathname, mode, open, entrySource]);

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
    const userTurns = messages.filter((m) => m.role === "user").length;
    if (userTurns >= 1) {
      emitConciergeKpi({
        name: "followup_message",
        turn: userTurns + 1,
        pathname,
        mode,
      });
    }
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
    setServiceCardResetKey((k) => k + 1);
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
        setHomeFooterPhase("wizard");
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
   * /services カード経路・/flow・/consulting の専用ページでも表示する。
   * FAB→このページについて→開発/コンサル は page 表面。
   * サービスカードから開き直すと閉じる処理で surface が pick に戻るため、カード経路は pick でも表示する。
   */
  const isServiceWizardPage =
    pathname === "/services" ||
    pathname === "/flow" ||
    pathname === "/consulting";
  const showServiceCardStartFlow =
    isServiceWizardPage &&
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
        onFooterPhaseChange={setHomeFooterPhase}
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
        resetKey={serviceCardResetKey}
      />
    );
  } else if (showDemoRouteFlow) {
    mainContent = (
      <DemoListConciergeFlow
        disabled={isLoading}
        onUseFreeform={handleDemoRouteFreeform}
        onDismissForNavigation={dismissConciergeForSiteLink}
        onWizardComplete={(answers, picks) => {
          setDemoListWizardSnapshot({ answers, picks });
          setOpen(false);
          setConciergeSurface("pick");
          setEntrySource("fab");
        }}
        onWizardReset={() => setDemoListWizardSnapshot(null)}
      />
    );
  } else {
    mainContent = (
      <ConciergeEmptyPanel pathname={pathname}>
        {pathname === "/services" &&
          servicesIntroComplete &&
          (mode === "development" || mode === "consulting") && (
            <div className="border-b border-silver/15 px-4 py-3">
              <p className="text-xs font-medium text-text/70">
                {mode === "development" ? "開発" : "コンサルティング"}
              </p>
            </div>
          )}
      </ConciergeEmptyPanel>
    );
  }

  const hideChatForHomeDoneTiming =
    showGlobalHomeFlow &&
    messages.length === 0 &&
    (homeFooterPhase === "done_result" || homeFooterPhase === "done_cta");

  const showChatInput =
    !showEntryPicker &&
    !showServiceCardStartFlow &&
    !hideChatForHomeDoneTiming;

  const animateHomeDoneInput =
    showGlobalHomeFlow &&
    messages.length === 0 &&
    homeFooterPhase === "done_input";
  const wideHomeLayout = showGlobalHomeFlow;
  const onServicesDevOrConsult =
    isServiceWizardPage &&
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
            if (pathname === "/demo/list" || pathname === "/demo") {
              setConciergeSurface("page");
            } else {
              setConciergeSurface("pick");
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
            isServiceWizardPage &&
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

          <AnimatePresence>
            {messages.length > 0 && showDelayedCta && (
              <motion.div
                key="concierge-delayed-cta"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 14 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  ease: [0.22, 0.99, 0.35, 1],
                }}
                className="pointer-events-auto shrink-0 border-t border-silver/15 bg-base/30 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.25)]"
              >
                {shouldShowDemoPrompt &&
                  mode === "default" &&
                  !showEntryPicker && (
                    <div className="border-b border-silver/20 bg-base/50 px-4 py-3">
                      <p className="text-sm text-text-sub">{demoPrompt}</p>
                    </div>
                  )}

                {isDevOrConsultMode && (
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-2">
                      <ConciergeCtaLink
                        href="/estimate-detailed"
                        variant="primary"
                        onClick={() => {
                          emitConciergeKpi({
                            name: "cta_click",
                            href: "/estimate-detailed",
                            ctaKind: "estimate_detailed",
                            pathname,
                            mode,
                          });
                          dismissConciergeForSiteLink();
                        }}
                      >
                        {mode === "consulting" ? "相談・見積もり" : "概算見積もり"}
                      </ConciergeCtaLink>
                      <ConciergeCtaLink
                        href="/contact"
                        variant="secondary"
                        onClick={() => {
                          emitConciergeKpi({
                            name: "cta_click",
                            href: "/contact",
                            ctaKind: "contact",
                            pathname,
                            mode,
                          });
                          dismissConciergeForSiteLink();
                        }}
                      >
                        お問い合わせ
                      </ConciergeCtaLink>
                    </div>
                  </div>
                )}

                {!isDevOrConsultMode &&
                  mode === "default" &&
                  !showEntryPicker && (
                    <div className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs leading-relaxed">
                        <Link
                          href="/demo/list"
                          className="text-accent underline-offset-2 hover:underline"
                          onClick={() => {
                            emitConciergeKpi({
                              name: "cta_click",
                              href: "/demo/list",
                              ctaKind: "demo_list",
                              pathname,
                              mode,
                            });
                            dismissConciergeForSiteLink();
                          }}
                        >
                          demo一覧
                        </Link>
                        <Link
                          href="/estimate-detailed"
                          className="text-accent underline-offset-2 hover:underline"
                          onClick={() => {
                            emitConciergeKpi({
                              name: "cta_click",
                              href: "/estimate-detailed",
                              ctaKind: "estimate_detailed",
                              pathname,
                              mode,
                            });
                            dismissConciergeForSiteLink();
                          }}
                        >
                          詳細見積もり
                        </Link>
                        <Link
                          href="/contact"
                          className="text-accent underline-offset-2 hover:underline"
                          onClick={() => {
                            emitConciergeKpi({
                              name: "cta_click",
                              href: "/contact",
                              ctaKind: "contact",
                              pathname,
                              mode,
                            });
                            dismissConciergeForSiteLink();
                          }}
                        >
                          お問い合わせ
                        </Link>
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>

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
            <motion.div
              key={animateHomeDoneInput ? "home-done-chat-input" : "chat-input"}
              initial={
                animateHomeDoneInput && !prefersReducedMotion
                  ? { opacity: 0, y: 20 }
                  : false
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.38,
                ease: [0.22, 0.99, 0.35, 1],
              }}
              className="shrink-0"
            >
              <ChatInput
                onSend={handleSend}
                disabled={isLoading}
                placeholder={chatPlaceholder}
                draftInjection={draftInjection}
                onDraftConsumed={clearDraftInjection}
                inputId="concierge-chat-input"
              />
            </motion.div>
          ) : (
            <div className="border-t border-silver/15 bg-base/40 px-4 py-3 text-center text-xs text-text-sub/60">
              選択すると入力欄が開きます
            </div>
          )}
        </div>
      </ChatPopup>
    </>
  );
}
