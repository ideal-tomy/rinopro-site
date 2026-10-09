"use client";

import Link from "next/link";
import Image from "next/image";
import { useServicesCardRotation } from "./useServicesCardRotation";
import styles from "./services-page.module.css";

const cards = [
  {
    label: "CONSULTING",
    title: "コンサルティング",
    description: ["何から着手すべきか、", "経営と現場で論点を整理します。"],
    benefits: ["課題の見える化", "優先順位の整理", "実現可能な計画へ"],
    href: "/services/consulting",
    alt: "写真や書類、グラフから課題を集め、優先順位のついた実行計画に整理するイラスト",
  },
  {
    label: "ENABLEMENT",
    title: "半内製化",
    description: ["作って終わらせず、社内で", "改善できる状態へ移行します。"],
    benefits: [
      "社内メンバーと伴走",
      "運用の仕組み作り",
      "継続的な改善サイクル",
    ],
    href: "/services/insourcing-enablement",
    alt: "社内メンバーがパソコンを囲み、開発・運用・改善を繰り返すイラスト",
  },
];

export function ServicesFlipCards() {
  const { display, selectSide, togglePlayback, stage } =
    useServicesCardRotation();

  return (
    <>
      <section
        className={styles.service}
        id="service-card"
        aria-label="コンサルティングと半内製化"
        data-scroll-reveal="group"
      >
        <div
          className={styles.flipStage}
          ref={stage}
          aria-describedby="flip-help"
        >
          <div
            className={styles.flipInner}
            style={{
              transform: display.mobile
                ? `rotateY(${display.angle}deg)`
                : undefined,
              transition: display.reduced ? "none" : undefined,
            }}
          >
            {cards.map((card, i) => (
              <article
                className={`${styles.face} ${i === 1 ? styles.back : ""}`}
                key={card.label}
                aria-labelledby={`service-title-${i}`}
                aria-hidden={display.mobile && display.current !== i}
                inert={display.mobile && display.current !== i}
                data-scroll-reveal="target"
                data-scroll-reveal-on-load="true"
                data-scroll-reveal-threshold="0.35"
                data-scroll-reveal-duration="550"
                data-scroll-reveal-delay={String(i * 120)}
              >
                <p className={styles.eyebrow}>{card.label}</p>
                <h2 id={`service-title-${i}`}>{card.title}</h2>
                <p className={styles.description}>
                  {card.description[0]}
                  <br />
                  {card.description[1]}
                </p>
                <div
                  className={`${styles.illustration} ${i === 1 ? styles.enablement : ""}`}
                >
                  <Image
                    unoptimized
                    src="/images/services/approved/mobile-reference.png"
                    alt={card.alt}
                    width="1264"
                    height="1244"
                    draggable="false"
                  />
                </div>
                <ul className={styles.benefits}>
                  {card.benefits.map((text) => (
                    <li key={text}>
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
                <Link className={styles.serviceCta} href={card.href}>
                  {card.title}を見る <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.flipControls}>
          <span className={styles.swipeHint} id="flip-help">
            横スワイプで回転
          </span>
          {cards.map((card, i) => (
            <button
              className={styles.sideDot}
              type="button"
              key={card.label}
              aria-label={`${card.title}を表示`}
              aria-pressed={display.current === i}
              onClick={() => selectSide.current(i)}
            />
          ))}
          <button
            className={styles.playback}
            type="button"
            aria-label={display.paused ? "自動回転を再開" : "自動回転を停止"}
            onClick={() => togglePlayback.current()}
          >
            {display.paused ? "▶ 再生" : "Ⅱ 停止"}
          </button>
        </div>
        <span className={styles.srOnly} role="status">
          {display.status}
        </span>
      </section>
    </>
  );
}
