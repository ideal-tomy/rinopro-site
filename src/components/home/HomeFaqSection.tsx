import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { faq } = homeLandingCopy;

export function HomeFaqSection() {
  return (
    <section
      id="faq"
      className="container mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-faq-heading"
    >
      <HomeLandingSectionHeading
        id="home-faq-heading"
        index={faq.sectionIndex}
        kicker={faq.sectionKicker}
        title={faq.heading}
      />
      <ul className="mx-auto mt-4 max-w-3xl list-none space-y-4">
        {faq.items.map((item) => (
          <li
            key={item.q}
            className="rounded-2xl border border-silver/20 bg-base-dark/40 ring-1 ring-warm/10 ring-inset"
          >
            <details className="group p-1">
              <summary className="cursor-pointer list-none rounded-xl px-5 py-5 text-[17px] font-semibold leading-[1.8] text-white text-balance marker:content-none [&::-webkit-details-marker]:hidden md:px-6 md:py-5 md:text-[18px]">
                <span className="flex items-start justify-between gap-4">
                  <span>{item.q}</span>
                  <span
                    className="mt-0.5 shrink-0 text-accent transition group-open:rotate-180"
                    aria-hidden
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <div className="border-t border-silver/15 px-5 py-5 text-[16px] leading-[1.8] text-white/[0.85] md:px-6 md:text-[17px]">
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
