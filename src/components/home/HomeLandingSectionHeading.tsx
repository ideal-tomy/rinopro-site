import { HOME_SECTION_HEADING_STYLES } from "./home-presentation";
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
    <header className={cn(HOME_SECTION_HEADING_STYLES.container, className)}>
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
          HOME_SECTION_HEADING_STYLES.title,
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
        <p className={HOME_SECTION_HEADING_STYLES.description}>
          {description}
        </p>
      ) : null}
    </header>
  );
}
