import { FileText, Settings, UsersRound } from "lucide-react";
import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { principles } = aboutCopy;
const icons = [FileText, Settings, UsersRound];

export function AboutPrinciplesSection() {
  return (
    <section id="about-principles" className={styles.section + " " + styles.pale} aria-labelledby="about-principles-heading" data-scroll-reveal="group">
      <div className={styles.container}>
        <AboutSectionHeader id="about-principles-heading" kicker={principles.kicker} title={principles.heading} />
        <ul className={styles.principleGrid}>
          {principles.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <li key={item.index} className={styles.principleCard} {...aboutReveal(80 + index * 80)}>
                <div className={styles.principleTop}>
                  <span className={styles.icon} aria-hidden="true"><Icon /></span>
                  <div>
                    <span className={styles.number}>{item.index}</span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </div>
                <p className={styles.cardBody}>{item.lead}<br />{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
