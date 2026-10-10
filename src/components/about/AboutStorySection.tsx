import { ChartNoAxesColumnIncreasing, FileText, Settings } from "lucide-react";
import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { founding, hero } = aboutCopy;
// Short extracts of the approved copy, rather than new service descriptions.
const highlights = [
  { title: "業務整理", body: hero.sub.split("。")[0] + "。", Icon: FileText },
  { title: "必要な開発", body: "開発が必要な部分は、試作から本実装、運用まで対応します。", Icon: Settings },
  { title: "導入まで対応", body: "業務や課題を整理するだけで終わらず、必要な開発と導入まで対応します。", Icon: ChartNoAxesColumnIncreasing },
];

export function AboutStorySection() {
  return (
    <section className={styles.section + " " + styles.pale} aria-labelledby="about-founding-heading" data-scroll-reveal="group">
      <div className={styles.container + " " + styles.storyColumns}>
        <div>
          <AboutSectionHeader id="about-founding-heading" kicker={founding.kicker} title={founding.heading} />
          <div className={styles.paragraphs + " " + styles.body} {...aboutReveal(80)}>
            {founding.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <ul className={styles.storyCards}>
          {highlights.map(({ title, body, Icon }, index) => (
            <li key={title} className={styles.storyCard} {...aboutReveal(160 + index * 80)}>
              <span className={styles.icon} aria-hidden="true"><Icon /></span>
              <div>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
