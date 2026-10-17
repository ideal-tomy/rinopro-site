"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AxRichParagraph } from "@/components/ui/ax/AxRichParagraph";
import { aboutCopy } from "@/lib/content/site-copy";
import { cn } from "@/lib/utils";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { leaderProfiles } = aboutCopy;
/** Paragraphs shown on mobile before "全文を読む". Desktop always shows the full text. */
const PREVIEW_PARAGRAPHS = 2;

export function AboutLeaderSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.section} aria-labelledby="about-leaders-heading" data-scroll-reveal="group">
      <div className={styles.container}>
        <AboutSectionHeader id="about-leaders-heading" kicker={leaderProfiles.kicker} title={"代表 " + leaderProfiles.profiles[0].name} />
        {leaderProfiles.profiles.map((profile, profileIndex) => {
          const bodyId = `about-leader-body-${profileIndex}`;
          return (
            <div key={profile.title} className={styles.leaderColumns} data-open={expanded}>
              <article {...aboutReveal(80)}>
                <div id={bodyId} className={styles.leaderBody}>
                  {profile.body.map((block, index) => {
                    const more = index >= PREVIEW_PARAGRAPHS ? styles.leaderMore : undefined;
                    return (
                      <AxRichParagraph
                        key={block.text.slice(0, 24)}
                        block={block}
                        className={more}
                        emphasisClassName="font-semibold text-[var(--about-navy)]"
                        quoteClassName={cn(
                          "border-l-[3px] border-[var(--about-blue)] pl-4 font-medium text-[var(--about-navy)]",
                          more,
                        )}
                      />
                    );
                  })}
                </div>
                <button
                  type="button"
                  className={styles.leaderToggle}
                  aria-expanded={expanded}
                  aria-controls={bodyId}
                  onClick={() => setExpanded((open) => !open)}
                >
                  {expanded ? "閉じる" : "全文を読む"}
                  <ChevronDown className={styles.chevron} aria-hidden="true" />
                </button>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
