import {
  CaseStudyArrowRight,
  CaseStudyArrowDown,
  CaseStudyCheck,
} from "@/components/case-studies/case-study-icons";

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
    <div className="relative grid gap-4 md:grid-cols-2 md:gap-6">
      {/* Before */}
      <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] p-6 md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-pure)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
          Before
        </span>
        <p className="mt-3 text-[13px] font-semibold text-[var(--color-text-tertiary)]">
          {beforeTitle}
        </p>
        <p className="mt-3 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
          {beforeBody}
        </p>
      </div>

      {/* 中央の転換インジケータ */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        aria-hidden
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-accent-primary)] shadow-[0_6px_18px_-6px_rgba(38,65,142,0.45)]">
          <CaseStudyArrowRight className="size-5" />
        </span>
      </div>
      <div className="flex justify-center md:hidden" aria-hidden>
        <span className="flex size-9 items-center justify-center rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] text-[var(--color-accent-primary)]">
          <CaseStudyArrowDown className="size-4" />
        </span>
      </div>

      {/* After */}
      <div className="rounded-2xl border border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-primary-light)]/40 p-6 md:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-primary)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bg-pure)]">
          <CaseStudyCheck className="size-3.5" />
          After
        </span>
        <p className="mt-3 text-[13px] font-semibold text-[var(--color-accent-primary)]">
          {afterTitle}
        </p>
        <p className="mt-3 text-[15px] leading-[1.85] text-[var(--color-text-primary)] md:text-[16px]">
          {afterBody}
        </p>
      </div>
    </div>
  );
}
