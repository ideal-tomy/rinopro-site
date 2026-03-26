"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEMO_CROSSFADE_SEC } from "@/lib/experience/restaurant-dashboard/timing";
import { MOCK_SHIFTS_PENDING } from "@/lib/experience/restaurant-dashboard/mock-data";

export type ShiftApproveStage = "idle" | "show" | "pressing" | "done";

interface ShiftChapterProps {
  phase: number;
  /** 承認待ちバッジを強調 */
  emphasizePending: boolean;
  /** 一括承認ボタンの演出段階 */
  approveStage: ShiftApproveStage;
  reduceMotion: boolean;
}

export function ShiftChapter({
  phase,
  emphasizePending,
  approveStage,
  reduceMotion,
}: ShiftChapterProps) {
  const chapterApproved = phase >= 1;
  /** ステップ①内の演出で、承認直後にカードを確定表示へ */
  const cardsShowApproved = chapterApproved || approveStage === "done";
  const showApproveUi = !chapterApproved && approveStage !== "idle";

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">シフト管理</h2>
        <p className="text-xs text-slate-500">
          提出された希望から候補を生成し、承認で確定します（デモ）。
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {MOCK_SHIFTS_PENDING.map((row, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-2 text-xs transition-shadow duration-300",
              cardsShowApproved
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/40",
              emphasizePending &&
                !cardsShowApproved &&
                !reduceMotion &&
                "ring-2 ring-amber-400 ring-offset-1 ring-offset-white"
            )}
          >
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-slate-600">{row.role}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="size-3" aria-hidden />
              {row.date} {row.slot}
            </p>
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                cardsShowApproved
                  ? "bg-emerald-100 text-emerald-950"
                  : "bg-amber-100 text-amber-950",
                emphasizePending &&
                  !cardsShowApproved &&
                  !reduceMotion &&
                  "animate-pulse shadow-sm"
              )}
            >
              {cardsShowApproved ? (
                <>
                  <CheckCircle2 className="size-3" aria-hidden />
                  確定
                </>
              ) : (
                "承認待ち"
              )}
            </p>
          </div>
        ))}
      </div>

      {showApproveUi ? (
        <motion.div
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/50 p-4"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : DEMO_CROSSFADE_SEC }}
        >
          <p className="text-center text-[11px] font-medium text-emerald-900">
            店長による一括承認（デモ演出）
          </p>
          <motion.button
            type="button"
            disabled
            aria-hidden
            className={cn(
              "rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-md",
              "pointer-events-none"
            )}
            animate={
              reduceMotion
                ? {}
                : approveStage === "pressing"
                  ? { scale: 0.94 }
                  : approveStage === "done"
                    ? { scale: [0.94, 1.05, 1] }
                    : { scale: 1 }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            一括承認
          </motion.button>
          {approveStage === "done" || approveStage === "pressing" ? (
            <p className="text-center text-[10px] text-emerald-800">
              {approveStage === "done"
                ? "承認を記録しました"
                : "承認中…"}
            </p>
          ) : null}
        </motion.div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-center">
          {chapterApproved ? (
            <p className="text-xs text-emerald-800">
              ① 一括承認済み · スタッフへ確定通知を送信中
            </p>
          ) : (
            <p className="text-xs text-slate-600">
              店長の承認待ち · デモ再生で承認演出が入ります
            </p>
          )}
        </div>
      )}
    </div>
  );
}
