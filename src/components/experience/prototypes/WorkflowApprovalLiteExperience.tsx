"use client";

import { useMemo, useState } from "react";
import { Bell, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

interface RequestRow {
  id: string;
  title: string;
  status: Status;
  summaryLines: [string, string, string];
  /** 赤字で強調するリスク行（任意） */
  riskLine?: string;
}

const INITIAL: RequestRow[] = [
  {
    id: "1",
    title: "見積ドラフト v2（〇〇商事）",
    status: "pending",
    summaryLines: [
      "金額は税別約480万。納期希望は4月末。",
      "カスタム機能ブロック2件。法務レビュー待ち。",
      "申請: 営業二部 佐藤 / 上長承認済み",
    ],
    riskLine: "リスク: 予算を15%超過しています（昨年度同種案件比）",
  },
  {
    id: "2",
    title: "広告出稿申請（3月キャンペーン）",
    status: "pending",
    summaryLines: [
      "媒体3社、予算上限200万まで。",
      "クリエイティブは最終稿を添付済み。",
      "法務チェック: 表記クレームなし",
    ],
  },
  {
    id: "3",
    title: "勤怠例外（シフト振替）",
    status: "pending",
    summaryLines: [
      "理由: 家庭事情。振替先は翌週水曜。",
      "現場責任者の承認コメントあり。",
      "給与締め: 今期に間に合う見込み",
    ],
  },
];

interface WorkflowApprovalLiteExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function WorkflowApprovalLiteExperience({
  meta: _meta,
  className,
}: WorkflowApprovalLiteExperienceProps) {
  const [rows, setRows] = useState<RequestRow[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string>("1");

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? rows[0],
    [rows, selectedId]
  );

  const setStatus = (id: string, status: Exclude<Status, "pending">) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const pendingRows = rows.filter((r) => r.status === "pending");

  return (
    <div className={cn("space-y-6", className)}>
      <p className="text-sm text-text-sub md:text-[1rem]">
        スマホのプッシュ通知のように、要約だけで承認判断する体験です。一覧から件名を選ぶと、右（下）の端末プレビューが切り替わります。
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text md:text-[1rem]">
            承認キュー
          </h2>
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    selectedId === r.id
                      ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30"
                      : "border-silver/25 bg-base-dark/80 hover:border-silver/40",
                    r.status !== "pending" && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-text md:text-[1rem]">
                      {r.title}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs",
                        r.status === "pending" && "bg-silver/15 text-text-sub",
                        r.status === "approved" && "bg-accent/15 text-accent",
                        r.status === "rejected" &&
                          "bg-destructive/15 text-destructive"
                      )}
                    >
                      {r.status === "pending" && "承認待ち"}
                      {r.status === "approved" && "承認済"}
                      {r.status === "rejected" && "差戻し"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2 text-xs text-text-sub">
            <Smartphone className="h-4 w-4 text-accent" aria-hidden />
            <span>通知プレビュー</span>
          </div>
          <div
            className="relative w-full max-w-[300px] rounded-[2rem] border-[10px] border-slate-700 bg-slate-900 shadow-2xl"
            aria-label="スマホ通知のモック"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="h-1.5 w-16 rounded-full bg-slate-600" aria-hidden />
            </div>
            <div className="space-y-3 px-3 pb-6 pt-2">
              <div className="text-center text-[10px] font-medium text-slate-500">
                9:41
              </div>

              {selected.status === "pending" ? (
                <div className="rounded-2xl border border-slate-600/80 bg-slate-800/95 p-3 shadow-lg">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
                      <Bell className="h-4 w-4 text-accent" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">
                        承認リクエスト
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {selected.title}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 rounded-lg bg-slate-900/80 p-2.5">
                    <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      3行要約
                    </p>
                    <ul className="space-y-1.5 text-[12px] leading-snug text-slate-200">
                      {selected.summaryLines.map((line, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-accent" aria-hidden>
                            ·
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selected.riskLine ? (
                    <p className="mb-3 rounded-md border border-red-500/40 bg-red-950/50 px-2 py-1.5 text-[11px] font-semibold leading-snug text-red-200">
                      {selected.riskLine}
                    </p>
                  ) : null}
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      type="button"
                      className="h-11 w-full text-[15px] font-semibold"
                      onClick={() => setStatus(selected.id, "approved")}
                    >
                      承認
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full border-slate-500 text-[15px] font-semibold text-slate-100 hover:bg-slate-700/50"
                      onClick={() => setStatus(selected.id, "rejected")}
                    >
                      差し戻し
                    </Button>
                    <button
                      type="button"
                      className="rounded-lg py-2 text-center text-[13px] font-medium text-accent underline-offset-2 hover:underline"
                    >
                      詳細を確認（モック）
                    </button>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/50 p-6 text-center text-sm text-slate-500">
                  この申請は処理済みです。他の承認待ちを選んでください。
                  {pendingRows.length === 0 && (
                    <span className="mt-2 block text-xs">
                      すべて完了しました（リロードでリセット）。
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
