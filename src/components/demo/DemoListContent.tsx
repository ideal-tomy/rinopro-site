"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import {
  getCategoryId,
  CATEGORY_LABELS,
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";
import {
  pickRecommendedDemos,
  CONCIERGE_DOMAIN_OPTIONS,
  CONCIERGE_ROLE_OPTIONS,
  CONCIERGE_ISSUE_OPTIONS,
  CONCIERGE_DEPTH_OPTIONS,
  type ConciergeAnswers,
  type ConciergeDomainId,
  type ConciergePick,
} from "@/lib/demo/intelligent-concierge";
import type {
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
} from "@/lib/sanity/types";

function getSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function RunModeBadge({ demo }: { demo: AiDemo | DemoItem }) {
  if ((demo as AiDemo)._type !== "aiDemo") return null;
  const runMode = (demo as AiDemo).runMode ?? "mock_preview";
  const isLive = runMode === "ai_live";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

function DemoCard({
  demo,
  className,
  reason,
}: {
  demo: AiDemo | DemoItem;
  className?: string;
  /** コンシェルジュ推薦の一行説明 */
  reason?: string;
}) {
  const slug = getSlug(demo);
  const imageUrl = demo.image?.url;
  const oneLiner = demo.oneLiner ?? demo.description;
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];

  return (
    <Link
      href={slug ? `/demo/${slug}` : "#"}
      className={cn(
        "group flex w-[152px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/40 md:w-[248px]",
        className
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(max-width: 768px) 152px, 248px"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-silver/10" />
      )}
      <div className="flex flex-1 flex-col p-2.5 md:p-4">
        <div className="mb-1.5 flex items-center gap-1.5 md:mb-2 md:gap-2">
          <RunModeBadge demo={demo} />
          <h2 className="line-clamp-1 text-sm font-semibold text-text group-hover:text-accent md:text-[1rem]">
            {demo.title}
          </h2>
        </div>
        {reason && (
          <p className="mb-1.5 line-clamp-2 text-[10px] leading-tight text-accent/90 md:mb-2 md:text-xs">
            {reason}
          </p>
        )}
        {oneLiner && (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-4 text-text-sub md:mb-3 md:text-sm md:leading-5">
            {oneLiner}
          </p>
        )}
        <div className="mb-2 flex flex-wrap gap-1 md:mb-3 md:gap-1.5">
          {functionTags.slice(0, 1).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
                getFunctionTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
          {industryTags.slice(0, 2).map((t) => (
            <span
              key={`ind-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex h-8 items-center rounded-md border border-silver/30 px-2.5 text-xs font-medium text-text-sub group-hover:border-accent/50 group-hover:text-accent md:h-9 md:px-3 md:text-sm">
          体験する
        </span>
      </div>
    </Link>
  );
}

function HorizontalRail({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  const updateScrollState = () => {
    const node = railRef.current;
    if (!node) return;
    setCanLeft(node.scrollLeft > 4);
    setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  };

  useEffect(() => {
    setMounted(true);
    updateScrollState();
    const node = railRef.current;
    if (!node) return;
    const onScroll = () => updateScrollState();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByAmount = (direction: 1 | -1) => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div
        ref={(el) => {
          railRef.current = el;
          if (mounted) updateScrollState();
        }}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:gap-4 md:px-8 xl:px-12"
        )}
        aria-label={ariaLabel}
      >
        {children}
      </div>

      {canLeft && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-base via-base/80 to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/85 p-1.5 text-text-sub transition-colors hover:border-accent/60 hover:text-accent md:block"
            aria-label="左にスクロール"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}
      {canRight && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-base via-base/80 to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/85 p-1.5 text-text-sub transition-colors hover:border-accent/60 hover:text-accent md:block"
            aria-label="右にスクロール"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

const STEP_HEADLINES = [
  "事業領域に近いものを選んでください",
  "ご自身の立ち位置に近いものを選んでください",
  "いま負荷が大きいと感じる領域はどれですか",
  "望ましい進め方に近いものを選んでください",
] as const;

function labelForDomain(id: ConciergeDomainId): string {
  return CONCIERGE_DOMAIN_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
function labelForRole(id: AiDemoAudienceRole): string {
  return CONCIERGE_ROLE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
function labelForIssue(id: AiDemoIssueTag): string {
  return CONCIERGE_ISSUE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
function labelForDepth(id: AiDemoAutomationDepth): string {
  return CONCIERGE_DEPTH_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

interface DemoListContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoListContent({ demos }: DemoListContentProps) {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [conciergeStep, setConciergeStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Partial<ConciergeAnswers>>({});
  const [appliedAnswers, setAppliedAnswers] = useState<ConciergeAnswers | null>(null);
  const [conciergePicks, setConciergePicks] = useState<ConciergePick[]>([]);

  useEffect(() => {
    setHasMounted(true);
    setIsConciergeOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isConciergeOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isConciergeOpen]);

  if (demos.length === 0) {
    return (
      <p className="py-16 text-center text-text-sub">デモは準備中です。</p>
    );
  }

  const categoryOrder = [
    "report",
    "search",
    "inquiry",
    "document",
    "safety",
    "quality",
    "sales",
    "legal",
    "hr",
    "inspection",
    "logistics",
    "other",
  ];

  const filteredDemos = demos;

  const grouped = useMemo(() => {
    const map = new Map<string, (AiDemo | DemoItem)[]>();
    for (const demo of filteredDemos) {
      const catId = getCategoryId(demo.functionTags);
      const list = map.get(catId) ?? [];
      list.push(demo);
      map.set(catId, list);
    }
    return map;
  }, [filteredDemos]);

  const orderedCategories = categoryOrder.filter((id) => grouped.has(id));
  const rest = [...grouped.keys()].filter((id) => !categoryOrder.includes(id));
  const allCategories = [...orderedCategories, ...rest];

  const openConcierge = () => {
    setConciergeStep(0);
    setWizardAnswers(appliedAnswers ? { ...appliedAnswers } : {});
    setIsConciergeOpen(true);
  };

  const closeConciergeBrowseOnly = () => {
    setIsConciergeOpen(false);
  };

  const goBackStep = () => {
    setConciergeStep((s) => Math.max(0, s - 1));
  };

  const selectDomainAndAdvance = (id: ConciergeDomainId) => {
    setWizardAnswers((w) => ({ ...w, domain: id }));
    setConciergeStep(1);
  };

  const selectRoleAndAdvance = (id: AiDemoAudienceRole) => {
    setWizardAnswers((w) => ({ ...w, audienceRole: id }));
    setConciergeStep(2);
  };

  const selectIssueAndAdvance = (id: AiDemoIssueTag) => {
    setWizardAnswers((w) => ({ ...w, issue: id }));
    setConciergeStep(3);
  };

  /** 最終ステップ: タップで即提案を確定してモーダルを閉じる */
  const selectDepthAndFinish = (id: AiDemoAutomationDepth) => {
    const w = { ...wizardAnswers, automationDepth: id };
    setWizardAnswers(w);
    const { domain, audienceRole, issue } = w;
    if (!domain || !audienceRole || !issue) return;
    const full: ConciergeAnswers = {
      domain,
      audienceRole,
      issue,
      automationDepth: id,
    };
    setAppliedAnswers(full);
    setConciergePicks(pickRecommendedDemos(demos, full));
    setIsConciergeOpen(false);
  };

  const conciergeChipClass = (active: boolean) =>
    cn(
      "rounded-lg border px-2 py-1.5 text-left text-[11px] leading-snug transition-colors sm:rounded-full sm:px-3 sm:py-2 sm:text-sm",
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-silver/30 text-text-sub hover:border-accent/40 hover:text-accent"
    );

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-xl border border-silver/20 bg-base-dark/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm text-text-sub">
            {appliedAnswers
              ? "直近のコンシェルジュ条件を表示しています"
              : "コンシェルジュで条件を選ぶと、最適なデモを最大3件提示します"}
          </p>
          <button
            type="button"
            onClick={openConcierge}
            className="rounded-md border border-silver/30 px-3 py-1 text-xs text-text-sub transition-colors hover:border-accent/50 hover:text-accent"
          >
            {appliedAnswers ? "条件を選び直す" : "コンシェルジュを開く"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {appliedAnswers ? (
            <>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                領域: {labelForDomain(appliedAnswers.domain)}
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                立場: {labelForRole(appliedAnswers.audienceRole)}
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                課題: {labelForIssue(appliedAnswers.issue)}
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                進め方: {labelForDepth(appliedAnswers.automationDepth)}
              </span>
            </>
          ) : (
            <span className="text-xs text-text-sub">条件は未設定です</span>
          )}
        </div>
      </section>

      {conciergePicks.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-accent md:text-xl">
            あなた向けの提案（最大3件）
          </h2>
          <HorizontalRail ariaLabel="コンシェルジュが提案したデモ">
            {conciergePicks.map(({ demo, reason }) => (
              <DemoCard key={`rec-${demo._id}`} demo={demo} reason={reason} />
            ))}
          </HorizontalRail>
        </section>
      )}

      {allCategories.map((catId) => {
        const items = grouped.get(catId) ?? [];
        const label = CATEGORY_LABELS[catId] ?? catId;
        return (
          <section key={catId}>
            <h2 className="mb-3 text-lg font-bold text-text md:text-xl">
              {label}
            </h2>
            <HorizontalRail ariaLabel={`${label}のデモ一覧`}>
              {items.map((demo) => (
                <DemoCard key={demo._id} demo={demo} />
              ))}
            </HorizontalRail>
          </section>
        );
      })}

      {hasMounted &&
        isConciergeOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-base/80 p-0 backdrop-blur-sm sm:items-center sm:p-4 sm:pt-16 md:pt-24"
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-title"
          >
          <div
            className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-silver/30 border-b-0 bg-base-dark shadow-2xl sm:max-h-[min(92dvh,760px)] sm:rounded-2xl sm:border-b"
          >
            <div className="shrink-0 px-3 pb-2 pt-3 sm:px-5 sm:pb-2 sm:pt-5">
              <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-accent/90 sm:mb-1 sm:text-xs sm:tracking-[0.16em]">
                Intelligent Concierge
              </p>
              <h3
                id="concierge-title"
                className="mb-0.5 text-base font-semibold text-text sm:mb-1 sm:text-lg md:text-xl"
              >
                デモへの最短ルート
              </h3>
              <p className="hidden text-sm text-text-sub sm:mb-3 sm:block">
                4つの選択だけで、100本近いデモから近いものを最大3件に絞り込みます。いつでも一覧から探せます。
              </p>
              <p className="mb-2 text-[11px] leading-snug text-text-sub sm:hidden">
                4つの選択で最大3件に絞ります。一覧からも探せます。
              </p>

              <div className="mb-2 flex gap-1 sm:mb-3" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`prog-${i}`}
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-colors",
                      i <= conciergeStep ? "bg-accent/80" : "bg-silver/25"
                    )}
                  />
                ))}
              </div>

              <p className="text-xs font-medium leading-tight text-text sm:text-sm">
                {STEP_HEADLINES[conciergeStep]}
              </p>
            </div>

            {/*
              親に確定高さがない状態で flex-1 + min-h-0 にすると、flex 子の高さが 0 になりカードが消えたように見える。
              スクロールはこの領域の max-h で確実に確保する。
            */}
            <div className="max-h-[min(48dvh,340px)] overflow-y-auto overscroll-contain px-3 pb-2 sm:max-h-[min(52dvh,400px)] sm:px-5 sm:pb-3">
              {conciergeStep === 0 && (
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {CONCIERGE_DOMAIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectDomainAndAdvance(opt.id)}
                      className={conciergeChipClass(wizardAnswers.domain === opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {conciergeStep === 1 && (
                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                  {CONCIERGE_ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectRoleAndAdvance(opt.id)}
                      className={conciergeChipClass(
                        wizardAnswers.audienceRole === opt.id
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {conciergeStep === 2 && (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1 sm:gap-2">
                  {CONCIERGE_ISSUE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectIssueAndAdvance(opt.id)}
                      className={conciergeChipClass(wizardAnswers.issue === opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {conciergeStep === 3 && (
                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                  {CONCIERGE_DEPTH_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectDepthAndFinish(opt.id)}
                      className={conciergeChipClass(
                        wizardAnswers.automationDepth === opt.id
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className={cn(
                "shrink-0 border-t border-silver/20 bg-base-dark p-3 sm:px-5 sm:py-4",
                conciergeStep > 0 &&
                  "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              )}
            >
              <button
                type="button"
                onClick={closeConciergeBrowseOnly}
                className="w-full rounded-md border border-silver/30 px-3 py-2 text-xs text-text-sub transition-colors hover:border-silver/50 hover:text-text sm:w-auto sm:text-sm"
              >
                一覧で探す（閉じる）
              </button>
              {conciergeStep > 0 && (
                <button
                  type="button"
                  onClick={goBackStep}
                  className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-[color:var(--color-base)] transition-opacity hover:opacity-90 sm:ml-auto sm:w-auto"
                >
                  一つ前に戻る
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
        )}
    </div>
  );
}
