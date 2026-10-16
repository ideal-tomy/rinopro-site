"use client";

import { MOCK_EXPENSE_LINE_ITEMS } from "@/lib/experience/restaurant-dashboard/mock-data";
import { cn } from "@/lib/utils";

export function ExpensesChapter() {
  const unpaidTotal = MOCK_EXPENSE_LINE_ITEMS.filter(
    (x) => x.status === "unpaid"
  ).reduce((s, x) => s + x.amount, 0);
  const settledTotal = MOCK_EXPENSE_LINE_ITEMS.filter(
    (x) => x.status === "settled"
  ).reduce((s, x) => s + x.amount, 0);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">未払い・精算済み</h2>
        <p className="text-xs text-slate-500">
          誰が提出した経費かを明細で追い、未払いと精算済みを同じ一覧で確認（デモ）。
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2">
          <p className="text-[10px] font-medium text-amber-900">未払い 合計</p>
          <p className="text-lg font-semibold text-amber-950">
            ¥{unpaidTotal.toLocaleString("ja-JP")}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2">
          <p className="text-[10px] font-medium text-emerald-900">精算済み 合計</p>
          <p className="text-lg font-semibold text-emerald-950">
            ¥{settledTotal.toLocaleString("ja-JP")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <p className="border-b border-slate-100 px-3 py-2 text-[10px] font-semibold text-slate-700">
          提出者別・明細
        </p>
        <ul className="max-h-[min(280px,40vh)] divide-y divide-slate-100 overflow-y-auto text-xs">
          {MOCK_EXPENSE_LINE_ITEMS.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-2 px-3 py-2 sm:flex-nowrap"
            >
              <span className="min-w-0 flex-1 font-medium text-slate-900">
                {row.submitter}
              </span>
              <span className="min-w-0 flex-[2] text-slate-600">{row.title}</span>
              <span className="shrink-0 font-medium text-slate-900">
                ¥{row.amount.toLocaleString("ja-JP")}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  row.status === "unpaid"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-emerald-100 text-emerald-900"
                )}
              >
                {row.status === "unpaid" ? "未払い" : "精算済み"}
              </span>
              <span className="w-full text-[10px] text-slate-400 sm:w-auto sm:flex-1 sm:text-right">
                {row.meta}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
