import { Laptop, UserRound } from "lucide-react";
import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { teamModel } = aboutCopy;
const roles = [
  { ...teamModel.strategyLead, Icon: UserRound },
  { ...teamModel.aiEngineeringLead, Icon: Laptop },
];

export function AboutTeamSection() {
  return (
    <section className={styles.section + " " + styles.pale} aria-labelledby="about-team-heading" data-scroll-reveal="group">
      <div className={styles.container}>
        <div className={styles.teamIntro}>
          <AboutSectionHeader id="about-team-heading" kicker={teamModel.kicker} title={teamModel.heading} />
          <p className={styles.body} {...aboutReveal(80)}>{teamModel.intro}</p>
        </div>
        <ul className={styles.teamGrid}>
          {roles.map(({ title, bullets, Icon }, index) => (
            <li key={title} className={styles.teamCard} {...aboutReveal(160 + index * 80)}>
              <span className={styles.icon} aria-hidden="true"><Icon /></span>
              <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                {bullets.map((body) => <p key={body} className={styles.cardBody}>{body}</p>)}
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.teamFootnote} {...aboutReveal(240)}>{teamModel.footnote}</p>
      </div>
    </section>
  );
}
