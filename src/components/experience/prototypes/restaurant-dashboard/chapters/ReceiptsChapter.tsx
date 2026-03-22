"use client";

import { FileImage } from "lucide-react";
import { MOCK_RECEIPTS } from "@/lib/experience/restaurant-dashboard/mock-data";

export function ReceiptsChapter() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">経費・レシート</h2>
        <p className="text-xs text-slate-500">
          画像からの抽出と科目・申告用タグのドラフト（デモ・本番は要税理士確認）。
        </p>
      </div>
      <ul className="space-y-2">
        {MOCK_RECEIPTS.map((r) => (
          <li
            key={r.id}
            className="flex gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs sm:gap-3 sm:p-3"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <FileImage className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">{r.vendor}</p>
              <p className="text-slate-600">
                {r.date} · ¥{r.amount.toLocaleString("ja-JP")}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
                  {r.taxCategory}
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-900">
                  {r.filingTag}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
