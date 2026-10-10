import { aboutCopy } from "@/lib/content/site-copy";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { founding, hero } = aboutCopy;
// Short extracts of the approved copy, rather than new service descriptions.
const highlights = [
  { title: "業務整理", body: hero.sub.split("。")[0] + "。" },
  { title: "必要な開発", body: "開発が必要な部分は、試作から本実装、運用まで対応します。" },
  { title: "導入まで対応", body: "業務や課題を整理するだけで終わらず、必要な開発と導入まで対応します。" },
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
        <ol className={styles.timeline}>
          {highlights.map(({ title, body }, index) => (
            <li key={title} className={styles.timelineItem} {...aboutReveal(160 + index * 80)}>
              <span className={styles.timelineNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.timelineTitle}>{title}</h3>
                <p className={styles.timelineBody}>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
