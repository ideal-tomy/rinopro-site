"use client";

import Link from "next/link";
import { ChevronDown, Kanban, LayoutDashboard, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import {
  DEAL_STAGE_LABEL,
  activeDeals,
  dealsDueThisWeek,
  overdueDeals,
  stageCounts,
} from "@/lib/experience/professional-mini-sfa/dashboard-helpers";
import { DEMO_TODAY } from "@/lib/experience/professional-mini-sfa/demo-today";
import {
  DISCLAIMER_LINES,
  ESTIMATE_RANGE_LABEL,
  INCLUDES,
  MVP_ONE_LINER,
  MVP_SCOPE_BULLETS,
  ONBOARDING_DAY_RATE_LABEL,
  OPTION_FEATURE_EXAMPLES,
  OPTION_PRICING_EXAMPLES,
  OPTION_SECTION_FOOTNOTE,
  OPTION_SECTION_TITLE,
  SECURITY_RANGE_SUBLINE,
} from "@/lib/experience/professional-mini-sfa/estimate-anchors";
import { MOCK_CONTACTS } from "@/lib/experience/professional-mini-sfa/mock-contacts";
import {
  DEAL_STAGE_ORDER,
  INITIAL_DEALS,
} from "@/lib/experience/professional-mini-sfa/mock-deals";
import type { DealCard, DealStageId } from "@/lib/experience/professional-mini-sfa/types";
import { cn } from "@/lib/utils";

type TabId = "dashboard" | "board" | "contacts";

const NAV: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { id: "board", label: "商談ボード", icon: Kanban },
  { id: "contacts", label: "顧客・案件一覧", icon: Users },
];

interface ProfessionalMiniSfaExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function ProfessionalMiniSfaExperience({
  meta: _meta,
  className,
}: ProfessionalMiniSfaExperienceProps) {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [deals, setDeals] = useState<DealCard[]>(INITIAL_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string>(INITIAL_DEALS[0]?.id ?? "");
  const [mobileBoardStage, setMobileBoardStage] = useState<DealStageId>(DEAL_STAGE_ORDER[0]);
  const [mobileDealDetailOpen, setMobileDealDetailOpen] = useState(false);
  const [mobileWeekFollowOpen, setMobileWeekFollowOpen] = useState(false);

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) ?? deals[0],
    [deals, selectedDealId]
  );

  const stats = useMemo(() => {
    const active = activeDeals(deals);
    const week = dealsDueThisWeek(deals);
    const overdue = overdueDeals(deals);
    const sc = stageCounts(deals);
    return {
      activeCount: active.length,
      weekCount: week.length,
      overdueCount: overdue.length,
      firstMeetingCount: sc.first_meeting,
      weekRows: week,
      overdueRows: overdue,
    };
  }, [deals]);

  const setStage = (id: string, stage: DealStageId) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  };

  const goToDeal = (id: string) => {
    setSelectedDealId(id);
    setTab("board");
  };

  useEffect(() => {
    if (tab !== "board") return;
    const d = deals.find((x) => x.id === selectedDealId);
    if (d) setMobileBoardStage(d.stage);
  }, [tab, selectedDealId, deals]);

  useEffect(() => {
    if (tab !== "board") setMobileDealDetailOpen(false);
  }, [tab]);

  useEffect(() => {
    if (tab !== "dashboard") setMobileWeekFollowOpen(false);
  }, [tab]);

  const selectDealOnMobileBoard = (id: string) => {
    setSelectedDealId(id);
  };

  return (
    <div className={cn("space-y-5 md:space-y-8", className)}>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-accent/45 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent md:text-xs">
            操作デモ（ブラウザ内モック）
          </span>
          <span className="text-[11px] text-text-sub md:text-xs">変更は保存されません</span>
        </div>
        <div
          className={cn(
            "w-full rounded-2xl border-2 border-accent/35 bg-base-dark/90 p-3 ring-1 ring-white/10 md:p-5",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          )}
        >
          <p className="text-xs leading-relaxed text-text-sub md:text-[16px]">
            士業事務所での「朝いちの俯瞰」と「相談の流れ」を、軽量なSFAイメージでまとめたデモです。
            <span className="lg:hidden">下のタブをタップして画面を切り替えられます。</span>
            <span className="hidden lg:inline">左のメニューで画面を切り替えられます。</span>
          </p>

          <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-6 lg:flex-row lg:items-start">
            <nav
              role="tablist"
              aria-label="デモ内の表示画面"
              className={cn(
                "flex shrink-0 flex-col gap-1 rounded-xl border border-silver/30 bg-silver/10 p-1",
                "lg:w-52 lg:rounded-lg lg:border-0 lg:bg-transparent lg:p-0"
              )}
            >
              <p className="px-1 pb-0.5 text-[10px] font-medium uppercase tracking-wide text-text-sub lg:hidden">
                表示する画面
              </p>
              <p className="hidden text-xs font-medium text-text-sub lg:mb-1 lg:block">
                ミニSFA（デモ）
              </p>
              <div className="grid grid-cols-3 gap-1 lg:flex lg:flex-col lg:gap-1">
                {NAV.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    id={`mini-sfa-tab-${id}`}
                    onClick={() => setTab(id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-center transition",
                      "lg:flex-row lg:justify-start lg:gap-2 lg:px-3 lg:py-2.5 lg:text-left",
                      tab === id
                        ? "bg-accent/20 font-semibold text-accent lg:bg-accent/15"
                        : "text-text-sub hover:bg-silver/10 hover:text-text"
                    )}
                  >
                    <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                    <span className="line-clamp-2 w-full px-0.5 text-[10px] leading-tight lg:line-clamp-none lg:w-auto lg:px-0 lg:text-[15px]">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            <div
              className="min-w-0 flex-1 space-y-4 md:space-y-6"
              role="tabpanel"
              aria-labelledby={`mini-sfa-tab-${tab}`}
            >
          {tab === "dashboard" && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-white md:text-[16px]">
                  ダッシュボード
                </h2>
                <p className="mt-1 text-[11px] text-text-sub md:text-sm">
                  デモ上の「今日」は {DEMO_TODAY}
                  。カンバンでステージを変えると、ここの数値も連動します。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                <div className="rounded-xl border border-silver/25 bg-base-dark/70 p-2.5 md:p-4">
                  <p className="text-[10px] text-text-sub md:text-xs">アクティブ相談</p>
                  <p className="mt-0.5 text-xl font-semibold text-white tabular-nums md:mt-1 md:text-2xl">
                    {stats.activeCount}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">見送り除く</p>
                </div>
                <div className="rounded-xl border border-silver/25 bg-base-dark/70 p-2.5 md:p-4">
                  <p className="text-[10px] text-text-sub md:text-xs">今週のフォロー</p>
                  <p className="mt-0.5 text-xl font-semibold text-accent tabular-nums md:mt-1 md:text-2xl">
                    {stats.weekCount}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">7日以内・未クローズ</p>
                </div>
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-2.5 md:p-4">
                  <p className="text-[10px] text-amber-200/80 md:text-xs">期限超過</p>
                  <p className="mt-0.5 text-xl font-semibold text-amber-200 tabular-nums md:mt-1 md:text-2xl">
                    {stats.overdueCount}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">未クローズのみ</p>
                </div>
                <div className="rounded-xl border border-silver/25 bg-base-dark/70 p-2.5 md:p-4">
                  <p className="text-[10px] text-text-sub md:text-xs">初回面談ステージ</p>
                  <p className="mt-0.5 text-xl font-semibold text-white tabular-nums md:mt-1 md:text-2xl">
                    {stats.firstMeetingCount}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-sub md:mt-1 md:text-[11px]">パイプライン入口</p>
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
                      onClick={() => setMobileWeekFollowOpen((o) => !o)}
                      className="flex w-full items-center gap-3 border-b border-silver/25 bg-accent/10 px-3 py-3.5 text-left transition hover:bg-accent/15 active:bg-accent/20"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-white">
                          今週のフォロー一覧
                        </span>
                        <span className="mt-1 block text-[11px] font-medium text-accent">
                          タップして開く · 今週フォロー分の一覧
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
                      <ul className="space-y-1.5">
                        {stats.weekRows.length === 0 ? (
                          <li className="px-1 text-xs text-text-sub">該当なし</li>
                        ) : (
                          stats.weekRows.map((d) => (
                            <li key={d.id}>
                              <button
                                type="button"
                                onClick={() => goToDeal(d.id)}
                                className="w-full rounded-lg border border-silver/20 bg-base/60 px-2.5 py-1.5 text-left text-xs transition hover:border-accent/40"
                              >
                                <span className="font-medium text-white/95">{d.title}</span>
                                <span className="mt-0.5 block text-xs text-text-sub">
                                  {d.organization} ・ 次 {d.nextActionDate} ・{" "}
                                  {DEAL_STAGE_LABEL[d.stage]}
                                </span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="hidden md:block md:p-4">
                    <h3 className="text-xs font-semibold text-text md:text-[16px]">
                      今週のフォロー一覧
                    </h3>
                    <ul className="mt-2 space-y-1.5 md:mt-3 md:space-y-2">
                      {stats.weekRows.length === 0 ? (
                        <li className="text-xs text-text-sub md:text-sm">該当なし</li>
                      ) : (
                        stats.weekRows.map((d) => (
                          <li key={d.id}>
                            <button
                              type="button"
                              onClick={() => goToDeal(d.id)}
                              className="w-full rounded-lg border border-silver/20 bg-base/60 px-2.5 py-1.5 text-left text-xs transition hover:border-accent/40 md:px-3 md:py-2 md:text-[15px]"
                            >
                              <span className="font-medium text-white/95">{d.title}</span>
                              <span className="mt-0.5 block text-xs text-text-sub">
                                {d.organization} ・ 次 {d.nextActionDate} ・{" "}
                                {DEAL_STAGE_LABEL[d.stage]}
                              </span>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-base-dark/50 p-3 md:p-4">
                  <h3 className="text-xs font-semibold text-amber-100/90 md:text-[16px]">
                    期限超過（未クローズ）
                  </h3>
                  <ul className="mt-2 space-y-1.5 md:mt-3 md:space-y-2">
                    {stats.overdueRows.length === 0 ? (
                      <li className="text-xs text-text-sub md:text-sm">該当なし</li>
                    ) : (
                      stats.overdueRows.map((d) => (
                        <li key={d.id}>
                          <button
                            type="button"
                            onClick={() => goToDeal(d.id)}
                            className="w-full rounded-lg border border-amber-500/25 bg-base/60 px-2.5 py-1.5 text-left text-xs transition hover:border-amber-400/50 md:px-3 md:py-2 md:text-[15px]"
                          >
                            <span className="font-medium text-white/95">{d.title}</span>
                            <span className="mt-0.5 block text-xs text-text-sub">
                              期限 {d.nextActionDate} ・ {d.organization}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "board" && (
            <div className="space-y-3 md:space-y-4">
              <div className="md:hidden">
                <p className="mb-2 text-[11px] text-text-sub">
                  ステージを選んで一覧表示（スマホ向け）
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEAL_STAGE_ORDER.map((stage) => {
                    const columnDeals = deals.filter((d) => d.stage === stage);
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
                    .filter((d) => d.stage === mobileBoardStage)
                    .map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => selectDealOnMobileBoard(d.id)}
                          className={cn(
                            "w-full rounded-lg border px-2 py-1.5 text-left transition",
                            selectedDealId === d.id
                              ? "border-accent/50 bg-accent/15 font-medium text-white/95"
                              : "border-silver/25 bg-base/80 hover:border-silver/45"
                          )}
                        >
                          <span className="line-clamp-1 text-xs font-medium text-white/95">
                            {d.title}
                          </span>
                          <span className="mt-0.5 line-clamp-1 text-[10px] text-text-sub">
                            {d.organization} ・ 次 {d.nextActionDate}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>

              <div
                className={cn(
                  "hidden gap-2 pb-2 md:flex md:overflow-x-auto md:overscroll-x-contain md:[scrollbar-width:thin]",
                  "xl:grid xl:grid-cols-5 xl:gap-3 xl:overflow-visible xl:pb-0"
                )}
              >
                {DEAL_STAGE_ORDER.map((stage) => {
                  const columnDeals = deals.filter((d) => d.stage === stage);
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
                        {columnDeals.map((d) => (
                          <li key={d.id} className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedDealId(d.id)}
                              className={cn(
                                "w-full min-w-0 rounded-lg border p-2 text-left text-xs transition md:p-2.5 md:text-[15px]",
                                selectedDealId === d.id
                                  ? "border-accent/50 bg-accent/10 font-medium"
                                  : "border-silver/25 bg-base/80 hover:border-silver/45"
                              )}
                            >
                              <span className="line-clamp-2 font-medium leading-snug text-white/95">
                                {d.title}
                              </span>
                              <span className="mt-1 line-clamp-1 text-[11px] text-text-sub md:text-xs">
                                {d.organization}
                              </span>
                              <span className="mt-1 block text-[10px] tabular-nums text-text-sub md:text-[11px]">
                                次 {d.nextActionDate}
                              </span>
                            </button>
                          </li>
                        ))}
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
                      onClick={() => setMobileDealDetailOpen((o) => !o)}
                      className="flex w-full items-center gap-3 border-b border-silver/25 bg-accent/10 px-3 py-3.5 text-left transition hover:bg-accent/15 active:bg-accent/20"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-white">選択中の相談</span>
                        <span className="mt-1 block text-[11px] font-medium text-accent">
                          タップして開く · 詳細とステージ変更
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
                      <p className="text-[15px] font-medium text-accent">{selectedDeal.title}</p>
                      <p className="mt-1 text-xs text-text">{selectedDeal.organization}</p>
                      <p className="mt-2 text-xs text-text">
                        <span className="text-text-sub">次アクション: </span>
                        {selectedDeal.nextAction}（{selectedDeal.nextActionDate}）
                      </p>
                      <p className="mt-1.5 text-xs text-text-sub">{selectedDeal.note}</p>
                      <div className="mt-3">
                        <p className="mb-1.5 text-[11px] font-medium text-text-sub">
                          ステージを変更（デモ）
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {DEAL_STAGE_ORDER.map((st) => (
                            <Button
                              key={st}
                              type="button"
                              variant={selectedDeal.stage === st ? "default" : "outline"}
                              size="sm"
                              className="text-xs"
                              onClick={() => setStage(selectedDeal.id, st)}
                            >
                              {DEAL_STAGE_LABEL[st]}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden rounded-xl border border-silver/25 bg-base-dark/80 p-3 md:block md:p-5">
                    <h3 className="text-xs font-semibold text-white md:text-[16px]">選択中の相談</h3>
                    <p className="mt-1 text-[15px] font-medium text-accent md:text-lg">{selectedDeal.title}</p>
                    <p className="mt-1.5 text-xs text-text md:mt-2 md:text-[16px]">{selectedDeal.organization}</p>
                    <p className="mt-2 text-xs text-text md:mt-3 md:text-[16px]">
                      <span className="text-text-sub">次アクション: </span>
                      {selectedDeal.nextAction}（{selectedDeal.nextActionDate}）
                    </p>
                    <p className="mt-1.5 text-xs text-text-sub md:mt-2 md:text-[15px]">{selectedDeal.note}</p>
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-text-sub md:text-sm">
                        ステージを変更（デモ）
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DEAL_STAGE_ORDER.map((st) => (
                          <Button
                            key={st}
                            type="button"
                            variant={selectedDeal.stage === st ? "default" : "outline"}
                            size="sm"
                            className="text-xs md:text-sm"
                            onClick={() => setStage(selectedDeal.id, st)}
                          >
                            {DEAL_STAGE_LABEL[st]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {tab === "contacts" && (
            <div className="overflow-x-auto rounded-xl border border-silver/20">
              <table className="w-full min-w-[640px] text-left text-xs text-text md:text-[16px]">
                <thead className="border-b border-silver/20 bg-base-dark/90 text-text-sub">
                  <tr>
                    <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">組織名</th>
                    <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">担当者</th>
                    <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">紹介元</th>
                    <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">案件種別</th>
                    <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">最終接触日</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CONTACTS.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-silver/15 last:border-0 hover:bg-silver/5"
                    >
                      <td className="px-2 py-1.5 text-white/95 md:px-3 md:py-2">{c.organization}</td>
                      <td className="px-2 py-1.5 md:px-3 md:py-2">{c.contactName}</td>
                      <td className="px-2 py-1.5 md:px-3 md:py-2">{c.referrer}</td>
                      <td className="px-2 py-1.5 md:px-3 md:py-2">{c.matterType}</td>
                      <td className="px-2 py-1.5 text-text-sub md:px-3 md:py-2">{c.lastTouch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="border-t border-dashed border-silver/35 pt-4 md:pt-6"
        role="separator"
        aria-label="操作デモと制作条件・概算説明の区切り"
      >
        <p className="text-center text-[11px] leading-snug text-text-sub md:text-xs">
          以下は<strong className="font-medium text-text/90">制作条件・概算レンジ</strong>
          の説明です（上の枠は操作デモのみ）
        </p>
      </div>

      <section
        className="space-y-3 rounded-xl border border-silver/30 bg-silver/5 p-3 md:space-y-5 md:p-6"
        aria-labelledby="mvp-estimate-heading"
      >
        <h2
          id="mvp-estimate-heading"
          className="text-sm font-semibold text-white md:text-lg"
        >
          制作イメージと概算レンジ（例示）
        </h2>
        <p className="text-xs text-text md:text-[16px]">{MVP_ONE_LINER}</p>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-text-sub md:text-sm">
            MVP の範囲（目安）
          </p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-text md:mt-2 md:space-y-1 md:text-[16px]">
            {MVP_SCOPE_BULLETS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2.5 md:px-4 md:py-3">
          <p className="text-xs font-semibold text-accent md:text-[16px]">
            概算レンジ: {ESTIMATE_RANGE_LABEL}
          </p>
          <p className="mt-1.5 text-[11px] text-text md:mt-2 md:text-sm">{SECURITY_RANGE_SUBLINE}</p>
          <p className="mt-1.5 text-[11px] text-text-sub md:mt-2 md:text-sm">{ONBOARDING_DAY_RATE_LABEL}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <p className="text-[11px] font-semibold text-emerald-400/90 md:text-sm">含む（例）</p>
            <ul className="mt-1.5 space-y-1 text-xs text-text md:mt-2 md:space-y-1.5 md:text-[15px]">
              {INCLUDES.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="shrink-0 text-emerald-400/80" aria-hidden>
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-accent/90 md:text-sm">
              {OPTION_SECTION_TITLE}
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-text md:mt-2 md:space-y-1.5 md:text-[15px]">
              {OPTION_FEATURE_EXAMPLES.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="shrink-0 text-accent/70" aria-hidden>
                    +
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-text-sub md:mt-3 md:text-sm">{OPTION_SECTION_FOOTNOTE}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-text-sub md:text-sm">
            オプション費用感（税別・例示）
          </p>
          <div className="mt-1.5 overflow-x-auto rounded-lg border border-silver/25 md:mt-2">
            <table className="w-full min-w-[480px] text-left text-xs text-text md:text-[15px]">
              <thead className="border-b border-silver/20 bg-base-dark/80 text-text-sub">
                <tr>
                  <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">項目</th>
                  <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">費用感の目安</th>
                </tr>
              </thead>
              <tbody>
                {OPTION_PRICING_EXAMPLES.map((row) => (
                  <tr key={row.title} className="border-b border-silver/15 last:border-0">
                    <td className="px-2 py-1.5 text-white/90 md:px-3 md:py-2">{row.title}</td>
                    <td className="px-2 py-1.5 tabular-nums text-accent/95 md:px-3 md:py-2">
                      {row.rangeHint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[11px] text-text-sub md:mt-2 md:text-xs">
            オプションは20万円台から積み上がる想定の例です。範囲が広い項目はヒアリング後にレンジを狭めます。
          </p>
        </div>

        <div className="space-y-1.5 border-t border-silver/20 pt-3 text-[11px] text-text-sub md:space-y-2 md:pt-4 md:text-sm">
          {DISCLAIMER_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="text-xs text-text-sub md:text-[16px]">
          ご自身の案件の整理・概算レンジの切り出しは{" "}
          <Link
            href="/estimate-detailed"
            className="text-accent underline-offset-2 hover:underline"
          >
            詳細見積のヒアリング
          </Link>
          からも進められます（任意）。
        </p>
      </section>
    </div>
  );
}
