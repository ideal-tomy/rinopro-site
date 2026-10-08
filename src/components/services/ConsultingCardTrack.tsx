"use client";

import { useRef, useState, type ReactNode } from "react";
import styles from "./consulting-page.module.css";

export function ConsultingCardTrack({
  children,
  label,
  titles,
}: {
  children: ReactNode;
  label: string;
  titles: string[];
}) {
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
  return (
    <>
      <div
        ref={track}
        className={styles.cardTrack}
        onScroll={updatePosition}
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {children}
      </div>
      <div className={styles.dots} aria-label={`${label}の表示位置`}>
        {titles.map((title, i) => (
          <button
            key={title}
            type="button"
            aria-label={`${title}を表示`}
            aria-pressed={current === i}
            onClick={() => {
              const element = track.current;
              if (!element) return;
              const first = element.children[0] as HTMLElement;
              const card = element.children[i] as HTMLElement;
              element.scrollTo({
                left: card.offsetLeft - first.offsetLeft,
                behavior: "auto",
              });
            }}
          />
        ))}
      </div>
    </>
  );
}
