import Link from "next/link";
import { supportPillars } from "@/lib/content/support-pillars";

export function SupportPillarCards() {
  return (
    <ul className="mt-10 grid list-none gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
      {supportPillars.map((pillar) => (
        <li key={pillar.id} id={pillar.id}>
          <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] md:p-8">
            <p className="text-[12px] font-semibold tracking-[0.16em] text-[var(--color-accent-primary)] md:text-[13px]">
              {pillar.kicker}
            </p>
            <h2 className="mt-3 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold text-text">
              {pillar.title}
            </h2>
            <p className="mt-3 text-[15px] font-medium leading-[1.75] text-text md:text-[16px]">
              {pillar.audience}
            </p>
            <p className="mt-3 text-[16px] leading-[1.8] text-text-sub md:text-[17px]">
              {pillar.lead}
            </p>
            <h3 className="mt-8 text-[13px] font-semibold tracking-[0.12em] text-[var(--color-accent-primary)] md:text-[14px]">
              {pillar.workHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              {pillar.workItems.map((item) => (
                <li key={item.title}>
                  <p className="text-[16px] font-semibold text-text md:text-[17px]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[15px] leading-[1.8] text-text-sub md:text-[16px]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8">
              <Link
                href={pillar.href}
                className="inline-flex text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline md:text-[16px]"
              >
                {pillar.ctaLabel}
              </Link>
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
