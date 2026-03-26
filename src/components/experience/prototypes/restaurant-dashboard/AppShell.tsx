"use client";

import type { ReactNode } from "react";
import {
  BarChart3,
  Banknote,
  Home,
  LayoutGrid,
  Store,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardChapter } from "@/lib/experience/restaurant-dashboard/types";

const NAV: {
  id: DashboardChapter;
  label: string;
  icon: typeof Home;
}[] = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "shift", label: "シフト", icon: LayoutGrid },
  { id: "traffic", label: "入客", icon: BarChart3 },
  { id: "receipts", label: "経費", icon: Wallet },
  { id: "payroll", label: "給与", icon: Banknote },
  { id: "expenses", label: "精算", icon: Store },
];

interface AppShellProps {
  surface: DashboardChapter;
  onNavigate: (chapter: DashboardChapter) => void;
  topBar: ReactNode;
  children: ReactNode;
  notice: string | null;
  className?: string;
}

export function AppShell({
  surface,
  onNavigate,
  topBar,
  children,
  notice,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm",
        "min-h-0 font-sans antialiased",
        className
      )}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
            デ
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              デモ食堂 本店
            </p>
            <p className="truncate text-[10px] text-slate-500 sm:text-xs">
              飲食オペレーション（デモデータ）
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900 sm:text-xs">
          デモ・本番非連携
        </span>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
        <aside className="flex shrink-0 flex-row gap-0.5 border-b border-slate-200 bg-white px-1 py-1 md:w-44 md:flex-col md:border-b-0 md:border-r md:px-2 md:py-3">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = surface === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors md:flex-none",
                  active
                    ? "bg-emerald-50 font-medium text-emerald-900"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50">
          {topBar}
          <div className="min-h-0 min-w-0 flex-1 overflow-auto p-2 sm:p-3 md:p-4">
            {children}
          </div>
        </div>
      </div>

      {notice ? (
        <p
          className="shrink-0 border-t border-slate-200 bg-slate-100 px-3 py-2 text-center text-xs text-slate-700"
          role="status"
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}
