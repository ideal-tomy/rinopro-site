"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DEMO_HUB_PURPOSE_GROUPS,
  DEMO_LIST_CONCIERGE_QUERY,
} from "@/lib/demo/demo-hub-sections";
import { getExperiencePrototypeBySlug } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

interface PurposePickSectionProps {
  headingId?: string;
  className?: string;
}

/**
 * 「目的から選ぶ」4目的。PCは4列、スマホは横スクロール。タップで最大3デモをシート表示。
 */
export function PurposePickSection({
  headingId = "purpose-shortcuts-heading",
  className,
}: PurposePickSectionProps) {
  const [openPurposeId, setOpenPurposeId] = useState<string | null>(null);

  const openGroup = DEMO_HUB_PURPOSE_GROUPS.find((g) => g.id === openPurposeId);

  return (
    <>
      <section className={cn(className)} aria-labelledby={headingId}>
        <div className="mb-6">
          <h2
            id={headingId}
            className="text-lg font-semibold text-accent md:text-xl"
          >
            目的から選ぶ
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-sub md:text-[1rem]">
            業務のゴールに近い目的を選ぶと、おすすめの体験を最大3件ご案内します。
          </p>
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-4 md:gap-5">
          {DEMO_HUB_PURPOSE_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setOpenPurposeId(group.id)}
              className="group rounded-xl border border-silver/25 bg-base-dark/50 p-5 text-left transition-colors hover:border-accent/40"
            >
              <h3 className="text-[1rem] font-semibold text-text group-hover:text-accent md:text-lg">
                {group.title}
              </h3>
              <p className="mt-2 text-sm text-text-sub">{group.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                おすすめを見る
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 md:hidden">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
            aria-label="目的別の一覧（横スクロール）"
          >
            {DEMO_HUB_PURPOSE_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setOpenPurposeId(group.id)}
                className="group min-w-[min(100vw-3rem,18rem)] shrink-0 snap-start rounded-xl border border-silver/25 bg-base-dark/50 p-5 text-left transition-colors hover:border-accent/40"
              >
                <h3 className="text-[1rem] font-semibold text-text group-hover:text-accent">
                  {group.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-text-sub">
                  {group.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  おすすめを見る
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Sheet
        open={openPurposeId !== null}
        onOpenChange={(o) => {
          if (!o) setOpenPurposeId(null);
        }}
      >
        <SheetContent
          side="bottom"
          overlayClassName="z-[100]"
          className="z-[100] max-h-[85vh] overflow-y-auto rounded-t-2xl border-silver/25 bg-base-dark"
        >
          {openGroup && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-text">{openGroup.title}</SheetTitle>
                <SheetDescription>{openGroup.description}</SheetDescription>
              </SheetHeader>
              <ul className="mt-6 space-y-4">
                {openGroup.experienceSlugs.map((slug) => {
                  const meta = getExperiencePrototypeBySlug(slug);
                  if (!meta) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/experience/${slug}`}
                        className="block rounded-lg border border-silver/25 bg-base-dark/80 p-4 transition-colors hover:border-accent/40"
                        onClick={() => setOpenPurposeId(null)}
                      >
                        <span className="font-semibold text-text">
                          {meta.title}
                        </span>
                        <p className="mt-1 text-sm text-text-sub">
                          {meta.shortDescription}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent">
                          体験ページへ
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 border-t border-silver/20 pt-4">
                <Button
                  variant="outline"
                  className="w-full border-accent/40 text-accent hover:bg-accent/10"
                  asChild
                >
                  <Link
                    href={`/demo/list?${DEMO_LIST_CONCIERGE_QUERY}`}
                    onClick={() => setOpenPurposeId(null)}
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" aria-hidden />
                    その他のdemo（一覧で絞り込み）
                  </Link>
                </Button>
                <p className="mt-2 text-center text-xs text-text-sub">
                  モック一覧が開き、選択式の案内が表示されます。
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
