"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SHIFTS_PENDING } from "@/lib/experience/restaurant-dashboard/mock-data";

interface ShiftChapterProps {
  phase: number;
}

export function ShiftChapter({ phase }: ShiftChapterProps) {
  const approved = phase >= 1;

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
              "rounded-lg border p-2 text-xs",
              approved
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/40"
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
                approved
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-amber-100 text-amber-900"
              )}
            >
              {approved ? (
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
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-center">
        {approved ? (
          <p className="text-xs text-emerald-800">
            ① 一括承認済み · スタッフへ確定通知を送信中（モック）
          </p>
        ) : (
          <p className="text-xs text-slate-600">
            店長の承認待ち · 下のコントロールでデモを進めてください
          </p>
        )}
      </div>
    </div>
  );
}
