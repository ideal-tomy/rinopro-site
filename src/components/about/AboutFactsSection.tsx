import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { facts } = aboutCopy;

export function AboutFactsSection() {
  return (
    <section className={styles.section} aria-labelledby="about-facts-heading" data-scroll-reveal="group">
      <div className={styles.container + " " + styles.factsColumns}>
        <AboutSectionHeader id="about-facts-heading" kicker={facts.kicker} title={facts.heading} />
        <div className={styles.tableWrap} {...aboutReveal(80)}>
          <table className={styles.factsTable} aria-labelledby="about-facts-heading">
            <tbody>
              {facts.companyRows.map(({ label, value }) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>
                    {label === "連絡先" ? <a href={"mailto:" + value}>{value}</a>
                      : label === "ウェブサイト" ? <a href={value}>{value}</a>
                        : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
