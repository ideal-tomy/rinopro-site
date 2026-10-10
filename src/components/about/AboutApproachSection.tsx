import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { approach } = aboutCopy;

export function AboutApproachSection() {
  return (
    <section className={styles.section + " " + styles.approach} aria-labelledby="about-approach-heading" data-scroll-reveal="group">
      <div className={styles.container + " " + styles.approachColumns}>
        <AboutSectionHeader id="about-approach-heading" kicker={approach.kicker} title={approach.heading} />
        <p className={styles.approachBody} {...aboutReveal(80)}>{approach.intro}</p>
        <div {...aboutReveal(160)}>
          <Button asChild variant="outline" className={styles.button + " " + styles.outline}>
            <Link href={approach.servicesLink.href}>{approach.servicesLink.label}<ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
