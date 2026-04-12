"use client";

/**
 * コンシェルジュの遷移・自動オープン・session 境界は意図した仕様。
 * 変更する場合は `docs/concierge-chat-scopes.md` と整合を確認すること。
 * 本ファイルでは主に「回答表示・CTAタイミング・計測」を扱う。
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { emitConciergeKpi } from "@/lib/chat/concierge-analytics";
import { getConciergeCtaDelayMs } from "@/lib/chat/concierge-cta-delay";
import { getUIMessageText } from "@/lib/chat/uimessage-text";
import type { ConciergeSignals } from "@/lib/ai/concierge-senior";
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
import { ConciergeDemoRecommendOverlay } from "./ConciergeDemoRecommendOverlay";
import type { ConciergePick } from "@/lib/demo/intelligent-concierge";
import { shouldAttemptDemoRecommendFromText } from "@/lib/demo/infer-concierge-answers-from-text";
import { ServiceCardConciergeStartFlow } from "./ServiceCardConciergeStartFlow";
import { useChatSession } from "@/hooks/use-chat-session";
import { useConciergeChatTransport } from "@/hooks/use-concierge-chat-transport";
import {
  useClearDemoRecommendStateOnPath,
  useCloseConciergeWhenDemoAfterAutoList,
  useConciergeChatAutoOpen,
  useConciergeNavigateFromChatListener,
  useConciergePathnameModeSync,
  useConciergeServicesIntroSync,
  useDemoListPageOpenSequence,
  usePrefetchDemoCatalogWhenChatOpen,
  useServiceCardDirectSync,
} from "@/hooks/use-concierge-container-effects";
import { Button } from "@/components/ui/button";
import { ConciergeCtaLink } from "@/components/chat/ConciergeChoiceButton";
import {
  useConciergeChat,
  type ConciergeMode,
} from "@/components/chat/concierge-chat-context";
import {
  clearServicesFlowPick,
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
import {
  isDemoHubForConciergePolicy,
  isDemoExperienceWizardPath,
  useResolvedConciergePath,
} from "@/lib/chat/concierge-demo-hub-policy";
import { getConciergePanelDerivedState } from "@/lib/chat/concierge-panel-derived-state";
import { formatConciergeChatErrorMessage } from "@/lib/chat/concierge-chat-error-message";
import { prefetchDemoCatalog } from "@/lib/demo/demo-catalog-client";

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
  const resolvedPath = useResolvedConciergePath();
  const {
    open,
    setOpen,
    mode,
    setMode,
    entrySource,
    setEntrySource,
    pendingSignals,
    setPendingSignals,
    setDemoListWizardSnapshot,
    demoListPageOpenSeq,
  } = useConciergeChat();

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  /** /demo・/experience のフリーチャット送信後、ルール推定で最大3件（LLMなし） */
  const [demoFreeformPicks, setDemoFreeformPicks] = useState<
    ConciergePick[] | null
  >(null);
  const demoRecommendReqSeq = useRef(0);

  /** recommend-from-text 取得中は遅延CTAタイマーを掛けない（レース防止） */
  const [demoRecommendFromTextInFlight, setDemoRecommendFromTextInFlight] =
    useState(false);

  const dismissConciergeForSiteLink = useCallback(() => {
    suppressNextChatAutoOpen();
    setDemoFreeformPicks(null);
    setPendingSignals(null);
    setOpen(false);
  }, [setOpen, setPendingSignals]);

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

  /** 次の /api/chat 送信にだけ載せるシグナル（postPreset は1回でクリア） */
  const conciergeSignalsRef = useRef<Partial<ConciergeSignals>>({});

  const transport = useConciergeChatTransport(
    mode,
    pathname,
    conciergeSignalsRef,
    pendingSignals,
    () => setPendingSignals(null)
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
      pathname: resolvedPath,
      mode,
    });
  }, [isLoading, messages, resolvedPath, mode]);

  /** demo / experience では遅延CTAを使わない。おすすめAPI待ち中も禁止（レース防止）。 */
  const useDelayedConciergeCta = useMemo(() => {
    if (!resolvedPath) return false;
    if (isDemoHubForConciergePolicy(resolvedPath)) return false;
    if (demoRecommendFromTextInFlight) return false;
    return true;
  }, [resolvedPath, demoRecommendFromTextInFlight]);

  /** 本文を先に読ませ、次の一歩CTAは遅延表示 */
  useEffect(() => {
    if (!useDelayedConciergeCta || demoRecommendFromTextInFlight) {
      setShowDelayedCta(false);
      return;
    }
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
        pathname: resolvedPath,
        mode,
        delayMs,
        textLength: len,
      });
    }, delayMs);
    return () => clearTimeout(timer);
  }, [
    useDelayedConciergeCta,
    demoRecommendFromTextInFlight,
    open,
    messages,
    isLoading,
    prefersReducedMotion,
    resolvedPath,
    mode,
  ]);

  useConciergeServicesIntroSync(
    pathname,
    mode,
    open,
    entrySource,
    setServicesIntroComplete
  );
  useDemoListPageOpenSequence(
    pathname,
    demoListPageOpenSeq,
    setEntrySource,
    setConciergeSurface,
    setOpen
  );
  useCloseConciergeWhenDemoAfterAutoList(pathname, entrySource, setOpen);
  useConciergePathnameModeSync(pathname, setMode);
  useConciergeChatAutoOpen(
    pathname,
    setOpen,
    setEntrySource,
    setConciergeSurface,
    openRef
  );

  const handleSend = (text: string) => {
    const userTurns = messages.filter((m) => m.role === "user").length;
    if (userTurns >= 1) {
      emitConciergeKpi({
        name: "followup_message",
        turn: userTurns + 1,
        pathname: resolvedPath,
        mode,
      });
    }
    sendMessage({ text });

    const attemptRecommend =
      isDemoHubForConciergePolicy(resolvedPath) &&
      shouldAttemptDemoRecommendFromText(text);
    if (attemptRecommend) {
      setDemoRecommendFromTextInFlight(true);
      setDemoFreeformPicks(null);
      const seq = ++demoRecommendReqSeq.current;
      void fetch("/api/demos/recommend-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then((r) => r.json())
        .then((data: { picks?: unknown }) => {
          if (seq !== demoRecommendReqSeq.current) return;
          if (!Array.isArray(data.picks) || data.picks.length === 0) {
            setDemoFreeformPicks(null);
            return;
          }
          setDemoFreeformPicks(data.picks as ConciergePick[]);
        })
        .catch(() => {
          if (seq !== demoRecommendReqSeq.current) return;
          setDemoFreeformPicks(null);
        })
        .finally(() => {
          if (seq !== demoRecommendReqSeq.current) return;
          setDemoRecommendFromTextInFlight(false);
        });
    }
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

  useServiceCardDirectSync(
    open,
    isServiceCardDirect,
    pathname,
    setConciergeSurface,
    setEntrySource,
    setServiceCardStartDone
  );

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
        conciergeSignalsRef.current.postPreset = true;
        conciergeSignalsRef.current.presetLabel = label;
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
      conciergeSignalsRef.current.postPreset = true;
      conciergeSignalsRef.current.presetLabel = label;
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
    conciergeSignalsRef.current.postPreset = true;
    delete conciergeSignalsRef.current.presetLabel;
    setServiceCardStartDone(true);
  }, []);

  const handleServiceCardRestart = useCallback(() => {
    conciergeSignalsRef.current = {};
    setMessages([]);
    setServiceCardStartDone(false);
    setServiceCardResetKey((k) => k + 1);
    clearDraftInjection();
    clearError();
  }, [setMessages, clearDraftInjection, clearError]);

  const handleHomeGlobalWizardRestart = useCallback(() => {
    conciergeSignalsRef.current = {};
    setMessages([]);
    clearDraftInjection();
    clearError();
    setHomeFooterPhase("wizard");
    emitConciergeKpi({
      name: "wizard_reset",
      pathname: resolvedPath,
      mode,
      ctaKind: "home_global_wizard",
    });
  }, [setMessages, clearDraftInjection, clearError, resolvedPath, mode]);

  const handleDemoWizardRestart = useCallback(() => {
    conciergeSignalsRef.current = {};
    setMessages([]);
    clearDraftInjection();
    clearError();
    setDemoFreeformPicks(null);
    setDemoRecommendFromTextInFlight(false);
    setDemoListWizardSnapshot(null);
    emitConciergeKpi({
      name: "wizard_reset",
      pathname: resolvedPath,
      mode,
      ctaKind: "demo_list_wizard",
    });
  }, [
    setMessages,
    clearDraftInjection,
    clearError,
    setDemoListWizardSnapshot,
    resolvedPath,
    mode,
  ]);

  const maybePrefetchDemoCatalog = useCallback(() => {
    if (isDemoHubForConciergePolicy(resolvedPath)) prefetchDemoCatalog();
  }, [resolvedPath]);

  /** × 閉じる・アシスタント本文リンク遷移のとき共通（モーダル内状態を初期化） */
  const resetConciergeModalChrome = useCallback(() => {
    conciergeSignalsRef.current = {};
    setConciergeSurface("pick");
    setEntrySource("fab");
    setPendingSignals(null);
    setServiceCardStartDone(false);
    setHomeFooterPhase("wizard");
    setDemoFreeformPicks(null);
    setDemoRecommendFromTextInFlight(false);
  }, [setEntrySource, setPendingSignals]);

  const handlePopupOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        resetConciergeModalChrome();
      }
    },
    [setOpen, resetConciergeModalChrome]
  );

  useConciergeNavigateFromChatListener(setOpen, resetConciergeModalChrome);
  useClearDemoRecommendStateOnPath(
    resolvedPath,
    setDemoFreeformPicks,
    setDemoRecommendFromTextInFlight
  );
  usePrefetchDemoCatalogWhenChatOpen(open, pathname);

  const panel = useMemo(
    () =>
      getConciergePanelDerivedState({
        pathname,
        messagesLength: messages.length,
        conciergeSurface,
        mode,
        servicesIntroComplete,
        serviceCardStartDone,
        isServiceCardDirect,
        entrySource,
      }),
    [
      pathname,
      messages.length,
      conciergeSurface,
      mode,
      servicesIntroComplete,
      serviceCardStartDone,
      isServiceCardDirect,
      entrySource,
    ]
  );

  const popupMeta = panel.neutralServicesFabEntry
    ? POPUP_COPY.default
    : POPUP_COPY[mode];

  let mainContent: ReactNode;
  switch (panel.mainBranch.kind) {
    case "messages":
      mainContent = (
        <ChatMessages messages={messages} isLoading={isLoading} />
      );
      break;
    case "entryPicker":
      mainContent = (
        <ConciergeEntryPicker
          disabled={isLoading}
          onChoose={handleEntryChoice}
        />
      );
      break;
    case "homeFlow":
      mainContent = (
        <HomeConciergeFlow
          disabled={isLoading}
          onInjectDraft={(draft) =>
            setDraftInjection({ id: Date.now(), text: draft })
          }
          onFooterPhaseChange={setHomeFooterPhase}
        />
      );
      break;
    case "servicesIntro":
      mainContent = (
        <ServicesConciergeFlow
          disabled={isLoading}
          onPickService={handleServicesPick}
        />
      );
      break;
    case "serviceCardStart":
      mainContent = (
        <ServiceCardConciergeStartFlow
          variant={mode === "consulting" ? "consulting" : "development"}
          disabled={isLoading}
          onChoosePreset={handleServiceCardPreset}
          onChooseFreeform={handleServiceCardFreeform}
          resetKey={serviceCardResetKey}
        />
      );
      break;
    case "demoRouteFlow":
      mainContent = (
        <DemoListConciergeFlow
          disabled={isLoading}
          onUseFreeform={handleDemoRouteFreeform}
          onDismissForNavigation={dismissConciergeForSiteLink}
          onWizardComplete={(answers, picks) => {
            setDemoListWizardSnapshot({ answers, picks });
            if (pathname === "/demo/list") {
              setOpen(false);
              setConciergeSurface("pick");
              setEntrySource("fab");
            }
          }}
          onWizardReset={() => setDemoListWizardSnapshot(null)}
        />
      );
      break;
    default:
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
    panel.showGlobalHomeFlow &&
    messages.length === 0 &&
    (homeFooterPhase === "done_result" || homeFooterPhase === "done_cta");

  const showChatInput =
    !panel.showEntryPicker &&
    !panel.showServiceCardStartFlow &&
    !hideChatForHomeDoneTiming;

  const animateHomeDoneInput =
    panel.showGlobalHomeFlow &&
    messages.length === 0 &&
    homeFooterPhase === "done_input";
  /** トップの分岐フローと同じ広ポップアップを、ホームで会話が始まったあとも維持する（messages>0 で showGlobalHomeFlow が false になるため別条件が必要） */
  const wideHomeLayout =
    panel.showGlobalHomeFlow ||
    (panel.isHomePage &&
      messages.length > 0 &&
      (conciergeSurface === "global" || conciergeSurface === "pick"));
  const showHomeGlobalWizardResetBar =
    panel.isHomePage &&
    mode === "default" &&
    messages.length > 0 &&
    (conciergeSurface === "global" || conciergeSurface === "pick");
  const showDemoWizardResetBar =
    messages.length > 0 &&
    conciergeSurface === "page" &&
    isDemoExperienceWizardPath(pathname);
  const onServicesDevOrConsult =
    panel.isServiceWizardPage &&
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
          onPointerEnter={maybePrefetchDemoCatalog}
          onFocus={maybePrefetchDemoCatalog}
          onClick={() => {
            setEntrySource("fab");
            setPendingSignals(null);
            setServiceCardStartDone(false);
            if (pathname === "/services") {
              clearServicesFlowPick();
              setMode("default");
            }
            if (isDemoExperienceWizardPath(pathname)) {
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
            AIに相談
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              className={cn(
                "relative flex min-h-0 flex-1 flex-col overflow-hidden",
                demoFreeformPicks &&
                  demoFreeformPicks.length > 0 &&
                  "min-h-[min(48vh,520px)]"
              )}
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {mainContent}
              </div>
              <AnimatePresence>
                {useDelayedConciergeCta &&
                  messages.length > 0 &&
                  showDelayedCta &&
                  !(demoFreeformPicks && demoFreeformPicks.length > 0) &&
                  !demoRecommendFromTextInFlight && (
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
                        !panel.showEntryPicker && (
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
                                  pathname: resolvedPath,
                                  mode,
                                });
                                dismissConciergeForSiteLink();
                              }}
                            >
                              {mode === "consulting"
                                ? "相談・見積もり"
                                : "概算見積もり"}
                            </ConciergeCtaLink>
                            <ConciergeCtaLink
                              href="/contact"
                              variant="secondary"
                              onClick={() => {
                                emitConciergeKpi({
                                  name: "cta_click",
                                  href: "/contact",
                                  ctaKind: "contact",
                                  pathname: resolvedPath,
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
                        !panel.showEntryPicker && (
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
                                    pathname: resolvedPath,
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
                                    pathname: resolvedPath,
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
                                    pathname: resolvedPath,
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
              {demoFreeformPicks && demoFreeformPicks.length > 0 ? (
                <ConciergeDemoRecommendOverlay
                  picks={demoFreeformPicks}
                  resetFlowLabel="おすすめを閉じる"
                  onResetFlow={() => setDemoFreeformPicks(null)}
                  onDismissForNavigation={() => {
                    setDemoFreeformPicks(null);
                    dismissConciergeForSiteLink();
                  }}
                />
              ) : null}
            </div>
          </div>

          {showHomeGlobalWizardResetBar && (
            <div className="border-b border-silver/15 bg-base/40 px-4 py-2">
              <button
                type="button"
                disabled={isLoading}
                className="text-xs font-medium text-accent underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-50"
                onClick={handleHomeGlobalWizardRestart}
              >
                選択式ガイドに戻る
              </button>
            </div>
          )}

          {showDemoWizardResetBar && (
            <div className="border-b border-silver/15 bg-base/40 px-4 py-2">
              <button
                type="button"
                disabled={isLoading}
                className="text-xs font-medium text-accent underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-50"
                onClick={handleDemoWizardRestart}
              >
                demoの条件選択に戻る
              </button>
            </div>
          )}

          {messages.length > 0 &&
            panel.isServiceWizardPage &&
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

          {error && (
            <div className="border-t border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="mb-2">
                {formatConciergeChatErrorMessage(error.message)}
              </p>
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
