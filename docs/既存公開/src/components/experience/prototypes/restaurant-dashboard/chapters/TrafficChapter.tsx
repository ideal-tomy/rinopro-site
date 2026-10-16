"use client";

import { motion } from "framer-motion";
import { DEMO_CROSSFADE_SEC } from "@/lib/experience/restaurant-dashboard/timing";
import { MAX_TRAFFIC, WEEKDAY_TRAFFIC } from "@/lib/experience/restaurant-dashboard/mock-data";

const CHART_INNER_PX = 120;

interface TrafficChapterProps {
  barsRevealed: boolean;
  reduceMotion: boolean;
}

export function TrafficChapter({ barsRevealed, reduceMotion }: TrafficChapterProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">売上・入客分析</h2>
        <p className="text-xs text-slate-500">
          POS連携想定の来店件数を曜日別に表示（デモデータ）。
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-[10px] font-medium text-slate-500">
          ② 前週 来店件数（件）
        </p>
        <div className="flex h-36 items-end justify-between gap-1 sm:gap-2">
          {WEEKDAY_TRAFFIC.map(({ day, count }) => {
            const pct = Math.round((count / MAX_TRAFFIC) * 100);
            const targetPx = Math.round((Math.max(pct, 8) / 100) * CHART_INNER_PX);
            const startPx = 6;
            return (
              <div
                key={day}
                className="flex h-36 flex-1 flex-col items-center justify-end gap-1"
              >
                <div className="flex w-full flex-1 flex-col items-center justify-end">
                  <motion.div
                    className="w-full max-w-[2rem] origin-bottom rounded-t bg-emerald-500/90 sm:max-w-[2.5rem]"
                    initial={false}
                    animate={{
                      height:
                        barsRevealed || reduceMotion ? targetPx : startPx,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : DEMO_CROSSFADE_SEC * 1.85,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    title={`${count}件`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-600">
                  {day}
                </span>
                <span className="text-[9px] text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-600">
        金・土・日にピーク。シフト配分の参考になります。
      </p>
    </div>
  );
}
