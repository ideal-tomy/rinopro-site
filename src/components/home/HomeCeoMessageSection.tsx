import { HOME_CEO_STYLES } from "./home-presentation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeLandingCopy } from "@/lib/content/home-landing";
const { ceo } = homeLandingCopy;

function renderWithEmphasis(text: string, emphasis?: string, emphasisClass?: string) {
  if (!emphasis || !text.includes(emphasis)) {
    return text;
  }
  const [before, after] = text.split(emphasis);
  return (
    <>
      {before}
      <span className={emphasisClass}>{emphasis}</span>
      {after}
    </>
  );
}

export function HomeCeoMessageSection() {
  return (
    <section
      id="ceo"
      className={HOME_CEO_STYLES.section}
      aria-labelledby="home-ceo-message-heading"
    >
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

      <div className={HOME_CEO_STYLES.card}>
        <div className={HOME_CEO_STYLES.body}>
          {ceo.message.map((block) => {
            if ("variant" in block && block.variant === "quote") {
              return (
                <p key={block.text.slice(0, 24)} className={HOME_CEO_STYLES.quote}>
                  {block.text}
                </p>
              );
            }
            const emphasis = "emphasis" in block ? block.emphasis : undefined;
            return (
              <p key={block.text.slice(0, 24)}>
                {renderWithEmphasis(
                  block.text,
                  emphasis,
                  HOME_CEO_STYLES.bodyEmphasis,
                )}
              </p>
            );
          })}
        </div>
        <Button asChild variant="outline" className="mt-7">
          <Link href={ceo.profileHref}>{ceo.profileLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
