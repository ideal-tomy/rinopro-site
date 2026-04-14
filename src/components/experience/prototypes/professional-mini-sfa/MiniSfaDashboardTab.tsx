"use client";

import { ChevronDown } from "lucide-react";
import { DEAL_STAGE_LABEL } from "@/lib/experience/professional-mini-sfa/constants";
import type {
  DealCard,
  MiniSfaDashboardStats,
} from "@/lib/experience/professional-mini-sfa/types";
import { cn } from "@/lib/utils";

interface MiniSfaDashboardTabProps {
  todayLabel: string;
  stats: MiniSfaDashboardStats;
  mobileWeekFollowOpen: boolean;
  setMobileWeekFollowOpen: (open: boolean) => void;
  onOpenDeal: (dealId: string) => void;
}

function DealList({
  deals,
  emptyLabel,
  onOpenDeal,
  accent = "default",
}: {
  deals: DealCard[];
  emptyLabel: string;
  onOpenDeal: (dealId: string) => void;
  accent?: "default" | "warning";
}) {
  if (deals.length === 0) {
    return <p className="text-xs text-text-sub md:text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-1.5 md:space-y-2">
      {deals.map((deal) => (
        <li key={deal.id}>
          <button
            type="button"
            onClick={() => onOpenDeal(deal.id)}
            className={cn(
              "w-full rounded-lg border px-2.5 py-1.5 text-left text-xs transition md:px-3 md:py-2 md:text-[15px]",
              accent === "warning"
                ? "border-amber-500/25 bg-base/60 hover:border-amber-400/50"
                : "border-silver/20 bg-base/60 hover:border-accent/40"
            )}
          >
            <span className="font-medium text-white/95">{deal.title}</span>
            <span className="mt-0.5 block text-xs text-text-sub">
              {deal.clientName} ・ 次 {deal.nextActionDate} ・ {DEAL_STAGE_LABEL[deal.stage]}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function MiniSfaDashboardTab({
  todayLabel,
  stats,
  mobileWeekFollowOpen,
  setMobileWeekFollowOpen,
  onOpenDeal,
}: MiniSfaDashboardTabProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xs font-semibold text-white md:text-[16px]">
          ダッシュボード
        </h2>
        <p className="mt-1 text-[11px] text-text-sub md:text-sm">
          デモ上の「今日」は {todayLabel}
          。案件を更新すると、ここに件数と対象一覧が反映されます。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
        <div className="rounded-xl border border-silver/25 bg-base-dark/70 p-2.5 md:p-4">
          <p className="text-[10px] text-text-sub md:text-xs">アクティブ相談</p>
          <p className="mt-0.5 text-xl font-semibold text-white tabular-nums md:mt-1 md:text-2xl">
            {stats.activeCount}
          </p>
          <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">
            受任・見送り除く
          </p>
        </div>
        <div className="rounded-xl border border-silver/25 bg-base-dark/70 p-2.5 md:p-4">
          <p className="text-[10px] text-text-sub md:text-xs">今週のフォロー</p>
          <p className="mt-0.5 text-xl font-semibold text-accent tabular-nums md:mt-1 md:text-2xl">
            {stats.dueThisWeekCount}
          </p>
          <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">
            7日以内・未クローズ
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-2.5 md:p-4">
          <p className="text-[10px] text-amber-200/80 md:text-xs">期限超過</p>
          <p className="mt-0.5 text-xl font-semibold text-amber-200 tabular-nums md:mt-1 md:text-2xl">
            {stats.overdueCount}
          </p>
          <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">
            見送り除く
          </p>
        </div>
        <div className="rounded-xl border border-accent/25 bg-accent/5 p-2.5 md:p-4">
          <p className="text-[10px] text-accent/90 md:text-xs">受任見込</p>
          <p className="mt-0.5 text-xl font-semibold text-accent tabular-nums md:mt-1 md:text-2xl">
            {stats.retainerLikelyCount}
          </p>
          <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">
            最終確認中
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-2.5 md:p-4">
          <p className="text-[10px] text-emerald-300/90 md:text-xs">受任済み</p>
          <p className="mt-0.5 text-xl font-semibold text-emerald-300 tabular-nums md:mt-1 md:text-2xl">
            {stats.retainedCount}
          </p>
          <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">
            別集計
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-silver/20 bg-base-dark/50">
          <div className="md:hidden">
            <button
              type="button"
              id="mini-sfa-week-follow-trigger"
              aria-expanded={mobileWeekFollowOpen}
              aria-controls="mini-sfa-week-follow-panel"
              onClick={() => setMobileWeekFollowOpen(!mobileWeekFollowOpen)}
              className="flex w-full items-center gap-3 border-b border-silver/25 bg-accent/10 px-3 py-3.5 text-left transition hover:bg-accent/15 active:bg-accent/20"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  今週のフォロー一覧
                </span>
                <span className="mt-1 block text-[11px] font-medium text-accent">
                  タップして開く
                </span>
                <span className="mt-0.5 block text-[10px] text-text-sub">
                  {stats.weekRows.length} 件
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-accent transition-transform duration-200",
                  mobileWeekFollowOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            <div
              id="mini-sfa-week-follow-panel"
              role="region"
              aria-labelledby="mini-sfa-week-follow-trigger"
              className={cn(
                "border-b border-silver/20 px-2 pb-2 pt-2",
                !mobileWeekFollowOpen && "hidden"
              )}
            >
              <DealList
                deals={stats.weekRows}
                emptyLabel="今週フォロー対象はありません"
                onOpenDeal={onOpenDeal}
              />
            </div>
          </div>

          <div className="hidden md:block md:p-4">
            <h3 className="text-xs font-semibold text-text md:text-[16px]">
              今週のフォロー一覧
            </h3>
            <div className="mt-2 md:mt-3">
              <DealList
                deals={stats.weekRows}
                emptyLabel="今週フォロー対象はありません"
                onOpenDeal={onOpenDeal}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-base-dark/50 p-3 md:p-4">
          <h3 className="text-xs font-semibold text-amber-100/90 md:text-[16px]">
            期限超過（見送り除く）
          </h3>
          <div className="mt-2 md:mt-3">
            <DealList
              deals={stats.overdueRows}
              emptyLabel="期限超過はありません"
              onOpenDeal={onOpenDeal}
              accent="warning"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
