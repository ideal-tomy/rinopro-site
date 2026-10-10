import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutApproachSection } from "./AboutApproachSection";
import { AboutFactsSection } from "./AboutFactsSection";
import { AboutLeaderSection } from "./AboutLeaderSection";
import { AboutPrinciplesSection } from "./AboutPrinciplesSection";
import { AboutStorySection } from "./AboutStorySection";
import { AboutTeamSection } from "./AboutTeamSection";
import { aboutReveal } from "./about-presentation";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import styles from "./about-page.module.css";

const { hero, cta } = aboutCopy;
const [heroStart, heroEnd] = hero.headline.split("から、");
const heroSentences = hero.sub.split("。").filter(Boolean);

export function AboutPageContent() {
  return (
    <div className={"about-page-content " + styles.page}>
      <section className={styles.hero} aria-labelledby="about-hero-heading" data-scroll-reveal="group">
        <div className={styles.container}>
          <p className={styles.kicker} {...aboutReveal(0, true)}><span className={styles.desktopOnly}>{hero.kicker}</span><span className={styles.mobileOnly}>AXEONについて</span></p>
          <h1 id="about-hero-heading" className={styles.heroHeading} {...aboutReveal(80, true)}>
            <span className={styles.desktopOnly}><span>{heroStart}から、</span><span>{heroEnd}</span></span>
            <span className={styles.mobileOnly}><span>企業の業務整理から</span><span>システム開発・運用支援まで</span></span>
          </h1>
          <p className={styles.heroBody + " " + styles.body} {...aboutReveal(160, true)}>
            {heroSentences.map((sentence) => <span key={sentence}>{sentence}。</span>)}
          </p>
          <svg className={styles.mobileHeroArt} viewBox="0 0 335 130" aria-hidden="true" {...aboutReveal(240, true)}>
            <g fill="none" stroke="#adc5ed" strokeWidth="1.3">
              <path d="M72 40h42q12 0 12 12v22h26M209 74h31q12 0 12-12V39h24M182 96v13h80" />
              <rect x="12" y="18" width="60" height="44" rx="8" fill="#fff" />
              <rect x="152" y="48" width="57" height="48" rx="8" fill="#edf4ff" />
              <rect x="276" y="18" width="47" height="40" rx="7" fill="#fff" />
              <path d="M26 32h31M26 42h24M166 63h29M166 73h24M287 31h25M287 41h18" />
            </g>
            <g fill="#26418e"><circle cx="126" cy="74" r="2.5" /><circle cx="252" cy="39" r="2.5" /><circle cx="262" cy="109" r="2.5" /></g>
          </svg>
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
          <h2 id="about-cta-heading" className={styles.contactHeading} {...aboutReveal()}>{cta.heading}</h2>
          <p className={styles.contactBody} {...aboutReveal(80)}>{cta.sub}</p>
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
