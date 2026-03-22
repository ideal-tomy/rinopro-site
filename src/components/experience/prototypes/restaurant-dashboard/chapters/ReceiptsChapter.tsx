"use client";

import { ImageUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEMO_CROSSFADE_SEC } from "@/lib/experience/restaurant-dashboard/timing";
import { MOCK_RECEIPTS } from "@/lib/experience/restaurant-dashboard/mock-data";

interface ReceiptsChapterProps {
  /** アップロード演出 → 解析済みカード */
  view: "upload" | "list";
  reduceMotion: boolean;
}

function ReceiptThumb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-12 shrink-0 flex-col justify-end rounded-md border border-slate-200 bg-gradient-to-b from-white to-slate-100 p-1 shadow-inner",
        className
      )}
      role="img"
      aria-label="レシート画像（イメージ）"
    >
      <div className="h-1 w-full rounded-sm bg-slate-300/80" />
      <div className="mt-0.5 h-1 w-4/5 rounded-sm bg-slate-200" />
      <div className="mt-0.5 h-1 w-3/5 rounded-sm bg-emerald-200/80" />
    </div>
  );
}

export function ReceiptsChapter({ view, reduceMotion }: ReceiptsChapterProps) {
  if (view === "upload") {
    return (
      <motion.div
        className="space-y-3"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : DEMO_CROSSFADE_SEC }}
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-900">経費・レシート</h2>
          <p className="text-xs text-slate-500">
            レシート画像をアップロード中…（デモ演出）
          </p>
        </div>
        <div className="flex min-h-[11rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 p-6">
          <motion.div
            className="mb-3 flex size-16 items-center justify-center rounded-full bg-white shadow-md"
            animate={
              reduceMotion
                ? {}
                : { y: [0, -6, 0], scale: [1, 1.04, 1] }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ImageUp className="size-8 text-emerald-600" aria-hidden />
          </motion.div>
          <p className="text-center text-xs font-medium text-slate-700">
            スマホからレシートを送信中
          </p>
          <div className="mt-4 flex gap-2 opacity-80">
            <ReceiptThumb />
            <ReceiptThumb className="opacity-60" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : DEMO_CROSSFADE_SEC }}
    >
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
            <ReceiptThumb className="size-12 shrink-0" />
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
    </motion.div>
  );
}
