import { HOME_CEO_STYLES } from "./home-presentation";
import Link from "next/link";
import { AxRichParagraph } from "@/components/ui/ax/AxRichParagraph";
import { Button } from "@/components/ui/button";
import { homeLandingCopy } from "@/lib/content/home-landing";
const { ceo } = homeLandingCopy;

export function HomeCeoMessageSection() {
  return (
    <section
      id="ceo"
      className={HOME_CEO_STYLES.section}
      aria-labelledby="home-ceo-message-heading"
    >
      <div className={HOME_CEO_STYLES.intro}>
        <p className={HOME_CEO_STYLES.sectionLabel}>{ceo.heading}</p>
        <h2
          id="home-ceo-message-heading"
          className={HOME_CEO_STYLES.messageHeading}
        >
          {ceo.messageHeadingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className={HOME_CEO_STYLES.identity}>
          <p className={HOME_CEO_STYLES.role}>{ceo.role}</p>
          <p className={HOME_CEO_STYLES.name}>{ceo.name}</p>
        </div>
      </div>

      <div className={HOME_CEO_STYLES.card}>
        <div className={HOME_CEO_STYLES.body}>
          {ceo.message.map((block) => (
            <AxRichParagraph
              key={block.text.slice(0, 24)}
              block={block}
              emphasisClassName={HOME_CEO_STYLES.bodyEmphasis}
              quoteClassName={HOME_CEO_STYLES.quote}
            />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-7">
          <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
