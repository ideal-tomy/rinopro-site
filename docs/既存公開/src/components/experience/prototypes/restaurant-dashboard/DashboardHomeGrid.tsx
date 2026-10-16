"use client";

import {
  BarChart3,
  Bell,
  Cloud,
  LayoutGrid,
  Package,
  PieChart,
  Store,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HomeCardDef, HomeCardId } from "@/lib/experience/restaurant-dashboard/types";
import { HOME_CARDS } from "@/lib/experience/restaurant-dashboard/scenario";

const ICONS: Record<HomeCardId, typeof Cloud> = {
  shift: LayoutGrid,
  sales_traffic: BarChart3,
  expense_settlement: Wallet,
  cloud: Cloud,
  products: Package,
  stores: Store,
  notifications: Bell,
  reports: PieChart,
};

interface DashboardHomeGridProps {
  cards?: HomeCardDef[];
  highlightId: HomeCardId | null;
  reduceMotion: boolean;
  onCardClick: (card: HomeCardDef) => void;
}

export function DashboardHomeGrid({
  cards = HOME_CARDS,
  highlightId,
  reduceMotion,
  onCardClick,
}: DashboardHomeGridProps) {
  return (
    <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <div
        className={cn(
          "mx-auto grid w-full min-w-[280px] grid-cols-4 grid-rows-2 gap-1.5 sm:min-w-0 sm:gap-2 md:gap-3",
          "max-w-4xl"
        )}
      >
        {cards.map((card) => {
          const Icon = ICONS[card.id];
          const hi = highlightId === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onCardClick(card)}
              className={cn(
                "flex min-h-[4.5rem] min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border bg-white p-1.5 text-center shadow-sm transition-shadow sm:min-h-[5.5rem] sm:gap-1 sm:p-2",
                "border-slate-200 hover:border-slate-300 hover:shadow",
                card.interactive && "cursor-pointer",
                !card.interactive && "cursor-default",
                hi &&
                  "border-emerald-400 ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-50",
                hi && !reduceMotion && "animate-pulse"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 sm:size-5",
                  card.interactive ? "text-emerald-700" : "text-slate-400"
                )}
                aria-hidden
              />
              <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-slate-900 sm:text-xs">
                {card.title}
              </span>
              <span className="line-clamp-2 text-[9px] leading-tight text-slate-500 sm:text-[10px]">
                {card.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
