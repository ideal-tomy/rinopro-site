"use client";

import Link from "next/link";
import { ScrollSavingLink } from "@/components/navigation/ScrollSavingLink";
import { buildExperienceEntryHref } from "@/lib/navigation/experience-entry";
import { useEffectiveReturnTargetForExperience } from "@/hooks/use-current-location";

export interface DemoExploreSuggestion {
  slug: string;
  title: string;
}

interface DemoExploreStickyRailProps {
  /** `?returnTo=` を検証済みにした遷移先（無いときは hub にフォールバック） */
  returnHref?: string | null;
  /** returnHref 無しのときの「体験ハブ」リンク先（既定 `/demo`） */
  hubHref?: string;
  /** demo 一覧（既定 `/demo/list`） */
  listHref?: string;
  suggestions: DemoExploreSuggestion[];
}

/**
 * 体験・ツールdemo 閲覧中に、スクロールしても戻り先と次の候補へ届く固定ナビ。
 * 右下のチャット FAB（z-[80]）より下のレイヤーにし、右に余白を取って重なりを避ける。
 */
export function DemoExploreStickyRail({
  returnHref,
  hubHref = "/demo",
  listHref = "/demo/list",
  suggestions,
}: DemoExploreStickyRailProps) {
  const backTarget = returnHref ?? hubHref;
  const backLabel = returnHref ? "← 元のページへ" : "← 体験ハブ";
  const suggestionReturnBase = useEffectiveReturnTargetForExperience();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[35] border-t border-silver/25 bg-base-dark/92 pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-3 pt-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] backdrop-blur-md pr-16 sm:pr-24 md:pr-28"
      aria-label="デモの次の導線"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-sub md:text-sm">
          <Link
            href={backTarget}
            className="shrink-0 font-medium text-accent underline-offset-2 hover:underline"
          >
            {backLabel}
          </Link>
          <span className="text-silver/40" aria-hidden>
            |
          </span>
          <Link
            href={listHref}
            className="shrink-0 text-text underline-offset-2 hover:text-accent hover:underline"
          >
            demo一覧
          </Link>
        </div>
        {suggestions.length > 0 ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className="shrink-0 text-text-sub">ほかに試す:</span>
            <ul className="flex min-w-0 flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s.slug}>
                  <ScrollSavingLink
                    href={buildExperienceEntryHref(
                      s.slug,
                      suggestionReturnBase
                    )}
                    className="line-clamp-2 max-w-[min(100%,14rem)] rounded-md border border-silver/30 bg-silver/5 px-2 py-1 text-left text-text transition hover:border-accent/40 hover:text-accent sm:max-w-[16rem]"
                    title={s.title}
                  >
                    {s.title}
                  </ScrollSavingLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
