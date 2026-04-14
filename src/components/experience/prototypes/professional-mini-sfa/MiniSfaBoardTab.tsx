"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  DEAL_STAGE_LABEL,
  DEAL_STAGE_ORDER,
} from "@/lib/experience/professional-mini-sfa/constants";
import type { DealCard, DealStageId } from "@/lib/experience/professional-mini-sfa/types";
import { cn } from "@/lib/utils";

interface MiniSfaBoardTabProps {
  deals: DealCard[];
  selectedDealId: string | null;
  selectedDeal: DealCard | null;
  onSelectDeal: (dealId: string) => void;
  mobileBoardStage: DealStageId;
  setMobileBoardStage: (stage: DealStageId) => void;
  mobileDealDetailOpen: boolean;
  setMobileDealDetailOpen: (open: boolean) => void;
  detail: ReactNode;
}

export function MiniSfaBoardTab({
  deals,
  selectedDealId,
  selectedDeal,
  onSelectDeal,
  mobileBoardStage,
  setMobileBoardStage,
  mobileDealDetailOpen,
  setMobileDealDetailOpen,
  detail,
}: MiniSfaBoardTabProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="md:hidden">
        <p className="mb-2 text-[11px] text-text-sub">
          ステージを切り替えて、相談カードと詳細を確認できます。
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DEAL_STAGE_ORDER.map((stage) => {
            const columnDeals = deals.filter((deal) => deal.stage === stage);
            const active = mobileBoardStage === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setMobileBoardStage(stage)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  active
                    ? "border-accent/45 bg-accent/15 font-semibold text-accent"
                    : "border-silver/30 text-text-sub hover:border-silver/50"
                )}
              >
                {DEAL_STAGE_LABEL[stage]}（{columnDeals.length}）
              </button>
            );
          })}
        </div>
        <ul className="mt-2 max-h-[min(240px,36vh)] space-y-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          {deals
            .filter((deal) => deal.stage === mobileBoardStage)
            .map((deal) => (
              <li key={deal.id}>
                <button
                  type="button"
                  onClick={() => onSelectDeal(deal.id)}
                  className={cn(
                    "w-full rounded-lg border px-2 py-1.5 text-left transition",
                    selectedDealId === deal.id
                      ? "border-accent/50 bg-accent/15 font-medium text-white/95"
                      : "border-silver/25 bg-base/80 hover:border-silver/45"
                  )}
                >
                  <span className="line-clamp-1 text-xs font-medium text-white/95">
                    {deal.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-[10px] text-text-sub">
                    {deal.clientName} ・ 次 {deal.nextActionDate}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div
        className={cn(
          "hidden gap-2 pb-2 md:flex md:overflow-x-auto md:overscroll-x-contain md:[scrollbar-width:thin]",
          "xl:grid xl:grid-cols-7 xl:gap-3 xl:overflow-visible xl:pb-0"
        )}
      >
        {DEAL_STAGE_ORDER.map((stage) => {
          const columnDeals = deals.filter((deal) => deal.stage === stage);
          return (
            <div
              key={stage}
              className={cn(
                "flex min-h-0 w-60 shrink-0 flex-col rounded-xl border border-silver/25 bg-base-dark/60",
                "xl:w-auto xl:min-w-0 xl:max-w-none xl:shrink"
              )}
            >
              <div className="shrink-0 border-b border-silver/20 px-2.5 py-1.5 md:px-3 md:py-2">
                <p className="text-xs font-semibold text-accent md:text-sm">
                  {DEAL_STAGE_LABEL[stage]}
                </p>
                <p className="text-[10px] text-text-sub md:text-[11px]">
                  {columnDeals.length} 件
                </p>
              </div>
              <ul className="flex min-h-0 max-h-[min(380px,50vh)] flex-col gap-1.5 overflow-y-auto overscroll-y-contain p-1.5 md:gap-2 md:p-2 xl:max-h-[min(440px,52vh)]">
                {columnDeals.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-silver/15 bg-base/40 px-2 py-3 text-[11px] text-text-sub">
                    相談はありません
                  </li>
                ) : (
                  columnDeals.map((deal) => (
                    <li key={deal.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectDeal(deal.id)}
                        className={cn(
                          "w-full min-w-0 rounded-lg border p-2 text-left text-xs transition md:p-2.5 md:text-[15px]",
                          selectedDealId === deal.id
                            ? "border-accent/50 bg-accent/10 font-medium"
                            : "border-silver/25 bg-base/80 hover:border-silver/45"
                        )}
                      >
                        <span className="line-clamp-2 font-medium leading-snug text-white/95">
                          {deal.title}
                        </span>
                        <span className="mt-1 line-clamp-1 text-[11px] text-text-sub md:text-xs">
                          {deal.clientName}
                        </span>
                        <span className="mt-1 block text-[10px] tabular-nums text-text-sub md:text-[11px]">
                          次 {deal.nextActionDate}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {selectedDeal ? (
        <>
          <div className="mt-3 overflow-hidden rounded-xl border border-silver/25 bg-base-dark/80 md:hidden">
            <button
              type="button"
              id="mini-sfa-deal-detail-trigger"
              aria-expanded={mobileDealDetailOpen}
              aria-controls="mini-sfa-deal-detail-panel"
              onClick={() => setMobileDealDetailOpen(!mobileDealDetailOpen)}
              className="flex w-full items-center gap-3 border-b border-silver/25 bg-accent/10 px-3 py-3.5 text-left transition hover:bg-accent/15 active:bg-accent/20"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">選択中の相談</span>
                <span className="mt-1 block text-[11px] font-medium text-accent">
                  タップして詳細とステージ変更を表示
                </span>
                <span className="mt-0.5 line-clamp-1 text-xs text-text-sub">
                  {selectedDeal.title}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-accent transition-transform duration-200",
                  mobileDealDetailOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            <div
              id="mini-sfa-deal-detail-panel"
              role="region"
              aria-labelledby="mini-sfa-deal-detail-trigger"
              className={cn(
                "border-t border-silver/20 px-3 pb-3 pt-2",
                !mobileDealDetailOpen && "hidden"
              )}
            >
              {detail}
            </div>
          </div>

          <div className="hidden md:block">{detail}</div>
        </>
      ) : null}
    </div>
  );
}
