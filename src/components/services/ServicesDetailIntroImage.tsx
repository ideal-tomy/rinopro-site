import Image from "next/image";
import { cn } from "@/lib/utils";

export type ServicesDetailHighlightMode = "consulting" | "development";

type ServicesDetailIntroImageProps = {
  className?: string;
  /** コンサル: ①② / 開発: ③④⑤ を枠で強調 */
  highlight: ServicesDetailHighlightMode;
};

/** services01.jpg の5列カード領域（%指定・画像比率に追従） */
const STEP_COLUMNS = [
  { step: 1, left: 1.2, width: 18.4 },
  { step: 2, left: 20.8, width: 18.4 },
  { step: 3, left: 40.4, width: 18.4 },
  { step: 4, left: 60.0, width: 18.4 },
  { step: 5, left: 79.6, width: 18.8 },
] as const;

const HIGHLIGHT_REGION = {
  top: 14.2,
  height: 61.8,
} as const;

const HIGHLIGHT_STEPS: Record<ServicesDetailHighlightMode, readonly number[]> = {
  consulting: [1, 2],
  development: [3, 4, 5],
};

/** 図中のネイビーと差別化しつつ、BtoBで警戒色になりにくいアンバー系 */
const HIGHLIGHT_FRAME_CLASS =
  "border-[3px] border-[#ea580c] bg-[#ea580c]/[0.12] shadow-[0_0_0_2px_rgba(234,88,12,0.28),0_6px_18px_-4px_rgba(234,88,12,0.45)]";

const HIGHLIGHT_TEXT_CLASS = "font-semibold text-[#c2410c]";

export function ServicesDetailIntroImage({
  className,
  highlight,
}: ServicesDetailIntroImageProps) {
  const activeSteps = new Set(HIGHLIGHT_STEPS[highlight]);

  return (
    <figure
      className={cn(
        "mx-auto max-w-2xl overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]",
        className
      )}
    >
      <div className="relative w-full">
        <Image
          src="/images/services01.jpg"
          alt="戦略から運用まで一気通貫の開発支援（5段階のプロセス図）"
          width={1200}
          height={675}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {STEP_COLUMNS.map((col) => {
            const isActive = activeSteps.has(col.step);
            return (
              <div
                key={col.step}
                className={cn(
                  "absolute box-border transition-opacity duration-300",
                  isActive
                    ? HIGHLIGHT_FRAME_CLASS
                    : "opacity-0"
                )}
                style={{
                  left: `${col.left}%`,
                  top: `${HIGHLIGHT_REGION.top}%`,
                  width: `${col.width}%`,
                  height: `${HIGHLIGHT_REGION.height}%`,
                }}
              />
            );
          })}
        </div>
      </div>

      <figcaption className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-3 text-center text-[13px] leading-[1.7] text-[var(--color-text-secondary)] md:px-5 md:text-[14px]">
        {highlight === "consulting" ? (
          <>
            <span className={HIGHLIGHT_TEXT_CLASS}>
              ①戦略コンサルティング
            </span>
            <span className="text-[var(--color-text-tertiary)]"> ・ </span>
            <span className={HIGHLIGHT_TEXT_CLASS}>
              ②ITコンサルティング
            </span>
            <span className="text-[var(--color-text-tertiary)]">
              {" "}
              がコンサルティングの主な範囲です
            </span>
          </>
        ) : (
          <>
            <span className={HIGHLIGHT_TEXT_CLASS}>③システム開発</span>
            <span className="text-[var(--color-text-tertiary)]"> ・ </span>
            <span className={HIGHLIGHT_TEXT_CLASS}>④導入・展開</span>
            <span className="text-[var(--color-text-tertiary)]"> ・ </span>
            <span className={HIGHLIGHT_TEXT_CLASS}>⑤運用・保守</span>
            <span className="text-[var(--color-text-tertiary)]">
              {" "}
              が開発の主な範囲です
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
