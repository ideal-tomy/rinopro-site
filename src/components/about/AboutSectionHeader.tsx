import { cn } from "@/lib/utils";

export type AboutSectionHeaderProps = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  /** ヒーロー直下など、左寄せレイアウト */
  align?: "center" | "left";
  className?: string;
};

export function AboutSectionHeader({
  id,
  kicker,
  title,
  description,
  align = "center",
  className,
}: AboutSectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <header
      className={cn(
        "mb-8 md:mb-10",
        isCenter ? "mx-auto max-w-4xl text-center" : "max-w-3xl text-left",
        className
      )}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent md:text-[13px]">
        {kicker}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-3 text-balance font-bold leading-tight tracking-tight text-white",
          "text-[clamp(1.75rem,3.8vw,2.5rem)]"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-6 h-px max-w-[120px] bg-gradient-to-r from-transparent via-accent/50 to-transparent md:mt-8",
          isCenter ? "mx-auto" : ""
        )}
        aria-hidden
      />
      {description ? (
        <p
          className={cn(
            "mt-6 text-[16px] leading-[1.8] text-white/[0.82] md:mt-8 md:text-[17px]",
            isCenter ? "mx-auto max-w-[40ch]" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
