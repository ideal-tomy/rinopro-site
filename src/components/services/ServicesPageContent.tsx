import Link from "next/link";
import { Search, FileText, CodeXml, Laptop, RefreshCw } from "lucide-react";
import { ServicesFlipCards } from "./ServicesFlipCards";
import styles from "./services-page.module.css";
const menu = [
  {
    title: "AI業務アプリ開発",
    body: "現場業務を前提に、小さく試してから本実装へ。",
  },
  {
    title: "データ活用基盤",
    body: "散在データを意思決定に使える形へ整えます。",
  },
  {
    title: "現場向けシステム開発",
    body: "建設・製造・介護など業界に合わせた業務ツールを開発。",
  },
  {
    title: "DX戦略設計",
    body: "経営と現場の認識ギャップを縮め、実行計画に落とします。",
  },
];
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
      <section className={styles.hero} aria-labelledby="services-heading">
        <div className={styles.heroInner}>
          <div className={styles.heroArt} aria-hidden="true">
            <svg viewBox="0 0 560 250" preserveAspectRatio="xMidYMid meet">
              <image
                href="/images/services/approved/hero.png"
                width="560"
                height="250"
              />
            </svg>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>SERVICE</p>
            <h1 id="services-heading">ご支援内容</h1>
            <p>
              課題の整理から実装・社内への定着まで、
              <br />
              必要な範囲を同じチームで進めます。
            </p>
          </div>
        </div>
      </section>
      <ServicesFlipCards />
      <section
        className={styles.desktopMenu}
        id="service-menu"
        aria-labelledby="service-menu-heading"
      >
        <div className={styles.menuHeading}>
          <div>
            <p className={styles.eyebrow}>SERVICE MENU</p>
            <h2 id="service-menu-heading">
              目的に合わせて、必要な支援を選べます。
            </h2>
          </div>
        </div>
        <div className={styles.menuGrid}>
          {menu.map((item, i) => (
            <article className={styles.menuCard} key={item.title}>
              <div
                className={styles.menuPhoto}
                style={{
                  backgroundImage: `url(/images/services/approved/menu-${i + 1}.jpg)`,
                }}
                role="img"
                aria-label={
                  [
                    "工業部品と業務画面",
                    "グラフのダッシュボード",
                    "現場のタブレット",
                    "ノートPCと紙のレポート",
                  ][i]
                }
              />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.process} aria-labelledby="process-heading">
        <div className={styles.processHeading}>
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
            <li key={title}>
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
        <div className={styles.bottomCta}>
          <Link href="/contact">
            まずはご相談ください <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
