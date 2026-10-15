"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  SERVICE_HERO_PROCESS_PAGE_CONFIG,
  SERVICE_HERO_PROCESS_STAGES,
  type ServiceHeroProcessPageKey,
} from "@/lib/content/service-hero-process-stages";
import { ProcessStageIcon } from "./hero-process/ProcessStageIcons";
import styles from "./hero-process-diagram.module.css";

const STAGE_COUNT = SERVICE_HERO_PROCESS_STAGES.length;
const MOBILE_QUERY = "(max-width: 899px)";

function scrollTrackTo(
  track: HTMLOListElement,
  index: number,
  behavior: ScrollBehavior,
) {
  const first = track.querySelector<HTMLLIElement>("li");
  if (!first) return;
  const gap =
    Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) ||
    16;
  const step = first.offsetWidth + gap;
  if (step <= 0) return;
  const clamped = Math.min(STAGE_COUNT - 1, Math.max(0, index));
  track.scrollTo({ left: step * clamped, behavior });
}

export function ServiceHeroProcessDiagram({
  pageKey,
}: {
  pageKey: ServiceHeroProcessPageKey;
}) {
  const highlight = new Set(
    SERVICE_HERO_PROCESS_PAGE_CONFIG[pageKey].highlightedStageIds,
  );
  const startIndex = Math.max(
    0,
    SERVICE_HERO_PROCESS_STAGES.findIndex((stage) => highlight.has(stage.id)),
  );
  const trackRef = useRef<HTMLOListElement>(null);
  const [carousel, setCarousel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const syncIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !carousel) return;
    const first = track.querySelector<HTMLLIElement>("li");
    if (!first) return;
    const gap =
      Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) ||
      16;
    const step = first.offsetWidth + gap;
    if (step <= 0) return;
    const next = Math.round(track.scrollLeft / step);
    setActiveIndex(Math.min(STAGE_COUNT - 1, Math.max(0, next)));
  }, [carousel]);

  const placeAtStart = useCallback(() => {
    const track = trackRef.current;
    if (!track || !window.matchMedia(MOBILE_QUERY).matches) return;
    scrollTrackTo(track, startIndex, "auto");
    setActiveIndex(startIndex);
  }, [startIndex]);

  useLayoutEffect(() => {
    placeAtStart();
  }, [placeAtStart]);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      setCarousel(media.matches);
      if (media.matches) placeAtStart();
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [placeAtStart]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", syncIndexFromScroll, { passive: true });
    syncIndexFromScroll();
    return () => track.removeEventListener("scroll", syncIndexFromScroll);
  }, [carousel, syncIndexFromScroll]);

  const scrollToIndex = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamped = Math.min(STAGE_COUNT - 1, Math.max(0, target));
    scrollTrackTo(track, clamped, reduce ? "auto" : "smooth");
    setActiveIndex(clamped);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (!carousel) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  };

  const atEnd = activeIndex === STAGE_COUNT - 1;

  return (
    <figure className={styles.poster} aria-label="戦略から運用までの5工程">
      <p className={styles.srOnly}>
        左右にスワイプ、または下の位置表示で工程を切り替えられます。
      </p>
      <div
        className={styles.trackWrap}
        data-at-end={atEnd ? "true" : "false"}
      >
        <ol
          ref={trackRef}
          className={styles.columns}
          aria-label="工程一覧"
          tabIndex={carousel ? 0 : undefined}
          onKeyDown={onKeyDown}
        >
          {SERVICE_HERO_PROCESS_STAGES.map((stage, index) => {
            const framed = highlight.has(stage.id);
            return (
              <li
                key={stage.id}
                className={`${styles.col} ${framed ? styles.colFramed : ""}`}
              >
                <div
                  className={`${styles.colHead} ${index < 4 ? styles.colHeadArrow : ""}`}
                >
                  <span className={styles.num}>{stage.id}</span>
                  <span className={styles.colTitle}>{stage.title}</span>
                </div>
                <ProcessStageIcon stageId={stage.id} className={styles.icon} />
                <p className={styles.label}>何をするか</p>
                <ul className={`${styles.list} ${styles.listWhatWeDo}`}>
                  {stage.detail.whatWeDo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={`${styles.label} ${styles.colExtra}`}>なぜ必要か</p>
                <p className={`${styles.body} ${styles.colExtra}`}>
                  {stage.detail.whyNeeded}
                </p>
                <p className={`${styles.label} ${styles.colExtra}`}>
                  お客様から必要な情報
                </p>
                <ul className={`${styles.list} ${styles.colExtra}`}>
                  {stage.detail.clientInfo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
        <div className={styles.trackFade} aria-hidden="true" />
      </div>
      <div
        className={styles.stageProgress}
        role="tablist"
        aria-label="工程の位置"
      >
        {SERVICE_HERO_PROCESS_STAGES.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            role="tab"
            className={
              activeIndex === index ? styles.segmentActive : styles.segment
            }
            aria-selected={activeIndex === index}
            aria-label={`${stage.id}. ${stage.title}`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </figure>
  );
}
