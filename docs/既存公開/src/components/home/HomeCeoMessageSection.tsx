import { HOME_CEO_STYLES } from "./home-presentation";
import Link from "next/link";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { Button } from "@/components/ui/button";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { ceo } = homeLandingCopy;

export function HomeCeoMessageSection() {
  return (
    <section
      id="ceo"
      className={HOME_CEO_STYLES.section}
      aria-labelledby="home-ceo-heading"
    >
      <HomeLandingSectionHeading
        id="home-ceo-heading"
        title={ceo.heading}
        description={ceo.intro}
      />
      <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 md:p-8">
        <div className="space-y-1">
          <p className={HOME_CEO_STYLES.role}>{ceo.role}</p>
          <p className={HOME_CEO_STYLES.name}>{ceo.name}</p>
        </div>
        <div className="mt-8">
          <h3 className={HOME_CEO_STYLES.heading}>
            {ceo.messageHeading}
          </h3>
          <div className={HOME_CEO_STYLES.body}>
            {ceo.message.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-7">
            <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
