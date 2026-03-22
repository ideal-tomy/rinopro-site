"use client";

import { MAX_TRAFFIC, WEEKDAY_TRAFFIC } from "@/lib/experience/restaurant-dashboard/mock-data";

export function TrafficChapter() {
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
            const h = Math.round((count / MAX_TRAFFIC) * 100);
            return (
              <div
                key={day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-full max-w-[2rem] rounded-t bg-emerald-500/90 sm:max-w-[2.5rem]"
                    style={{ height: `${Math.max(h, 8)}%` }}
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
