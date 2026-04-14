"use client";

import Link from "next/link";
import { Kanban, LayoutDashboard, Plus, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniSfaBoardTab } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaBoardTab";
import { MiniSfaContactsTab } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaContactsTab";
import { MiniSfaCreateDealDialog } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaCreateDealDialog";
import { MiniSfaDashboardTab } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaDashboardTab";
import { MiniSfaDealDetail } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaDealDetail";
import { MiniSfaIntegrationPreview } from "@/components/experience/prototypes/professional-mini-sfa/MiniSfaIntegrationPreview";
import { useProfessionalMiniSfaDemo } from "@/hooks/use-professional-mini-sfa-demo";
import { DEMO_TODAY } from "@/lib/experience/professional-mini-sfa/constants";
import {
  DEMO_BADGES,
  DEMO_INTRO,
  DEMO_MODE_NOTE,
  DEMO_RESET_HINT,
  MINI_SFA_INTEGRATION_PREVIEW_ITEMS,
} from "@/lib/experience/professional-mini-sfa/demo-copy";
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
import type { TabId } from "@/lib/experience/professional-mini-sfa/types";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const NAV: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { id: "board", label: "相談ボード", icon: Kanban },
  { id: "contacts", label: "顧客・案件一覧", icon: Users },
];

interface ProfessionalMiniSfaExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function ProfessionalMiniSfaExperience({
  className,
}: ProfessionalMiniSfaExperienceProps) {
  const {
    activeTab,
    setActiveTab,
    contacts,
    createDeal,
    createDialogOpen,
    deals,
    mobileBoardStage,
    mobileDealDetailOpen,
    mobileWeekFollowOpen,
    moveDealStage,
    resetDemo,
    selectedDeal,
    selectedDealId,
    setCreateDialogOpen,
    setMobileBoardStage,
    setMobileDealDetailOpen,
    setMobileWeekFollowOpen,
    setSelectedDealId,
    stats,
    updateDeal,
  } = useProfessionalMiniSfaDemo();

  const openDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setActiveTab("board");
  };

  return (
    <div className={cn("space-y-5 md:space-y-8", className)}>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-accent/45 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent md:text-xs">
            操作デモ（ブラウザ内モック）
          </span>
          {DEMO_BADGES.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full border border-silver/30 bg-silver/10 px-2.5 py-0.5 text-[11px] font-medium text-text-sub md:text-xs"
            >
              {badge}
            </span>
          ))}
        </div>

        <div
          className={cn(
            "w-full rounded-2xl border-2 border-accent/35 bg-base-dark/90 p-3 ring-1 ring-white/10 md:p-5",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          )}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <p className="text-xs leading-relaxed text-text-sub md:text-[16px]">
              {DEMO_INTRO}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetDemo}>
                <RotateCcw aria-hidden />
                初期状態に戻す
              </Button>
              <Button type="button" size="sm" onClick={() => setCreateDialogOpen(true)}>
                <Plus aria-hidden />
                新規相談を追加
              </Button>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-text-sub md:text-sm">
            {DEMO_RESET_HINT}
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
                    aria-selected={activeTab === id}
                    id={`mini-sfa-tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-center transition",
                      "lg:flex-row lg:justify-start lg:gap-2 lg:px-3 lg:py-2.5 lg:text-left",
                      activeTab === id
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
              aria-labelledby={`mini-sfa-tab-${activeTab}`}
            >
              {activeTab === "dashboard" && (
                <MiniSfaDashboardTab
                  todayLabel={DEMO_TODAY}
                  stats={stats}
                  mobileWeekFollowOpen={mobileWeekFollowOpen}
                  setMobileWeekFollowOpen={setMobileWeekFollowOpen}
                  onOpenDeal={openDeal}
                />
              )}

              {activeTab === "board" && (
                <MiniSfaBoardTab
                  deals={deals}
                  selectedDeal={selectedDeal}
                  selectedDealId={selectedDealId}
                  onSelectDeal={setSelectedDealId}
                  mobileBoardStage={mobileBoardStage}
                  setMobileBoardStage={setMobileBoardStage}
                  mobileDealDetailOpen={mobileDealDetailOpen}
                  setMobileDealDetailOpen={setMobileDealDetailOpen}
                  detail={
                    <MiniSfaDealDetail
                      key={selectedDeal?.id ?? "empty"}
                      deal={selectedDeal}
                      onMoveStage={moveDealStage}
                      onUpdateDeal={updateDeal}
                    />
                  }
                />
              )}

              {activeTab === "contacts" && (
                <MiniSfaContactsTab contacts={contacts} onOpenDeal={openDeal} />
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
          以下は<strong className="font-medium text-text/90">将来連携イメージと制作条件・概算レンジ</strong>
          の説明です（上の枠は操作デモのみ）
        </p>
      </div>

      <MiniSfaIntegrationPreview items={MINI_SFA_INTEGRATION_PREVIEW_ITEMS} />
      <p className="mt-3 text-xs leading-relaxed text-text-sub md:text-sm">
        {DEMO_MODE_NOTE}
      </p>

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
          <p className="mt-1.5 text-[11px] text-text md:mt-2 md:text-sm">
            {SECURITY_RANGE_SUBLINE}
          </p>
          <p className="mt-1.5 text-[11px] text-text-sub md:mt-2 md:text-sm">
            {ONBOARDING_DAY_RATE_LABEL}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <p className="text-[11px] font-semibold text-emerald-400/90 md:text-sm">
              含む（例）
            </p>
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
            <p className="mt-2 text-[11px] text-text-sub md:mt-3 md:text-sm">
              {OPTION_SECTION_FOOTNOTE}
            </p>
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
                  <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">
                    費用感の目安
                  </th>
                </tr>
              </thead>
              <tbody>
                {OPTION_PRICING_EXAMPLES.map((row) => (
                  <tr key={row.title} className="border-b border-silver/15 last:border-0">
                    <td className="px-2 py-1.5 text-white/90 md:px-3 md:py-2">
                      {row.title}
                    </td>
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

      <MiniSfaCreateDealDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateDeal={createDeal}
      />
    </div>
  );
}
