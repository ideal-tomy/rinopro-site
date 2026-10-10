import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutApproachSection } from "./AboutApproachSection";
import { AboutFactsSection } from "./AboutFactsSection";
import { AboutPrinciplesSection } from "./AboutPrinciplesSection";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { AboutStorySection } from "./AboutStorySection";
import { AboutTeamSection } from "./AboutTeamSection";
import { aboutReveal } from "./about-presentation";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import styles from "./about-page.module.css";

const { hero, leaderProfiles, cta } = aboutCopy;
const [heroStart, heroEnd] = hero.headline.split("から、");
const heroSentences = hero.sub.split("。").filter(Boolean);

function HeroDiagram() {
  return (
    <div className={styles.heroDiagram} aria-hidden="true" {...aboutReveal(240, true)}>
      <svg className={styles.diagramLines} viewBox="0 0 500 310" fill="none">
        <path d="M85 218V141Q85 121 105 121H166V62Q166 43 185 43H357M162 219H273Q296 219 296 196V145M322 139H406Q429 139 429 164V218Q429 238 409 238H338" stroke="#aac3f4" strokeWidth="1.5" />
        <circle cx="357" cy="43" r="3" fill="currentColor" />
        <circle cx="273" cy="219" r="3" fill="currentColor" />
        <circle cx="429" cy="164" r="3" fill="currentColor" />
      </svg>
      <span className={styles.diagramCard + " " + styles.diagramFirst} />
      <span className={styles.diagramCard + " " + styles.diagramSecond} />
      <span className={styles.diagramCard + " " + styles.diagramThird} />
      <span className={styles.diagramSquare + " " + styles.squareOne} />
      <span className={styles.diagramSquare + " " + styles.squareTwo} />
      <span className={styles.diagramDots} />
    </div>
  );
}

export function AboutPageContent() {
  return (
    <div className={"about-page-content " + styles.page}>
      <section className={styles.hero} aria-labelledby="about-hero-heading" data-scroll-reveal="group">
        <div className={styles.container + " " + styles.heroColumns}>
          <div>
            <p className={styles.kicker} {...aboutReveal(0, true)}>{hero.kicker}</p>
            <h1 id="about-hero-heading" className={styles.heroHeading} {...aboutReveal(80, true)}>
              <span>{heroStart}から、</span><span>{heroEnd}</span>
            </h1>
            <p className={styles.heroBody + " " + styles.body} {...aboutReveal(160, true)}>
              {heroSentences.map((sentence) => <span key={sentence}>{sentence}。</span>)}
            </p>
          </div>
          <HeroDiagram />
        </div>
      </section>

      <AboutStorySection />

      <section className={styles.section} aria-labelledby="about-leaders-heading" data-scroll-reveal="group">
        <div className={styles.container}>
          <AboutSectionHeader id="about-leaders-heading" kicker={leaderProfiles.kicker} title={leaderProfiles.heading} />
          {leaderProfiles.profiles.map((profile) => (
            <div key={profile.title} className={styles.leaderColumns}>
              <article {...aboutReveal(80)}>
                <div className={styles.leaderIdentity}>
                  <p className={styles.leaderRole}>{profile.title}</p>
                  <p className={styles.leaderName}>{profile.name}</p>
                </div>
                <div className={styles.leaderBody}>
                  {profile.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
              <blockquote className={styles.quote} {...aboutReveal(160)}>
                <p className={styles.quoteText}>{profile.body[3]}</p>
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      <AboutPrinciplesSection />
      <AboutApproachSection />
      <AboutTeamSection />
      <AboutFactsSection />

      <section className={styles.contact} aria-labelledby="about-cta-heading" data-scroll-reveal="group">
        <div className={styles.container + " " + styles.contactColumns}>
          <AboutSectionHeader id="about-cta-heading" title={cta.heading} />
          <div className={styles.contactContent}>
            <p className={styles.body} {...aboutReveal(80)}>{cta.sub}</p>
            <div className={styles.contactButtons} {...aboutReveal(160)}>
              <Button asChild className={styles.button + " " + styles.primary}>
                <Link href={cta.primaryHref}>{cta.primaryLabel}<ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="outline" className={styles.button + " " + styles.outline}>
                <Link href={cta.secondaryHref}>{cta.secondaryLabel}<ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
