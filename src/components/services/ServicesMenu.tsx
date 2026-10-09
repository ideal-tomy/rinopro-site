"use client";

import { useRef, useState } from "react";
import styles from "./services-page.module.css";

const items = [
  {
    title: "AI業務アプリ開発",
    body: "現場業務を前提に、小さく試してから本実装へ。",
    alt: "工業部品と業務画面",
  },
  {
    title: "データ活用基盤",
    body: "散在データを意思決定に使える形へ整えます。",
    alt: "グラフのダッシュボード",
  },
  {
    title: "現場向けシステム開発",
    body: "建設・製造・介護など業界に合わせた業務ツールを開発。",
    alt: "現場のタブレット",
  },
  {
    title: "DX戦略設計",
    body: "経営と現場の認識ギャップを縮め、実行計画に落とします。",
    alt: "ノートPCと紙のレポート",
  },
];

export function ServicesMenu() {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  function updatePosition() {
    const element = track.current;
    if (!element) return;
    const cards = Array.from(element.children) as HTMLElement[];
    const positions = cards.map((card) =>
      Math.abs(card.offsetLeft - cards[0].offsetLeft - element.scrollLeft),
    );
    setCurrent(positions.indexOf(Math.min(...positions)));
  }

  function select(index: number) {
    const element = track.current;
    if (!element) return;
    const first = element.children[0] as HTMLElement;
    const card = element.children[index] as HTMLElement;
    element.scrollTo({
      left: card.offsetLeft - first.offsetLeft,
      behavior: "auto",
    });
  }

  return (
    <section
      className={styles.desktopMenu}
      id="service-menu"
      aria-labelledby="service-menu-heading"
      data-scroll-reveal="group"
    >
      <div className={styles.menuInner}>
        <div
          className={styles.menuHeading}
          data-scroll-reveal="target"
          data-scroll-reveal-on-load="true"
          data-scroll-reveal-threshold="0.35"
          data-scroll-reveal-duration="500"
        >
          <div>
            <p className={styles.eyebrow}>SERVICE MENU</p>
            <h2 id="service-menu-heading">
              目的に合わせて、必要な支援を選べます。
            </h2>
          </div>
        </div>
        <div
          className={styles.menuGrid}
          ref={track}
          onScroll={updatePosition}
          tabIndex={0}
          role="region"
          aria-label="4つの支援内容。横にスクロールできます"
          data-scroll-reveal="group"
        >
          {items.map((item, i) => (
            <article
              className={styles.menuCard}
              key={item.title}
              data-scroll-reveal="target"
              data-scroll-reveal-on-load="true"
              data-scroll-reveal-threshold="0.35"
              data-scroll-reveal-duration="480"
              data-scroll-reveal-delay={String(i * 55)}
            >
              <div
                className={styles.menuPhoto}
                style={{
                  backgroundImage: `url(/images/services/approved/menu-${i + 1}.jpg)`,
                }}
                role="img"
                aria-label={item.alt}
              />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.menuDots} aria-label="紹介カードの表示位置">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`${item.title}を表示`}
              aria-pressed={current === i}
              onClick={() => select(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
