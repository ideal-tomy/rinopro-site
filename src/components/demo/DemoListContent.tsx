"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  CONCIERGE_DOMAIN_OPTIONS,
  CONCIERGE_ROLE_OPTIONS,
  CONCIERGE_ISSUE_OPTIONS,
  CONCIERGE_DEPTH_OPTIONS,
  type ConciergeDomainId,
} from "@/lib/demo/intelligent-concierge";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import type {
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
} from "@/lib/sanity/types";
import { DemoListRecommendationPopup } from "@/components/demo/DemoListRecommendationPopup";
import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

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
  const railRef = useRef<HTMLDivElement | null>(null);
  const detachScrollRef = useRef<(() => void) | null>(null);

  const updateScrollState = useCallback(() => {
    const node = railRef.current;
    if (!node) return;
    setCanLeft(node.scrollLeft > 4);
    setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }, []);

  const setRailNode = useCallback(
    (node: HTMLDivElement | null) => {
      detachScrollRef.current?.();
      detachScrollRef.current = null;
      railRef.current = node;
      if (!node) return;
      updateScrollState();
      const onScroll = () => updateScrollState();
      node.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", updateScrollState);
      detachScrollRef.current = () => {
        node.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", updateScrollState);
      };
    },
    [updateScrollState]
  );

  useEffect(() => {
    return () => detachScrollRef.current?.();
  }, []);

  const scrollByAmount = (direction: 1 | -1) => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={setRailNode}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-5"
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
  const { demoListWizardSnapshot, requestOpenDemoListPageConcierge } =
    useConciergeChat();
  const appliedAnswers = demoListWizardSnapshot?.answers ?? null;
  const conciergePicks = demoListWizardSnapshot?.picks ?? [];
  const picksSignature = useMemo(() => {
    const p = demoListWizardSnapshot?.picks;
    if (!p?.length) return "";
    return p.map((pick) => pick.demo._id).join("|");
  }, [demoListWizardSnapshot]);
  const [recommendPopupOpen, setRecommendPopupOpen] = useState(false);
  const lastPicksSignatureRef = useRef<string>("");
  const popupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (picksSignature === "") {
      lastPicksSignatureRef.current = "";
      setRecommendPopupOpen(false);
      return;
    }
    if (picksSignature === lastPicksSignatureRef.current) return;
    lastPicksSignatureRef.current = picksSignature;
    if (popupTimerRef.current !== null) {
      window.clearTimeout(popupTimerRef.current);
    }
    // コンシェルジュのクローズアニメーション直後に重ねて表示し、クロスフェード感を作る
    popupTimerRef.current = window.setTimeout(() => {
      setRecommendPopupOpen(true);
      popupTimerRef.current = null;
    }, 180);
    return () => {
      if (popupTimerRef.current !== null) {
        window.clearTimeout(popupTimerRef.current);
        popupTimerRef.current = null;
      }
    };
  }, [picksSignature]);

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

  const grouped = useMemo(() => {
    const map = new Map<string, (AiDemo | DemoItem)[]>();
    for (const demo of demos) {
      const catId = getCategoryId(demo.functionTags);
      const list = map.get(catId) ?? [];
      list.push(demo);
      map.set(catId, list);
    }
    return map;
  }, [demos]);

  const orderedCategories = categoryOrder.filter((id) => grouped.has(id));
  const rest = [...grouped.keys()].filter((id) => !categoryOrder.includes(id));
  const allCategories = [...orderedCategories, ...rest];

  if (demos.length === 0) {
    return (
      <p className="py-16 text-center text-text-sub">デモは準備中です。</p>
    );
  }

  return (
    <div className="space-y-10 pb-8 md:space-y-12">
      <section className="rounded-xl border border-silver/20 bg-base-dark/70 p-4 md:p-5">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-text-sub">
              まずは下のカテゴリから、そのまま気になる demo を見ていけます。
            </p>
            <p className="text-xs leading-relaxed text-text-sub/85">
              {appliedAnswers
                ? "直近の条件は、比較の補助として表示しています。条件なしでも一覧はそのまま見られます。"
                : "迷う場合だけ、コンシェルジュで条件を選ぶと近い demo を絞り込めます。"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              recordVisitorEntryIntent("compare");
              requestOpenDemoListPageConcierge({ entryIntent: "compare" });
            }}
            className="rounded-md border border-silver/30 px-3 py-1 text-xs text-text-sub transition-colors hover:border-accent/50 hover:text-accent"
          >
            {appliedAnswers ? "条件を選び直す" : "条件から相談する"}
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

      <div className="py-8 md:py-10">
        <PageSectionDivider variant="inset" />
      </div>

      {allCategories.map((catId) => {
        const items = grouped.get(catId) ?? [];
        const label = CATEGORY_LABELS[catId] ?? catId;
        return (
          <section key={catId}>
            <h2 className="mb-4 text-center text-lg font-bold text-text md:mb-5 md:text-xl">
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

      <DemoListRecommendationPopup
        picks={conciergePicks}
        open={recommendPopupOpen}
        onClose={() => setRecommendPopupOpen(false)}
      />
    </div>
  );
}
