import { HOME_FAQ_STYLES } from "./home-presentation";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { faq } = homeLandingCopy;

export function HomeFaqSection() {
  return (
    <section
      id="faq"
      className={HOME_FAQ_STYLES.section}
      aria-labelledby="home-faq-heading"
    >
      <HomeLandingSectionHeading
        id="home-faq-heading"
        title={faq.heading}
      />
      <ul className={HOME_FAQ_STYLES.list}>
        {faq.items.map((item) => (
          <li
            key={item.q}
            className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
          >
            <details className="group p-1">
              <summary className={HOME_FAQ_STYLES.question}>
                <span className="flex items-start justify-between gap-4">
                  <span>{item.q}</span>
                  <span
                    className={HOME_FAQ_STYLES.chevron}
                    aria-hidden
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <div className={HOME_FAQ_STYLES.answer}>
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
