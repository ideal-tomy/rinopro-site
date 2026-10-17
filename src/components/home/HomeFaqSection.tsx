import { ChevronDown } from "lucide-react";
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
          <li key={item.q} className={HOME_FAQ_STYLES.card}>
            <details className="group">
              <summary className={HOME_FAQ_STYLES.question}>
                <span className={HOME_FAQ_STYLES.qMark} aria-hidden="true">
                  Q
                </span>
                <span className={HOME_FAQ_STYLES.questionText}>{item.q}</span>
                <ChevronDown
                  className={HOME_FAQ_STYLES.chevron}
                  aria-hidden="true"
                  strokeWidth={2.25}
                />
              </summary>
              <div className={HOME_FAQ_STYLES.answer}>
                <span className={HOME_FAQ_STYLES.aMark} aria-hidden="true">
                  A
                </span>
                <p className={HOME_FAQ_STYLES.answerText}>{item.a}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
