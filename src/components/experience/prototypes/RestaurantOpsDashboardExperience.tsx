"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/motion/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import {
  DEMO_SCENARIO_STEPS,
  HOME_CARDS,
} from "@/lib/experience/restaurant-dashboard/scenario";
import {
  CUE_EXPENSES_MS,
  CUE_RECEIPTS_MS,
  CUE_SHIFT_MS,
  CUE_TRAFFIC_MS,
  logEmphasisForDemoStep,
  scaleCueMs,
  type DemoSpotlight,
} from "@/lib/experience/restaurant-dashboard/demo-visual-cues";
import {
  CROSSFADE_GAP_MS,
  DEFAULT_HOLD_AFTER_REVEAL_MS,
  DEFAULT_TELOP_MS,
  DEMO_CROSSFADE_SEC,
  DEMO_INTRO_TITLE_MS,
  LOOP_RESET_HOME_MS,
} from "@/lib/experience/restaurant-dashboard/timing";
import type {
  DashboardChapter,
  HomeCardDef,
  HomeCardId,
} from "@/lib/experience/restaurant-dashboard/types";
import { AppShell } from "./restaurant-dashboard/AppShell";
import { DashboardHomeGrid } from "./restaurant-dashboard/DashboardHomeGrid";
import { DemoIntroOverlay } from "./restaurant-dashboard/DemoIntroOverlay";
import { DemoTelopOverlay } from "./restaurant-dashboard/DemoTelopOverlay";
import { DemoTelopFullSlide } from "./restaurant-dashboard/DemoTelopFullSlide";
import { EventLog, type LogBlock } from "./restaurant-dashboard/EventLog";
import { ReplayControls } from "./restaurant-dashboard/ReplayControls";
import { SpotlightRing } from "./restaurant-dashboard/SpotlightRing";
import {
  ShiftChapter,
  type ShiftApproveStage,
} from "./restaurant-dashboard/chapters/ShiftChapter";
import { TrafficChapter } from "./restaurant-dashboard/chapters/TrafficChapter";
import { ReceiptsChapter } from "./restaurant-dashboard/chapters/ReceiptsChapter";
import { PayrollChapter } from "./restaurant-dashboard/chapters/PayrollChapter";
import { ExpensesChapter } from "./restaurant-dashboard/chapters/ExpensesChapter";

const EASE = [0.4, 0, 0.2, 1] as const;

function chapterToHighlightId(ch: DashboardChapter): HomeCardId | null {
  switch (ch) {
    case "shift":
      return "shift";
    case "traffic":
      return "sales_traffic";
    case "receipts":
      return "expense_settlement";
    case "payroll":
      return "shift";
    case "expenses":
      return "expense_settlement";
    default:
      return null;
  }
}

function phaseForChapter(
  executedSteps: number,
  chapter: DashboardChapter
): number {
  let p = 0;
  for (let i = 0; i < executedSteps; i++) {
    const s = DEMO_SCENARIO_STEPS[i];
    if (s && s.chapter === chapter) {
      p = Math.max(p, s.chapterPhase);
    }
  }
  return p;
}

type PlaybackPhase = "telop" | "hold";

interface RestaurantOpsDashboardExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function RestaurantOpsDashboardExperience({
  meta,
  className,
}: RestaurantOpsDashboardExperienceProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const steps = DEMO_SCENARIO_STEPS;
  const totalSteps = steps.length;
  const crossSec = reduceMotion ? 0 : DEMO_CROSSFADE_SEC;

  const [introPhase, setIntroPhase] = useState<"title" | "play" | null>("title");
  const [surface, setSurface] = useState<DashboardChapter>("home");
  const [logEntries, setLogEntries] = useState<LogBlock[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [telopText, setTelopText] = useState<string | null>(null);
  const [telopStepKey, setTelopStepKey] = useState<number | null>(null);
  const [demoSpotlight, setDemoSpotlight] = useState<DemoSpotlight>("off");
  const [shiftApproveStage, setShiftApproveStage] =
    useState<ShiftApproveStage>("idle");
  const [trafficBarsRevealed, setTrafficBarsRevealed] = useState(true);
  const [receiptsDemoView, setReceiptsDemoView] = useState<"upload" | "list">(
    "list"
  );
  /** シフト①のシーン内で出す「一括承認」説明テロップ（シナリオ②の telop 文） */
  const [shiftInlineTelop, setShiftInlineTelop] = useState<string | null>(null);

  const playingRef = useRef(playing);
  const shiftInlineTelopTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mobileMainScrollRef = useRef<HTMLDivElement | null>(null);
  const mobileLogScrollRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runStepAtRef = useRef<(k: number) => void>(() => {});
  const playbackRef = useRef<{
    step: number;
    phase: PlaybackPhase;
  } | null>(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (introPhase !== "title") return;
    const id = setTimeout(() => setIntroPhase("play"), DEMO_INTRO_TITLE_MS);
    return () => clearTimeout(id);
  }, [introPhase]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearLoopTimer = useCallback(() => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
  }, []);

  const showNotice = useCallback((msg: string) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(msg);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 2600);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      clearLoopTimer();
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, [clearLoopTimer, clearTimer]);

  const resetDemoVisuals = useCallback(() => {
    setDemoSpotlight("off");
    setShiftApproveStage("idle");
    setShiftInlineTelop(null);
    setTrafficBarsRevealed(true);
    setReceiptsDemoView("list");
  }, []);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      ids.push(setTimeout(fn, ms));
    };

    if (!playing || telopText) {
      setDemoSpotlight("off");
      setShiftApproveStage("idle");
      if (stepIndex !== 2) setTrafficBarsRevealed(true);
      if (stepIndex !== 3) setReceiptsDemoView("list");
      return () => ids.forEach(clearTimeout);
    }

    /** シフト①は専用 effect（②テロップ挿入あり） */
    if (stepIndex === 0 && surface === "shift") {
      return () => ids.forEach(clearTimeout);
    }

    if (stepIndex === 1 && surface === "shift") {
      setDemoSpotlight("off");
      setShiftApproveStage("idle");
      return () => ids.forEach(clearTimeout);
    }

    if (stepIndex === 2 && surface === "traffic") {
      setTrafficBarsRevealed(false);
      setDemoSpotlight("main");
      t(
        () => setTrafficBarsRevealed(true),
        scaleCueMs(CUE_TRAFFIC_MS.barsRevealDelay, reduceMotion)
      );
      t(
        () => setDemoSpotlight("log"),
        scaleCueMs(CUE_TRAFFIC_MS.toLog, reduceMotion)
      );
      return () => ids.forEach(clearTimeout);
    }

    if (stepIndex === 3 && surface === "receipts") {
      setReceiptsDemoView("upload");
      setDemoSpotlight("main");
      t(() => {
        setReceiptsDemoView("list");
        setDemoSpotlight("main");
      }, scaleCueMs(CUE_RECEIPTS_MS.toList, reduceMotion));
      t(
        () => setDemoSpotlight("log"),
        scaleCueMs(CUE_RECEIPTS_MS.toLog, reduceMotion)
      );
      return () => ids.forEach(clearTimeout);
    }

    if (stepIndex === 5 && surface === "expenses") {
      setDemoSpotlight("main");
      t(
        () => setDemoSpotlight("log"),
        scaleCueMs(CUE_EXPENSES_MS.toLog, reduceMotion)
      );
      return () => ids.forEach(clearTimeout);
    }

    setDemoSpotlight("off");
    setShiftApproveStage("idle");
    return () => ids.forEach(clearTimeout);
  }, [playing, telopText, stepIndex, surface, reduceMotion]);

  /** シフト①: ログ → メイン → ②説明テロップ（steps[1].telop）→ 承認演出は次 effect */
  useEffect(() => {
    if (stepIndex !== 0 || surface !== "shift") return;
    if (!playing || telopText) return;

    const ids: ReturnType<typeof setTimeout>[] = [];
    const run = (fn: () => void, ms: number) => {
      ids.push(setTimeout(fn, scaleCueMs(ms, reduceMotion)));
    };

    setDemoSpotlight("main");
    setShiftApproveStage("idle");
    run(() => setDemoSpotlight("log"), CUE_SHIFT_MS.toLog);
    run(() => setDemoSpotlight("main"), CUE_SHIFT_MS.toMainBeforeBulkTelop);
    const bulkText = steps[1]?.telop;
    if (bulkText) {
      run(() => setShiftInlineTelop(bulkText), CUE_SHIFT_MS.toBulkApproveTelop);
    }

    return () => ids.forEach(clearTimeout);
  }, [playing, telopText, stepIndex, surface, reduceMotion, steps]);

  /** ②テロップ終了後に一括承認 → 押下 → 確定 */
  useEffect(() => {
    shiftInlineTelopTimersRef.current.forEach(clearTimeout);
    shiftInlineTelopTimersRef.current = [];
    if (!shiftInlineTelop || !playing) return;

    const step1 = steps[1];
    const telopMs = reduceMotion
      ? Math.min(1200, step1?.telopDurationMs ?? DEFAULT_TELOP_MS)
      : (step1?.telopDurationMs ?? DEFAULT_TELOP_MS);
    const gapMs = reduceMotion ? 0 : CROSSFADE_GAP_MS;
    const add = (id: ReturnType<typeof setTimeout>) => {
      shiftInlineTelopTimersRef.current.push(id);
    };

    const mainId = setTimeout(() => {
      setShiftInlineTelop(null);
      setDemoSpotlight("main");
      setShiftApproveStage("show");
      add(
        setTimeout(
          () => setShiftApproveStage("pressing"),
          scaleCueMs(CUE_SHIFT_MS.afterShowToPressing, reduceMotion)
        )
      );
      add(
        setTimeout(
          () => setShiftApproveStage("done"),
          scaleCueMs(
            CUE_SHIFT_MS.afterShowToPressing + CUE_SHIFT_MS.afterPressingToDone,
            reduceMotion
          )
        )
      );
    }, telopMs + gapMs);
    add(mainId);

    return () => {
      shiftInlineTelopTimersRef.current.forEach(clearTimeout);
      shiftInlineTelopTimersRef.current = [];
    };
  }, [shiftInlineTelop, playing, reduceMotion, steps]);

  const appendStep = useCallback((idx: number) => {
    const step = steps[idx];
    if (!step) return;
    const block: LogBlock = {
      id: `s-${idx}-${Date.now()}`,
      stepIndex: idx,
      lines: step.lines,
    };
    setLogEntries((prev) => [...prev, block]);
    setSurface(step.chapter);
  }, [steps]);

  const scheduleHoldAfterReveal = useCallback(
    (k: number, holdMs: number) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (!playingRef.current) return;
        playbackRef.current = null;
        if (k >= totalSteps - 1) {
          playingRef.current = false;
          setPlaying(false);
          clearLoopTimer();
          loopTimerRef.current = setTimeout(() => {
            setLogEntries([]);
            setStepIndex(-1);
            setSurface("home");
            setTelopText(null);
            setTelopStepKey(null);
            setIntroPhase("title");
            setDemoSpotlight("off");
            setShiftApproveStage("idle");
            setTrafficBarsRevealed(true);
            setReceiptsDemoView("list");
            setShiftInlineTelop(null);
            loopTimerRef.current = null;
          }, LOOP_RESET_HOME_MS);
          return;
        }
        runStepAtRef.current(k + 1);
      }, holdMs);
    },
    [clearLoopTimer, clearTimer, totalSteps]
  );

  const runStepAt = useCallback(
    (k: number) => {
      if (!playingRef.current) return;
      const step = steps[k];
      if (!step) return;

      const holdMs = reduceMotion
        ? Math.min(2800, step.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS)
        : (step.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS);
      const gapMs = reduceMotion ? 0 : CROSSFADE_GAP_MS;

      if (step.skipOpeningTelop) {
        clearTimer();
        playbackRef.current = { step: k, phase: "hold" };
        appendStep(k);
        setStepIndex(k);
        setTelopText(null);
        setTelopStepKey(null);
        timerRef.current = setTimeout(() => {
          if (!playingRef.current) return;
          scheduleHoldAfterReveal(k, holdMs);
        }, gapMs);
        return;
      }

      playbackRef.current = { step: k, phase: "telop" };
      setTelopStepKey(k);
      setTelopText(step.telop);

      const telopMs = reduceMotion
        ? Math.min(1200, step.telopDurationMs ?? DEFAULT_TELOP_MS)
        : (step.telopDurationMs ?? DEFAULT_TELOP_MS);

      clearTimer();
      timerRef.current = setTimeout(() => {
        if (!playingRef.current) return;
        /** 先に次コマのデータを反映してからテロップを閉じる（フェードアウト中に旧画面が見えないようにする） */
        appendStep(k);
        setStepIndex(k);
        playbackRef.current = { step: k, phase: "hold" };
        setTelopText(null);
        setTelopStepKey(null);

        timerRef.current = setTimeout(() => {
          if (!playingRef.current) return;
          scheduleHoldAfterReveal(k, holdMs);
        }, gapMs);
      }, telopMs);
    },
    [appendStep, clearTimer, reduceMotion, scheduleHoldAfterReveal, steps]
  );

  useEffect(() => {
    runStepAtRef.current = runStepAt;
  }, [runStepAt]);

  const beginDemoPlayback = useCallback(() => {
    clearTimer();
    clearLoopTimer();
    resetDemoVisuals();
    setTelopText(null);
    setTelopStepKey(null);
    setPlaying(false);
    playingRef.current = false;
    playbackRef.current = null;
    setLogEntries([]);
    setStepIndex(-1);
    setSurface("home");
    requestAnimationFrame(() => {
      setPlaying(true);
      playingRef.current = true;
      if (totalSteps < 1) {
        setPlaying(false);
        return;
      }
      runStepAt(0);
    });
  }, [clearLoopTimer, clearTimer, resetDemoVisuals, runStepAt, totalSteps]);

  const handleIntroPlay = useCallback(() => {
    setIntroPhase(null);
    requestAnimationFrame(() => beginDemoPlayback());
  }, [beginDemoPlayback]);

  const handlePlayFromStart = useCallback(() => {
    setIntroPhase(null);
    beginDemoPlayback();
  }, [beginDemoPlayback]);

  const handleTogglePause = useCallback(() => {
    if (playing) {
      clearTimer();
      clearLoopTimer();
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    setPlaying(true);
    playingRef.current = true;
    const p = playbackRef.current;
    if (p?.phase === "telop") {
      runStepAt(p.step);
      return;
    }
    if (p?.phase === "hold") {
      const step = steps[p.step];
      const holdMs = reduceMotion
        ? Math.min(2800, step?.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS)
        : (step?.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS);
      scheduleHoldAfterReveal(p.step, holdMs);
      return;
    }
    if (stepIndex < 0) {
      runStepAt(0);
    } else if (stepIndex < totalSteps - 1) {
      runStepAt(stepIndex + 1);
    }
  }, [
    clearLoopTimer,
    clearTimer,
    playing,
    reduceMotion,
    runStepAt,
    scheduleHoldAfterReveal,
    stepIndex,
    steps,
    totalSteps,
  ]);

  const handleNextStep = useCallback(() => {
    clearTimer();
    clearLoopTimer();
    resetDemoVisuals();
    setPlaying(false);
    playingRef.current = false;
    playbackRef.current = null;
    setTelopText(null);
    setTelopStepKey(null);

    const next =
      stepIndex < 0 ? 0 : Math.min(stepIndex + 1, totalSteps - 1);
    if (stepIndex < 0) {
      setLogEntries([]);
      appendStep(0);
      setStepIndex(0);
      return;
    }
    if (stepIndex >= totalSteps - 1) return;

    appendStep(next);
    setStepIndex(next);
  }, [appendStep, clearLoopTimer, clearTimer, resetDemoVisuals, stepIndex, totalSteps]);

  const handleNavigate = useCallback(
    (chapter: DashboardChapter) => {
      clearTimer();
      clearLoopTimer();
      resetDemoVisuals();
      setPlaying(false);
      playingRef.current = false;
      playbackRef.current = null;
      setTelopText(null);
      setTelopStepKey(null);
      setSurface(chapter);
    },
    [clearLoopTimer, clearTimer, resetDemoVisuals]
  );

  const handleCardClick = useCallback(
    (card: HomeCardDef) => {
      if (card.interactive && card.targetChapter) {
        clearTimer();
        clearLoopTimer();
        resetDemoVisuals();
        setPlaying(false);
        playingRef.current = false;
        playbackRef.current = null;
        setTelopText(null);
        setTelopStepKey(null);
        setSurface(card.targetChapter);
        showNotice(
          `${card.title} を開きました。上部の「最初から再生」で一連の流れを見られます。`
        );
        return;
      }
      showNotice("本デモではこのカードはイメージ表示のみです。");
    },
    [clearLoopTimer, clearTimer, resetDemoVisuals, showNotice]
  );

  const executed = stepIndex >= 0 ? stepIndex + 1 : 0;
  const shiftPhase = phaseForChapter(executed, "shift");

  const trafficBarsForUi = stepIndex === 2 ? trafficBarsRevealed : true;
  const receiptsViewForUi = stepIndex === 3 ? receiptsDemoView : "list";

  const chapterView = useMemo(() => {
    if (surface === "home") return null;
    if (surface === "shift") {
      return (
        <ShiftChapter
          phase={shiftPhase}
          emphasizePending={stepIndex === 0 && demoSpotlight === "main"}
          approveStage={
            stepIndex === 0 ? shiftApproveStage : "idle"
          }
          reduceMotion={reduceMotion}
        />
      );
    }
    if (surface === "traffic") {
      return (
        <TrafficChapter
          barsRevealed={trafficBarsForUi}
          reduceMotion={reduceMotion}
        />
      );
    }
    if (surface === "receipts") {
      return (
        <ReceiptsChapter view={receiptsViewForUi} reduceMotion={reduceMotion} />
      );
    }
    if (surface === "payroll") return <PayrollChapter />;
    if (surface === "expenses") return <ExpensesChapter />;
    return null;
  }, [
    surface,
    shiftPhase,
    stepIndex,
    demoSpotlight,
    shiftApproveStage,
    reduceMotion,
    trafficBarsRevealed,
    receiptsDemoView,
  ]);

  const logEmphasis = useMemo(
    () => logEmphasisForDemoStep(demoSpotlight, stepIndex),
    [demoSpotlight, stepIndex]
  );

  const gridHighlightId = useMemo(() => {
    if (surface === "home") {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        const ch = steps[stepIndex]?.chapter;
        return ch ? chapterToHighlightId(ch) : null;
      }
      return null;
    }
    return chapterToHighlightId(surface);
  }, [surface, stepIndex, steps, totalSteps]);

  const mainMotionKey =
    surface === "home"
      ? `home-${stepIndex}`
      : surface === "receipts" && stepIndex === 3
        ? `receipts-${stepIndex}-${receiptsDemoView}`
        : `${surface}-${stepIndex}`;

  const anyTelopOverlay = telopText ?? shiftInlineTelop;

  const demoStarted =
    stepIndex >= 0 || telopText !== null || shiftInlineTelop !== null;
  const canPauseResume =
    demoStarted &&
    !(
      stepIndex >= totalSteps - 1 &&
      !playing &&
      !telopText &&
      !shiftInlineTelop
    );

  const demoSessionActive = playing || stepIndex >= 0;
  const showIntro = introPhase !== null;

  /** シーン切替時は各ペインのスクロールを先頭へ（key 更新直後の ref 取り違え対策で rAF も1回） */
  useLayoutEffect(() => {
    if (!isMobile) return;
    const run = () => {
      const mainEl = mobileMainScrollRef.current;
      const logEl = mobileLogScrollRef.current;
      if (mainEl) mainEl.scrollTop = 0;
      if (logEl) logEl.scrollTop = 0;
    };
    run();
    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [isMobile, mainMotionKey]);

  const replayBar = (
    <ReplayControls
      playing={playing}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      currentChapter={surface}
      telopActive={anyTelopOverlay !== null}
      canPauseResume={canPauseResume}
      onPlayFromStart={handlePlayFromStart}
      onTogglePause={handleTogglePause}
      onNextStep={handleNextStep}
    />
  );

  const eventLogPanel = (
    <SpotlightRing
      active={demoSpotlight === "log"}
      reduceMotion={reduceMotion}
      label="イベントログ"
    >
      <EventLog
        entries={logEntries}
        emphasizeStepNumber={logEmphasis?.stepNumber}
        emphasizePhases={logEmphasis?.phases}
      />
    </SpotlightRing>
  );

  const eventLogPanelDense = (
    <SpotlightRing
      active={demoSpotlight === "log"}
      reduceMotion={reduceMotion}
      label="ログ"
      className="min-h-full min-w-0"
    >
      <EventLog
        dense
        entries={logEntries}
        className="max-h-none min-h-0"
        emphasizeStepNumber={logEmphasis?.stepNumber}
        emphasizePhases={logEmphasis?.phases}
      />
    </SpotlightRing>
  );

  const mainPanel = (
    <SpotlightRing
      active={demoSpotlight === "main"}
      reduceMotion={reduceMotion}
      label="機能"
    >
      {surface === "home" ? (
        <DashboardHomeGrid
          highlightId={gridHighlightId}
          reduceMotion={reduceMotion}
          onCardClick={handleCardClick}
          cards={HOME_CARDS}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          {chapterView}
        </div>
      )}
    </SpotlightRing>
  );

  const desktopBody = (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
      <DemoTelopOverlay text={anyTelopOverlay} reduceMotion={reduceMotion} />
      {/*
        テロップがフェードアウトするのと同じ秒数で、下層はぼかし→ピント（opacity 同期）。
        AnimatePresence の exit と競合させず key 切替でマウントし直す。
      */}
      <motion.div
        key={mainMotionKey}
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4"
        initial={
          reduceMotion ? false : { opacity: 0, filter: "blur(12px)" }
        }
        animate={
          reduceMotion
            ? { opacity: 1, filter: "none" }
            : { opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: reduceMotion ? 0 : crossSec, ease: EASE }}
      >
        <div className="min-w-0 flex-1">{mainPanel}</div>
        <div className="w-full shrink-0 lg:w-80">{eventLogPanel}</div>
      </motion.div>
    </div>
  );

  const mobileModalBody = (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2">
      <div className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
        <p className="text-center text-[10px] font-medium text-slate-600">
          デモ食堂 本店 · 自動再生デモ
        </p>
      </div>
      {replayBar}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/*
          メイン＋ログは常時マウント（上下分割）。テロップは上に重ねてフェードし、
          テロップ中も下層で次ステップに更新するので切替後に旧画面が映り込まない。
        */}
        <motion.div
          key={mainMotionKey}
          className="flex h-full min-h-0 flex-col gap-1.5"
          initial={
            reduceMotion ? false : { opacity: 0, filter: "blur(12px)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1, filter: "none" }
              : { opacity: 1, filter: "blur(0px)" }
          }
          transition={{ duration: reduceMotion ? 0 : crossSec, ease: EASE }}
        >
          <div
            ref={mobileMainScrollRef}
            className="min-h-0 shrink-0 overflow-y-auto overflow-x-hidden overscroll-contain [overflow-anchor:none]"
            style={{ flex: "1.2 1 0%", minHeight: "38%" }}
          >
            <div className="origin-top scale-[0.78] transform-gpu pb-0.5 sm:scale-[0.82]">
              {mainPanel}
            </div>
          </div>
          <div
            ref={mobileLogScrollRef}
            className="flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden overscroll-contain border-t border-slate-200/90 pt-1.5 [overflow-anchor:none]"
            style={{ flex: "1 1 0%", minHeight: "34%" }}
          >
            {eventLogPanelDense}
          </div>
        </motion.div>

        <AnimatePresence>
          {anyTelopOverlay ? (
            <motion.div
              key={
                telopText
                  ? `telop-${telopStepKey ?? 0}`
                  : "shift-inline-bulk-approve"
              }
              className="absolute inset-0 z-30 flex min-h-0 flex-col"
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit={reduceMotion ? undefined : "exit"}
              variants={fadeIn}
              transition={{ duration: crossSec, ease: EASE }}
            >
              <div className="absolute inset-0 bg-slate-950" aria-hidden />
              <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-3 text-white">
                <DemoTelopFullSlide text={anyTelopOverlay} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className={cn("w-full", className)}>
      <p className="sr-only">{meta.shortDescription}</p>

      {!isMobile && (
        <div
          className={cn(
            "w-full transition-opacity duration-300",
            showIntro && "pointer-events-none select-none opacity-[0.2]"
          )}
        >
          <AppShell
            surface={surface}
            onNavigate={handleNavigate}
            notice={notice}
            topBar={replayBar}
          >
            {desktopBody}
          </AppShell>
        </div>
      )}

      {isMobile && demoSessionActive && !showIntro && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950/25 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-label="飲食店オペレーションデモ"
        >
          <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xl">
            {mobileModalBody}
            {notice ? (
              <p
                className="shrink-0 border-t border-slate-200 bg-slate-100 px-3 py-2 text-center text-xs text-slate-700"
                role="status"
              >
                {notice}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {introPhase !== null ? (
        <DemoIntroOverlay
          phase={introPhase}
          reduceMotion={reduceMotion}
          onPlay={handleIntroPlay}
        />
      ) : null}
    </div>
  );
}
