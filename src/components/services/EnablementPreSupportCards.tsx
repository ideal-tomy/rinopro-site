"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { preSupportCards } from "./enablement-pre-support-cards-data";
import styles from "./enablement-page.module.css";

const CARD_COUNT = preSupportCards.length;

function scrollTrackTo(
  track: HTMLUListElement,
  index: number,
  behavior: ScrollBehavior,
) {
  const first = track.querySelector<HTMLElement>("li");
  if (!first) return;
  const gap =
    Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) ||
    12;
  const step = first.offsetWidth + gap;
  if (step <= 0) return;
  const clamped = Math.min(CARD_COUNT - 1, Math.max(0, index));
  track.scrollTo({ left: step * clamped, behavior });
}

export function EnablementPreSupportCards() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [carousel, setCarousel] = useState(false);

  const syncIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !carousel) return;
    const first = track.querySelector<HTMLElement>("li");
    if (!first) return;
    const gap =
      Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) ||
      12;
    const step = first.offsetWidth + gap;
    if (step <= 0) return;
    const next = Math.round(track.scrollLeft / step);
    setIndex(Math.min(CARD_COUNT - 1, Math.max(0, next)));
  }, [carousel]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mq = window.matchMedia("(max-width: 1099px)");
    const updateMode = () => {
      setCarousel(mq.matches);
    };
    updateMode();
    mq.addEventListener("change", updateMode);
    track.addEventListener("scroll", syncIndexFromScroll, { passive: true });
    syncIndexFromScroll();
    return () => {
      mq.removeEventListener("change", updateMode);
      track.removeEventListener("scroll", syncIndexFromScroll);
    };
  }, [syncIndexFromScroll]);

  const scrollToIndex = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamped = Math.min(CARD_COUNT - 1, Math.max(0, target));
    scrollTrackTo(track, clamped, reduce ? "auto" : "smooth");
    setIndex(clamped);
  };

  const onSegmentKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    cardIndex: number,
  ) => {
    if (!carousel) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(cardIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(cardIndex + 1);
    }
  };

  const atEnd = index === CARD_COUNT - 1;

  return (
    <div className={styles.preSupport}>
      <p className={styles.preSupportSrOnly}>
        左右にスワイプ、または下の位置表示でカードを切り替えられます。
      </p>
      <div
        className={styles.preSupportTrackWrap}
        data-at-end={atEnd ? "true" : "false"}
      >
        <ul
          ref={trackRef}
          className={styles.preSupportTrack}
          aria-label="確認項目の図解カード"
        >
          {preSupportCards.map(({ title, body, Diagram }) => (
            <li key={title} className={styles.preSupportCard}>
              <div className={styles.preSupportDiagram} aria-hidden>
                <Diagram />
              </div>
              <h3 className={styles.preSupportCardTitle}>{title}</h3>
              <p className={styles.preSupportCardBody}>{body}</p>
            </li>
          ))}
        </ul>
        <div className={styles.preSupportTrackFade} aria-hidden="true" />
      </div>
      <div
        className={styles.preSupportProgress}
        role="tablist"
        aria-label="カードの位置"
      >
        {preSupportCards.map((card, cardIndex) => (
          <button
            key={card.title}
            type="button"
            role="tab"
            className={
              index === cardIndex
                ? styles.preSupportSegmentActive
                : styles.preSupportSegment
            }
            aria-selected={index === cardIndex}
            aria-label={card.title}
            onClick={() => scrollToIndex(cardIndex)}
            onKeyDown={(event) => onSegmentKeyDown(event, cardIndex)}
          />
        ))}
      </div>
    </div>
  );
}
