import { V1_FLAGSHIP_INDUSTRY_BADGES } from "@/lib/content/experience-gallery";

export function ShowcaseIndustryBreadth() {
  return (
    <div className="mt-8 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-5 py-5 text-center md:px-8 md:py-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        aria-label="おすすめデモの業種"
      >
        {V1_FLAGSHIP_INDUSTRY_BADGES.map((label) => (
          <span
            key={label}
            className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-3 py-1 text-[13px] font-medium text-[var(--color-text-secondary)] md:text-[14px]"
          >
            {label}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
        課題の型は業種ごとに違っても、整理→試作→定着の進め方は共通です。
      </p>
    </div>
  );
}
