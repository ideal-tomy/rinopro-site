"use client";

import { ScrollSavingLink } from "@/components/navigation/ScrollSavingLink";
import { cn } from "@/lib/utils";
import {
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";

export interface MockStyleExperienceCardProps {
  href: string;
  title: string;
  /** 簡潔な説明（2行まで） */
  oneLiner: string;
  functionTags?: string[];
  industryTags?: string[];
  variant?: "rail" | "grid";
  className?: string;
  onNavigate?: () => void;
}

/**
 * タイトル・説明・タグ・体験ボタンの4構成（画像なし）。
 */
export function MockStyleExperienceCard({
  href,
  title,
  oneLiner,
  functionTags = [],
  industryTags = [],
  variant = "rail",
  className,
  onNavigate,
}: MockStyleExperienceCardProps) {
  return (
    <ScrollSavingLink
      href={href}
      onClick={() => onNavigate?.()}
      className={cn(
        "group flex shrink-0 snap-start flex-col rounded-2xl border border-silver/15 bg-base-dark/80 shadow-[0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-action/35 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        variant === "rail"
          ? "w-[min(200px,72vw)] max-w-[220px]"
          : "w-full max-w-[220px] min-h-[200px] justify-between",
        variant === "grid" && "mx-auto",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between p-4 md:p-5">
        <div className="min-h-0 flex-1">
          <h2 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-text group-hover:text-action md:text-[1rem] md:leading-snug">
            {title}
          </h2>
          {oneLiner ? (
            <p className="line-clamp-2 text-[13px] leading-relaxed text-text-sub/95 md:text-sm md:leading-relaxed">
              {oneLiner}
            </p>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
          {functionTags.slice(0, 1).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide md:text-[11px]",
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
                "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide md:text-[11px]",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-silver/25 bg-base-dark/50 text-[13px] font-medium text-text-sub transition-colors group-hover:border-action/45 group-hover:text-action md:h-10 md:text-sm">
          体験する
        </span>
      </div>
    </ScrollSavingLink>
  );
}

export interface MockStylePurposeCardProps {
  title: string;
  oneLiner: string;
  onClick: () => void;
  variant?: "rail" | "grid";
  className?: string;
}

export function MockStylePurposeCard({
  title,
  oneLiner,
  onClick,
  variant = "rail",
  className,
}: MockStylePurposeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex shrink-0 snap-start flex-col rounded-2xl border border-silver/15 bg-base-dark/80 text-left shadow-[0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-action/35 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        variant === "rail"
          ? "w-[min(200px,72vw)] max-w-[220px]"
          : "w-full max-w-[220px] min-h-[200px] justify-between",
        variant === "grid" && "mx-auto",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between p-4 md:p-5">
        <div className="min-h-0 flex-1">
          <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-text group-hover:text-action md:text-[1rem]">
            {title}
          </h3>
          <p className="line-clamp-2 text-[13px] leading-relaxed text-text-sub/95 md:text-sm md:leading-relaxed">
            {oneLiner}
          </p>
        </div>
        <span className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-silver/25 bg-base-dark/50 text-[13px] font-medium text-text-sub transition-colors group-hover:border-action/45 group-hover:text-action md:h-10 md:text-sm">
          候補を開く
        </span>
      </div>
    </button>
  );
}
