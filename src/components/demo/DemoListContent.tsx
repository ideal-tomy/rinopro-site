"use client";

import Link from "next/link";
import Image from "next/image";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import {
  getCategoryId,
  CATEGORY_LABELS,
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";

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
}: {
  demo: AiDemo | DemoItem;
  className?: string;
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
        "group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/40 md:w-[320px]",
        className
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 280px, 320px"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-silver/10" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <RunModeBadge demo={demo} />
          <h2 className="line-clamp-1 font-semibold text-text group-hover:text-accent">
            {demo.title}
          </h2>
        </div>
        {oneLiner && (
          <p className="mb-3 line-clamp-2 flex-1 text-sm text-text-sub">
            {oneLiner}
          </p>
        )}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {functionTags.slice(0, 2).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-medium",
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
                "rounded-full border px-2 py-0.5 text-xs font-medium",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex h-9 items-center rounded-md border border-silver/30 px-3 text-sm font-medium text-text-sub group-hover:border-accent/50 group-hover:text-accent">
          体験する
        </span>
      </div>
    </Link>
  );
}

interface DemoListContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoListContent({ demos }: DemoListContentProps) {
  if (demos.length === 0) {
    return (
      <p className="py-16 text-center text-text-sub">デモは準備中です。</p>
    );
  }

  const grouped = new Map<string, (AiDemo | DemoItem)[]>();
  for (const demo of demos) {
    const catId = getCategoryId(demo.functionTags);
    const list = grouped.get(catId) ?? [];
    list.push(demo);
    grouped.set(catId, list);
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
  const orderedCategories = categoryOrder.filter((id) => grouped.has(id));
  const rest = [...grouped.keys()].filter((id) => !categoryOrder.includes(id));
  const allCategories = [...orderedCategories, ...rest];

  return (
    <div className="space-y-8 pb-8">
      {allCategories.map((catId) => {
        const items = grouped.get(catId) ?? [];
        const label = CATEGORY_LABELS[catId] ?? catId;
        return (
          <section key={catId}>
            <h2 className="mb-3 text-lg font-bold text-text md:text-xl">
              {label}
            </h2>
            <div
              className={cn(
                "flex gap-4 overflow-x-auto pb-2 scrollbar-thin",
                "snap-x snap-mandatory",
                "scrollbar-track-transparent scrollbar-thumb-silver/30"
              )}
              style={{ scrollbarGutter: "stable" }}
            >
              {items.map((demo) => (
                <DemoCard key={demo._id} demo={demo} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
