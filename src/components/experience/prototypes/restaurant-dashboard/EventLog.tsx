"use client";

import { cn } from "@/lib/utils";
import { LOG_PHASE_LABELS } from "@/lib/experience/restaurant-dashboard/scenario";
import type { LogPhase, ScenarioLogLine } from "@/lib/experience/restaurant-dashboard/types";

export interface LogBlock {
  id: string;
  stepIndex: number;
  lines: ScenarioLogLine[];
}

interface EventLogProps {
  entries: LogBlock[];
  className?: string;
  /** スマホ等の狭いペイン向けにタイポを一段詰める */
  dense?: boolean;
  /** 1始まりのステップ番号（表示ラベルと一致） */
  emphasizeStepNumber?: number | null;
  /** 強調する行の phase */
  emphasizePhases?: LogPhase[] | null;
}

export function EventLog({
  entries,
  className,
  dense = false,
  emphasizeStepNumber,
  emphasizePhases,
}: EventLogProps) {
  return (
    <div
      className={cn(
        "flex max-h-[min(420px,50vh)] flex-col rounded-lg border border-slate-200 bg-white shadow-sm",
        dense && "max-h-none",
        className
      )}
    >
      <div
        className={cn(
          "border-b border-slate-100 px-3 py-2",
          dense && "px-2 py-1.5"
        )}
      >
        <h3
          className={cn(
            "font-semibold text-slate-800",
            dense ? "text-[10px]" : "text-xs"
          )}
        >
          イベントログ
        </h3>
        <p
          className={cn(
            "text-slate-500",
            dense ? "text-[9px] leading-tight" : "text-[10px]"
          )}
        >
          トリガー → 処理 → 通知 → 状態更新（デモ）
        </p>
      </div>
      <ul
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          dense ? "space-y-2 p-1.5" : "space-y-3 p-2 sm:p-3"
        )}
      >
        {entries.length === 0 ? (
          <li
            className={cn("text-slate-400", dense ? "text-[10px]" : "text-xs")}
          >
            「デモを再生」で自動化の流れがログに積まれます。
          </li>
        ) : (
          entries.map((block) => (
            <li
              key={block.id}
              className={cn(
                "rounded-md border border-slate-100 bg-slate-50/80",
                dense ? "p-1.5 text-[10px]" : "p-2 text-xs"
              )}
            >
              <p
                className={cn(
                  "mb-1 font-medium text-slate-400",
                  dense ? "text-[9px]" : "mb-1.5 text-[10px]"
                )}
              >
                ステップ {block.stepIndex + 1}
              </p>
              <dl className={cn("space-y-0.5", dense && "space-y-0.5")}>
                {block.lines.map((line, i) => {
                  const emphasizeBlock =
                    emphasizeStepNumber != null &&
                    emphasizePhases != null &&
                    emphasizePhases.length > 0 &&
                    block.stepIndex + 1 === emphasizeStepNumber &&
                    emphasizePhases.includes(line.phase);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "grid gap-0.5 rounded-md sm:grid-cols-[5rem_1fr]",
                        emphasizeBlock &&
                          "bg-amber-50 ring-1 ring-amber-300/80 ring-offset-1"
                      )}
                    >
                      <dt
                        className={cn(
                          "font-medium text-emerald-800",
                          dense ? "text-[9px]" : "text-[10px]"
                        )}
                      >
                        {LOG_PHASE_LABELS[line.phase] ?? line.phase}
                      </dt>
                      <dd
                        className={cn(
                          "leading-snug text-slate-700",
                          dense ? "text-[10px] leading-snug" : "text-[11px]"
                        )}
                      >
                        {line.text}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
