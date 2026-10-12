"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { preSupportCards } from "./enablement-pre-support-cards-data";
import styles from "./enablement-page.module.css";

const CARD_COUNT = preSupportCards.length;

function leftFor(track: HTMLUListElement, index: number) {
  const cards = track.children;
  const first = cards[0] as HTMLElement;
  const card = cards[index] as HTMLElement;
  return Math.min(track.scrollWidth - track.clientWidth, Math.max(0, card.offsetLeft - first.offsetLeft));
}

export function EnablementPreSupportCards() {
  const trackRef = useRef<HTMLUListElement>(null);
  const current = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const sync = () => {
      if (track.scrollWidth <= track.clientWidth) return;
      let nearest = 0;
      for (let i = 1; i < CARD_COUNT; i++) {
        if (Math.abs(leftFor(track, i) - track.scrollLeft) < Math.abs(leftFor(track, nearest) - track.scrollLeft)) nearest = i;
      }
      current.current = nearest;
      setIndex(nearest);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const resize = new ResizeObserver(() => {
      if (track.scrollWidth > track.clientWidth) {
        track.scrollTo({ left: leftFor(track, current.current), behavior: "instant" });
      }
    });
    track.addEventListener("scroll", onScroll, { passive: true });
    resize.observe(track);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToIndex = (target: number) => {
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth) return;
    const clamped = Math.min(CARD_COUNT - 1, Math.max(0, target));
    track.scrollTo({
      left: leftFor(track, clamped),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, from: number) => {
    if (!trackRef.current || trackRef.current.scrollWidth <= trackRef.current.clientWidth) return;
    const next = event.key === "ArrowLeft" ? from - 1 : event.key === "ArrowRight" ? from + 1 : event.key === "Home" ? 0 : event.key === "End" ? CARD_COUNT - 1 : null;
    if (next === null) return;
    event.preventDefault();
    scrollToIndex(next);
  };

  return (
    <div className={styles.preSupport}>
      <p id="pre-support-instructions" className={styles.preSupportSrOnly}>
        左右にスワイプ、下の位置ボタン、または一覧にフォーカスして左右の矢印キーでカードを切り替えられます。
      </p>
      <div className={styles.preSupportTrackWrap} data-at-end={index === CARD_COUNT - 1 ? "true" : "false"}>
        <ul ref={trackRef} className={styles.preSupportTrack} aria-label="確認項目の図解カード" aria-describedby="pre-support-instructions" tabIndex={0}
          onKeyDown={(event) => { if (event.target === event.currentTarget) onKeyDown(event, current.current); }}>
          {preSupportCards.map(({ title, body, Diagram }) => (
            <li key={title} className={styles.preSupportCard}>
              <div className={styles.preSupportDiagram} aria-hidden><Diagram /></div>
              <h3 className={styles.preSupportCardTitle}>{title}</h3>
              <p className={styles.preSupportCardBody}>{body}</p>
            </li>
          ))}
        </ul>
        <div className={styles.preSupportTrackFade} aria-hidden="true" />
      </div>
      <div className={styles.preSupportProgress} aria-label="カードの位置">
        {preSupportCards.map((card, cardIndex) => (
          <button key={card.title} type="button" className={styles.preSupportSegment}
            aria-current={index === cardIndex ? "true" : undefined} aria-label={`${cardIndex + 1}件目：${card.title}を表示`}
            onClick={() => scrollToIndex(cardIndex)} onKeyDown={(event) => onKeyDown(event, cardIndex)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
