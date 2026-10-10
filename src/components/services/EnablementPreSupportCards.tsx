"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { preSupportCards } from "./enablement-pre-support-cards-data";
import styles from "./enablement-page.module.css";

export function EnablementPreSupportCards() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [carousel, setCarousel] = useState(false);

  const syncIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !carousel) return;
    const first = track.querySelector<HTMLElement>("li");
    if (!first) return;
    const gap = 12;
    const step = first.offsetWidth + gap;
    if (step <= 0) return;
    const next = Math.round(track.scrollLeft / step);
    setIndex(Math.min(preSupportCards.length - 1, Math.max(0, next)));
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
    return () => {
      mq.removeEventListener("change", updateMode);
      track.removeEventListener("scroll", syncIndexFromScroll);
    };
  }, [syncIndexFromScroll]);

  const scrollToIndex = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector<HTMLElement>("li");
    if (!first) return;
    const gap = 12;
    const step = first.offsetWidth + gap;
    const clamped = Math.min(preSupportCards.length - 1, Math.max(0, target));
    track.scrollTo({ left: step * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  return (
    <div className={styles.preSupport}>
      {carousel ? (
        <div className={styles.preSupportNav} aria-label="図解カードの移動">
          <button
            type="button"
            className={styles.preSupportNavBtn}
            aria-label="前のカード"
            disabled={index === 0}
            onClick={() => scrollToIndex(index - 1)}
          >
            <ChevronLeft aria-hidden />
          </button>
          <p className={styles.preSupportCounter} aria-live="polite">
            {index + 1} / {preSupportCards.length}
          </p>
          <button
            type="button"
            className={styles.preSupportNavBtn}
            aria-label="次のカード"
            disabled={index === preSupportCards.length - 1}
            onClick={() => scrollToIndex(index + 1)}
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      ) : null}
      <ul
        ref={trackRef}
        className={styles.preSupportTrack}
        tabIndex={carousel ? 0 : undefined}
        onKeyDown={
          carousel
            ? (e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  scrollToIndex(index - 1);
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  scrollToIndex(index + 1);
                }
              }
            : undefined
        }
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
    </div>
  );
}
