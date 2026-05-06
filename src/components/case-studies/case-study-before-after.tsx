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
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]/80 p-6 md:p-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-tertiary)] md:text-[14px]">
          {beforeTitle}
        </p>
        <p className="mt-4 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
          {beforeBody}
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--color-accent-primary)]/25 bg-[var(--color-accent-primary-light)]/35 p-6 md:p-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-primary)] md:text-[14px]">
          {afterTitle}
        </p>
        <p className="mt-4 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
          {afterBody}
        </p>
      </div>
    </div>
  );
}
