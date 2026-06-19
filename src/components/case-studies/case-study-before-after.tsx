import { CaseStudyArrowDown } from "@/components/case-studies/case-study-icons";

type CaseStudyBeforeAfterProps = {
  beforeTitle: string;
  beforeBody: string;
  afterTitle: string;
  afterBody: string;
};

export function CaseStudyBeforeAfter({
  beforeTitle,
  beforeBody,
  afterTitle,
  afterBody,
}: CaseStudyBeforeAfterProps) {
  return (
    <div className="border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
      <div className="border-b border-[var(--color-border-light)] px-6 py-8 md:px-10 md:py-10">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] md:text-[12px]">
          {beforeTitle}
        </p>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.85] text-[var(--color-text-primary)] md:text-[18px]">
          {beforeBody}
        </p>
      </div>
      <div
        className="flex items-center gap-3 border-b border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-6 py-3 md:px-10"
        aria-hidden
      >
        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-primary)]">
          shift
        </span>
        <CaseStudyArrowDown className="size-4 text-[var(--color-accent-primary)]" />
      </div>
      <div className="px-6 py-8 md:px-10 md:py-10">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-primary)] md:text-[12px]">
          {afterTitle}
        </p>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.85] text-[var(--color-text-primary)] md:text-[18px]">
          {afterBody}
        </p>
      </div>
    </div>
  );
}
