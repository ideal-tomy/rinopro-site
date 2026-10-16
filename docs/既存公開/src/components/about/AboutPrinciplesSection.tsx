import { aboutCopy } from "@/lib/content/site-copy";
import { AboutDisclosure } from "./AboutDisclosure";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { principles } = aboutCopy;

export function AboutPrinciplesSection() {
  return (
    <section id="about-principles" className={styles.section + " " + styles.pale} aria-labelledby="about-principles-heading" data-scroll-reveal="group">
      <div className={styles.container}>
        <AboutSectionHeader id="about-principles-heading" kicker={principles.kicker} title={principles.heading} />
        <ul className={styles.principleGrid}>
          {principles.items.map((item, index) => (
            <li key={item.index} className={styles.principleItem} {...aboutReveal(80 + index * 80)}>
              <AboutDisclosure
                id={`about-principle-${item.index}`}
                headingClassName={styles.principleTitle}
                summary={<><span className={styles.bigNumber} aria-hidden="true">{item.index}</span><span>{item.title}</span></>}
              >
                <p className={styles.principleBody}>{item.lead}<br />{item.body}</p>
              </AboutDisclosure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
