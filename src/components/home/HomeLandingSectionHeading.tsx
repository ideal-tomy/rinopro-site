import { cn } from "@/lib/utils";

/** トップ LP 共通：ナンバー・キッカー・大見出し（白・太字）・アクセント下線・リード */
export type HomeLandingSectionHeadingProps = {
  id: string;
  /** 例: "01" */
  index: string;
  /** 見出し直上の小さなラベル（アクセント色） */
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
};

export function HomeLandingSectionHeading({
  id,
  index,
  kicker,
  title,
  description,
  className,
}: HomeLandingSectionHeadingProps) {
  return (
    <header className={cn("mx-auto mb-14 max-w-4xl text-center md:mb-20", className)}>
      <p
        className="font-mono text-[32px] font-light tabular-nums tracking-[0.2em] text-accent/55 md:text-[36px] lg:text-[40px]"
        aria-hidden="true"
      >
        {index}
      </p>
      {kicker ? (
        <p className="mt-2 text-[13px] font-semibold tracking-[0.15em] text-accent md:text-sm">
          {kicker}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "text-balance text-[clamp(1.75rem,4.6vw,3rem)] font-bold leading-[1.18] tracking-tight text-white md:text-[clamp(2rem,4vw,3rem)] lg:text-[clamp(2.25rem,3.6vw,3rem)]",
          kicker ? "mt-2" : "mt-3"
        )}
      >
        {title}
      </h2>
      <div
        className="mx-auto mt-6 h-[3px] w-14 rounded-full bg-accent shadow-[0_0_18px_-2px_color-mix(in_srgb,var(--color-action)_55%,transparent)] md:mt-7"
        aria-hidden
      />
      {description ? (
        <p className="mx-auto mt-8 max-w-[40ch] text-[17px] leading-[1.8] text-white/[0.85] md:mt-10 md:text-[18px]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
