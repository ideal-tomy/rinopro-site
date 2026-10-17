import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutApproachSection } from "./AboutApproachSection";
import { AboutFactsSection } from "./AboutFactsSection";
import { AboutLeaderSection } from "./AboutLeaderSection";
import { AboutPrinciplesSection } from "./AboutPrinciplesSection";
import { AboutStorySection } from "./AboutStorySection";
import { AboutTeamSection } from "./AboutTeamSection";
import { aboutReveal } from "./about-presentation";
import { AxPhrases } from "@/components/ui/ax/AxPhrases";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import { headingAccentRuleClasses } from "@/lib/ui/heading-accent-rule-styles";
import { cn } from "@/lib/utils";
import styles from "./about-page.module.css";

const { hero, cta } = aboutCopy;
const [heroStart, heroEnd] = hero.headline.split("から、");
const heroSentences = hero.sub.split("。").filter(Boolean);

export function AboutPageContent() {
  return (
    <div className={"ax-page about-page-content " + styles.page} data-ax-theme="corporate">
      <section className={styles.hero} aria-labelledby="about-hero-heading" data-scroll-reveal="group">
        <div className={styles.container}>
          <p className={styles.kicker} {...aboutReveal(0, true)}><span className={styles.desktopOnly}>{hero.kicker}</span><span className={styles.mobileOnly}>AXEONについて</span></p>
          <h1 id="about-hero-heading" className={styles.heroHeading} {...aboutReveal(80, true)}>
            <span className={styles.desktopOnly}><span>{heroStart}から、</span><span>{heroEnd}</span></span>
            <span className={styles.mobileOnly}><span>企業の業務整理から</span><span>システム開発・運用支援まで</span></span>
          </h1>
          <p className={styles.heroBody + " " + styles.body} {...aboutReveal(160, true)}>
            {heroSentences.map((sentence) => (
              <span key={sentence}>
                <AxPhrases phrases={(sentence + "。").split(/(?<=、)/)} />
              </span>
            ))}
          </p>
        </div>
      </section>

      <AboutStorySection />
      <AboutLeaderSection />
      <AboutPrinciplesSection />
      <AboutApproachSection />

      <div className={styles.section}>
        <div className={styles.container + " " + styles.teamFacts}>
          <AboutTeamSection />
          <AboutFactsSection />
        </div>
      </div>

      <section className={styles.contact} aria-labelledby="about-cta-heading" data-scroll-reveal="group">
        <div className={styles.container + " " + styles.contactInner}>
          <h2
            id="about-cta-heading"
            className={cn(styles.contactHeading, headingAccentRuleClasses.onDarkInline)}
            {...aboutReveal()}
          >
            {cta.heading}
          </h2>
          <p className={styles.contactBody} {...aboutReveal(80)}>
            <AxPhrases phrases={cta.sub} />
          </p>
          <div {...aboutReveal(160)}>
            <Button asChild variant="outline" className={styles.button + " " + styles.contactButton}>
              <Link href={cta.primaryHref}>{cta.primaryLabel}<ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
