"use client";

import {
  MOCK_EXPENSES_SETTLED,
  MOCK_EXPENSES_UNPAID,
} from "@/lib/experience/restaurant-dashboard/mock-data";

export function ExpensesChapter() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">未払い・精算済み</h2>
        <p className="text-xs text-slate-500">
          仕入・経費の支払ステータスを一覧化（デモ）。
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-2 sm:p-3">
          <h3 className="mb-2 text-xs font-semibold text-amber-950">
            ⑤ 未払い
          </h3>
          <ul className="space-y-2 text-xs">
            {MOCK_EXPENSES_UNPAID.map((e) => (
              <li
                key={e.id}
                className="flex justify-between gap-2 border-b border-amber-100/80 pb-2 last:border-0"
              >
                <span className="min-w-0 text-slate-800">{e.title}</span>
                <span className="shrink-0 font-medium text-slate-900">
                  ¥{e.amount.toLocaleString("ja-JP")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-amber-900">期日: 上記参照</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2 sm:p-3">
          <h3 className="mb-2 text-xs font-semibold text-emerald-950">
            精算済み
          </h3>
          <ul className="space-y-2 text-xs">
            {MOCK_EXPENSES_SETTLED.map((e) => (
              <li
                key={e.id}
                className="flex justify-between gap-2 border-b border-emerald-100/80 pb-2 last:border-0"
              >
                <span className="min-w-0 text-slate-800">{e.title}</span>
                <span className="shrink-0 font-medium text-slate-900">
                  ¥{e.amount.toLocaleString("ja-JP")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-emerald-900">
            支払日は明細に記載（モック）
          </p>
        </div>
      </div>
    </div>
  );
}
