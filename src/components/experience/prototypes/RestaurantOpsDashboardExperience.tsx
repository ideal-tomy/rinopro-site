"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ShiftChapter } from "./restaurant-dashboard/chapters/ShiftChapter";
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

  const playingRef = useRef(playing);
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

      playbackRef.current = { step: k, phase: "telop" };
      setTelopStepKey(k);
      setTelopText(step.telop);

      const telopMs = reduceMotion
        ? Math.min(1200, step.telopDurationMs ?? DEFAULT_TELOP_MS)
        : (step.telopDurationMs ?? DEFAULT_TELOP_MS);
      const holdMs = reduceMotion
        ? Math.min(2800, step.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS)
        : (step.holdAfterRevealMs ?? DEFAULT_HOLD_AFTER_REVEAL_MS);
      const gapMs = reduceMotion ? 0 : CROSSFADE_GAP_MS;

      clearTimer();
      timerRef.current = setTimeout(() => {
        if (!playingRef.current) return;
        setTelopText(null);
        setTelopStepKey(null);
        playbackRef.current = { step: k, phase: "hold" };

        timerRef.current = setTimeout(() => {
          if (!playingRef.current) return;
          appendStep(k);
          setStepIndex(k);
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
  }, [clearLoopTimer, clearTimer, runStepAt, totalSteps]);

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
  }, [appendStep, clearLoopTimer, clearTimer, stepIndex, totalSteps]);

  const handleNavigate = useCallback(
    (chapter: DashboardChapter) => {
      clearTimer();
      clearLoopTimer();
      setPlaying(false);
      playingRef.current = false;
      playbackRef.current = null;
      setTelopText(null);
      setTelopStepKey(null);
      setSurface(chapter);
    },
    [clearLoopTimer, clearTimer]
  );

  const handleCardClick = useCallback(
    (card: HomeCardDef) => {
      if (card.interactive && card.targetChapter) {
        clearTimer();
        clearLoopTimer();
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
    [clearLoopTimer, clearTimer, showNotice]
  );

  const executed = stepIndex >= 0 ? stepIndex + 1 : 0;
  const shiftPhase = phaseForChapter(executed, "shift");

  const chapterView =
    surface === "home" ? null : surface === "shift" ? (
      <ShiftChapter phase={shiftPhase} />
    ) : surface === "traffic" ? (
      <TrafficChapter />
    ) : surface === "receipts" ? (
      <ReceiptsChapter />
    ) : surface === "payroll" ? (
      <PayrollChapter />
    ) : surface === "expenses" ? (
      <ExpensesChapter />
    ) : null;

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
    surface === "home" ? `home-${stepIndex}` : `${surface}-${stepIndex}`;

  const demoStarted = stepIndex >= 0 || telopText !== null;
  const canPauseResume =
    demoStarted &&
    !(stepIndex >= totalSteps - 1 && !playing && !telopText);

  const demoSessionActive = playing || stepIndex >= 0;
  const showIntro = introPhase !== null;

  const replayBar = (
    <ReplayControls
      playing={playing}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      currentChapter={surface}
      telopActive={telopText !== null}
      canPauseResume={canPauseResume}
      onPlayFromStart={handlePlayFromStart}
      onTogglePause={handleTogglePause}
      onNextStep={handleNextStep}
    />
  );

  const mainPanel = (
    <>
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
    </>
  );

  const desktopBody = (
    <div className="relative flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
      <DemoTelopOverlay text={telopText} reduceMotion={reduceMotion} />
      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mainMotionKey}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit={reduceMotion ? undefined : "exit"}
            variants={fadeIn}
            transition={{ duration: crossSec, ease: EASE }}
            className="min-w-0"
          >
            {mainPanel}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full shrink-0 lg:w-80">
        <EventLog entries={logEntries} />
      </div>
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
        <AnimatePresence mode="wait" initial={false}>
          {telopText ? (
            <motion.div
              key={`telop-${telopStepKey ?? 0}`}
              className="absolute inset-0 min-h-0"
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit={reduceMotion ? undefined : "exit"}
              variants={fadeIn}
              transition={{ duration: crossSec, ease: EASE }}
            >
              <DemoTelopFullSlide text={telopText} />
            </motion.div>
          ) : (
            <motion.div
              key={mainMotionKey}
              className="absolute inset-0 flex min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden"
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit={reduceMotion ? undefined : "exit"}
              variants={fadeIn}
              transition={{ duration: crossSec, ease: EASE }}
            >
              {mainPanel}
              <EventLog
                entries={logEntries}
                className="max-h-[32vh] shrink-0 sm:max-h-[min(420px,50vh)]"
              />
            </motion.div>
          )}
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
