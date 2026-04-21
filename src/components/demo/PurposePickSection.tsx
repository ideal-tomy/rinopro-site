"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutGrid } from "lucide-react";
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
import { useCurrentLocationString } from "@/hooks/use-current-location";
import { buildExperienceEntryHref } from "@/lib/navigation/experience-entry";
import { getExperiencePrototypeBySlug } from "@/lib/experience/prototype-registry";
import {
  MockStyleExperienceCard,
  MockStylePurposeCard,
} from "@/components/demo/MockStyleExperienceCard";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function getDemoSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function findDemoForSlug(
  demos: (AiDemo | DemoItem)[] | undefined,
  slug: string
): AiDemo | DemoItem | undefined {
  return demos?.find((d) => getDemoSlug(d) === slug);
}

interface PurposePickSectionProps {
  demos?: (AiDemo | DemoItem)[];
  headingId?: string;
  className?: string;
  /** 見出しの配置。トップは `center` */
  headingAlign?: "start" | "center";
}

export function PurposePickSection({
  demos,
  headingId = "purpose-shortcuts-heading",
  className,
  headingAlign = "start",
}: PurposePickSectionProps) {
  const returnSource = useCurrentLocationString();
  const [openPurposeId, setOpenPurposeId] = useState<string | null>(null);

  const openGroup = DEMO_HUB_PURPOSE_GROUPS.find((g) => g.id === openPurposeId);

  return (
    <>
      <section className={cn(className)} aria-labelledby={headingId}>
        <h2
          id={headingId}
          className={cn(
            "mb-8 text-lg font-semibold text-accent md:mb-10 md:text-xl",
            headingAlign === "center" && "text-center"
          )}
        >
          目的から選ぶ
        </h2>

        <div className="hidden md:grid md:grid-cols-4 md:justify-items-center md:gap-x-10 md:gap-y-10 lg:gap-x-12">
          {DEMO_HUB_PURPOSE_GROUPS.map((group) => (
            <MockStylePurposeCard
              key={group.id}
              variant="grid"
              title={group.title}
              oneLiner={group.description}
              onClick={() => setOpenPurposeId(group.id)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {DEMO_HUB_PURPOSE_GROUPS.map((group) => (
            <MockStylePurposeCard
              key={group.id}
              variant="grid"
              title={group.title}
              oneLiner={group.description}
              onClick={() => setOpenPurposeId(group.id)}
            />
          ))}
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
          className={cn(
            "z-[100] max-h-[85vh] overflow-y-auto rounded-t-2xl border-silver/20 bg-base-dark",
            /* スマホ: 画面下にフル幅のボトムシート（inset-x-0 は variant 既定のまま） */
            "px-4 pb-8 pt-4 sm:px-6",
            /* md〜: コンテナ幅で中央寄せ */
            "md:inset-x-auto md:bottom-0 md:left-1/2 md:right-auto md:w-[min(100%-2rem,72rem)] md:max-w-6xl md:-translate-x-1/2 md:px-6 md:pb-10"
          )}
        >
          {openGroup && (
            <>
              <SheetHeader className="space-y-2 text-left">
                <SheetTitle className="text-[1rem] font-semibold leading-snug text-text md:text-lg">
                  {openGroup.title}
                </SheetTitle>
                <SheetDescription className="text-[13px] leading-relaxed text-text-sub md:text-sm">
                  {openGroup.description}
                </SheetDescription>
              </SheetHeader>
              <p className="mt-4 text-xs leading-relaxed text-text-sub/85 md:text-sm">
                この目的に近い体験だけをまとめています。より広く比べたい場合は、一覧ページで絞り込みもできます。
              </p>
              <ul className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
                {openGroup.experienceSlugs.map((slug) => {
                  const meta = getExperiencePrototypeBySlug(slug);
                  if (!meta) return null;
                  const demo = findDemoForSlug(demos, slug);
                  const oneLiner =
                    demo?.oneLiner ?? demo?.description ?? meta.shortDescription;
                  return (
                    <li key={slug} className="flex justify-center">
                      <MockStyleExperienceCard
                        variant="grid"
                        href={buildExperienceEntryHref(slug, returnSource)}
                        title={meta.title}
                        oneLiner={oneLiner}
                        functionTags={demo?.functionTags}
                        industryTags={demo?.industryTags}
                        className="h-full"
                        onNavigate={() => setOpenPurposeId(null)}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 border-t border-silver/15 pt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`/demo/list?${DEMO_LIST_CONCIERGE_QUERY}`}
                    onClick={() => setOpenPurposeId(null)}
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" aria-hidden />
                    一覧でさらに比較する
                  </Link>
                </Button>
                <p className="mt-2 text-center text-xs text-text-sub">
                  一覧ページでは、業種や用途をまたいで広く探せます。
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
