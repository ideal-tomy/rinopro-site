"use client";

import { cn } from "@/lib/utils";
import { LOG_PHASE_LABELS } from "@/lib/experience/restaurant-dashboard/scenario";
import type { ScenarioLogLine } from "@/lib/experience/restaurant-dashboard/types";

export interface LogBlock {
  id: string;
  stepIndex: number;
  lines: ScenarioLogLine[];
}

interface EventLogProps {
  entries: LogBlock[];
  className?: string;
}

export function EventLog({ entries, className }: EventLogProps) {
  return (
    <div
      className={cn(
        "flex max-h-[min(420px,50vh)] flex-col rounded-lg border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="border-b border-slate-100 px-3 py-2">
        <h3 className="text-xs font-semibold text-slate-800">イベントログ</h3>
        <p className="text-[10px] text-slate-500">
          トリガー → 処理 → 通知 → 状態更新（デモ）
        </p>
      </div>
      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto p-2 sm:p-3">
        {entries.length === 0 ? (
          <li className="text-xs text-slate-400">
            「デモを再生」で自動化の流れがログに積まれます。
          </li>
        ) : (
          entries.map((block) => (
            <li
              key={block.id}
              className="rounded-md border border-slate-100 bg-slate-50/80 p-2 text-xs"
            >
              <p className="mb-1.5 text-[10px] font-medium text-slate-400">
                ステップ {block.stepIndex + 1}
              </p>
              <dl className="space-y-1">
                {block.lines.map((line, i) => (
                  <div key={i} className="grid gap-0.5 sm:grid-cols-[5rem_1fr]">
                    <dt className="text-[10px] font-medium text-emerald-800">
                      {LOG_PHASE_LABELS[line.phase] ?? line.phase}
                    </dt>
                    <dd className="text-[11px] leading-snug text-slate-700">
                      {line.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
