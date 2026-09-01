import { cn } from "@/lib/utils";

/** トップ LP 共通：大見出し・アクセント下線・リード。番号・キッカーは任意 */
export type HomeLandingSectionHeadingProps = {
  id: string;
  /** 例: "01"。未指定なら出さない */
  index?: string;
  /** 見出し直上の小さなラベル。未指定なら出さない */
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
      {index ? (
        <p
          className="font-mono text-[32px] font-light tabular-nums tracking-[0.2em] text-[var(--color-accent-primary)]/50 md:text-[36px] lg:text-[40px]"
          aria-hidden="true"
        >
          {index}
        </p>
      ) : null}
      {kicker ? (
        <p
          className={cn(
            "text-[13px] font-semibold tracking-[0.15em] text-[var(--color-accent-primary)] md:text-sm",
            index ? "mt-2" : null
          )}
        >
          {kicker}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "whitespace-pre-line text-balance text-[clamp(1.75rem,4.6vw,3rem)] font-bold leading-[1.18] tracking-tight text-[var(--color-text-primary)] md:text-[clamp(2rem,4vw,3rem)] lg:text-[clamp(2.25rem,3.6vw,3rem)]",
          index || kicker ? "mt-2" : null
        )}
      >
        {title}
      </h2>
      <div
        className="mx-auto mt-6 h-[3px] w-14 rounded-full bg-[var(--color-accent-primary)] md:mt-7"
        aria-hidden
      />
      {description ? (
        <p className="mx-auto mt-8 max-w-[40ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:mt-10 md:text-[18px]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
