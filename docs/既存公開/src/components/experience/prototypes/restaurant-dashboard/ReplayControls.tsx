"use client";

import { Pause, Play, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHAPTER_LABELS } from "@/lib/experience/restaurant-dashboard/scenario";
import type { DashboardChapter } from "@/lib/experience/restaurant-dashboard/types";

interface ReplayControlsProps {
  playing: boolean;
  stepIndex: number;
  totalSteps: number;
  currentChapter: DashboardChapter;
  /** テロップ表示中（進行状況ラベル用） */
  telopActive?: boolean;
  /** 一時停止・再開を有効にする（最終シーン完了後の待機中は false） */
  canPauseResume?: boolean;
  onPlayFromStart: () => void;
  onTogglePause: () => void;
  onNextStep: () => void;
}

export function ReplayControls({
  playing,
  stepIndex,
  totalSteps,
  currentChapter,
  telopActive = false,
  canPauseResume = true,
  onPlayFromStart,
  onTogglePause,
  onNextStep,
}: ReplayControlsProps) {
  const started = stepIndex >= 0 || telopActive;
  const progress =
    totalSteps > 0
      ? started
        ? Math.min(
            100,
            Math.round(
              ((telopActive ? stepIndex + 2 : stepIndex + 1) / totalSteps) *
                100
            )
          )
        : 0
      : 0;

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-slate-200 bg-white px-2 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onPlayFromStart}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          最初から再生
        </button>
        <button
          type="button"
          onClick={onTogglePause}
          disabled={!canPauseResume}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50",
            "disabled:pointer-events-none disabled:opacity-40"
          )}
        >
          {playing ? (
            <>
              <Pause className="size-3.5" aria-hidden />
              一時停止
            </>
          ) : (
            <>
              <Play className="size-3.5" aria-hidden />
              再開
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onNextStep}
          disabled={stepIndex >= totalSteps - 1}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50",
            "disabled:pointer-events-none disabled:opacity-40"
          )}
        >
          <SkipForward className="size-3.5" aria-hidden />
          次のステップ
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-xs sm:items-end">
        <p className="truncate text-[10px] text-slate-500 sm:text-right sm:text-xs">
          {telopActive
            ? `次のシーンの説明を表示中… · ${Math.min(stepIndex + 2, totalSteps)}/${totalSteps}`
            : started
              ? `${CHAPTER_LABELS[currentChapter] ?? currentChapter} · ${stepIndex + 1}/${totalSteps}`
              : "未開始"}
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 sm:max-w-[200px]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
