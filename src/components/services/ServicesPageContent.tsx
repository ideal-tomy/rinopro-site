import Link from "next/link";
import { Search, FileText, CodeXml, Laptop, RefreshCw } from "lucide-react";
import { ServicesFlipCards } from "./ServicesFlipCards";
import { ServicesMenu } from "./ServicesMenu";
import styles from "./services-page.module.css";
const steps = [
  { title: "課題抽出", body: "経営と現場の論点を整理します。", Icon: Search },
  {
    title: "設計",
    body: "何を作るか・何を検証するかを決めます。",
    Icon: FileText,
  },
  {
    title: "試作・実装",
    body: "小さく試してから本実装へ進めます。",
    Icon: CodeXml,
  },
  {
    title: "導入・展開",
    body: "現場に乗る運用設計と関係者への共有まで整えます。",
    Icon: Laptop,
  },
  {
    title: "運用・保守",
    body: "監視と改善サイクルを回し、使われ続ける状態を保ちます。",
    Icon: RefreshCw,
  },
];
export function ServicesPageContent() {
  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        aria-labelledby="services-heading"
        data-scroll-reveal="group"
      >
        <div className={styles.heroInner}>
          <div
            className={styles.heroArt}
            aria-hidden="true"
            data-scroll-reveal="target"
            data-scroll-reveal-on-load="true"
            data-scroll-reveal-threshold="0.35"
            data-scroll-reveal-duration="550"
            data-scroll-reveal-delay="220"
            data-scroll-reveal-axis="x"
          >
            <svg viewBox="0 0 560 250" preserveAspectRatio="xMidYMid meet">
              <image
                href="/images/services/approved/hero.png"
                width="560"
                height="250"
              />
            </svg>
          </div>
          <div className={styles.heroCopy}>
            <p
              className={styles.eyebrow}
              data-scroll-reveal="target"
              data-scroll-reveal-on-load="true"
              data-scroll-reveal-threshold="0.35"
              data-scroll-reveal-duration="500"
            >
              SERVICE
            </p>
            <h1
              id="services-heading"
              data-scroll-reveal="target"
              data-scroll-reveal-on-load="true"
              data-scroll-reveal-threshold="0.35"
              data-scroll-reveal-duration="500"
            >
              ご支援内容
            </h1>
            <p
              data-scroll-reveal="target"
              data-scroll-reveal-on-load="true"
              data-scroll-reveal-threshold="0.35"
              data-scroll-reveal-duration="500"
              data-scroll-reveal-delay="140"
            >
              課題の整理から実装・社内への定着まで、
              <br />
              必要な範囲を同じチームで進めます。
            </p>
          </div>
        </div>
      </section>
      <ServicesFlipCards />
      <ServicesMenu />
      <section
        className={styles.process}
        aria-labelledby="process-heading"
        data-scroll-reveal="group"
      >
        <div className={styles.processInner}>
          <div
            className={styles.processHeading}
            data-scroll-reveal="target"
            data-scroll-reveal-on-load="true"
            data-scroll-reveal-threshold="0.35"
            data-scroll-reveal-duration="500"
          >
            <div>
              <p className={styles.eyebrow}>PROCESS</p>
              <h2 id="process-heading">
                課題の整理から運用まで、
                <br />
                一気通貫でサポートします。
              </h2>
            </div>
          </div>
          <ol className={styles.steps}>
            {steps.map(({ title, body, Icon }, i) => (
              <li
                key={title}
                data-scroll-reveal="target"
                data-scroll-reveal-on-load="true"
                data-scroll-reveal-threshold="0.35"
                data-scroll-reveal-duration="450"
                data-scroll-reveal-delay={String(140 + i * 110)}
              >
                <div className={styles.stepMark}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <Icon aria-hidden="true" size={25} strokeWidth={1.6} />
                  </div>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <div
            className={styles.bottomCta}
            data-scroll-reveal="target"
            data-scroll-reveal-on-load="true"
            data-scroll-reveal-threshold="0.35"
            data-scroll-reveal-duration="400"
            data-scroll-reveal-delay="600"
          >
            <Link href="/contact">
              まずはご相談ください <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
