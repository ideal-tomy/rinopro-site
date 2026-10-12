"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_QUERY = "(max-width: 899px)";
/** カードが画面内にほぼ全体表示されたタイミング */
const VISIBLE_RATIO = 0.88;
/** 画面外に出たとみなす比率（ここまで下がったら再度スクロール自動めくりを許可） */
const RESET_RATIO = 0.25;
/** CSS のフリップ transition と揃える */
const FLIP_MS = 1500;

type AboutTeamCardFlipOptions = {
  /** 「{title}の〇〇を表示」の〇〇。既定は担当内容 */
  detailPhrase?: string;
  /** 画面幅に関わらず反転を許可（フリップボタン用） */
  interactiveOnAllViewports?: boolean;
  /** カード全体のタップで反転しない（ボタン操作のみ） */
  flipTriggerButtonOnly?: boolean;
  /** スクロール連動の自動めくりを無効化 */
  disableScrollFlip?: boolean;
  /** 自動めくりの intersectionRatio しきい値（既定 0.88） */
  scrollFlipVisibleRatio?: number;
};

export function useAboutTeamCardFlip(
  title: string,
  options?: AboutTeamCardFlipOptions,
) {
  const detailPhrase = options?.detailPhrase ?? "担当内容";
  const interactiveOnAllViewports =
    options?.interactiveOnAllViewports ?? false;
  const flipTriggerButtonOnly = options?.flipTriggerButtonOnly ?? false;
  const disableScrollFlip = options?.disableScrollFlip ?? false;
  const scrollFlipVisibleRatio =
    options?.scrollFlipVisibleRatio ?? VISIBLE_RATIO;
  const stage = useRef<HTMLDivElement>(null);
  const selectSide = useRef<(side: number) => void>(() => {});
  const [display, setDisplay] = useState({
    current: 0,
    angle: 0,
    mobile: true,
    reduced: false,
    status: "",
  });

  useEffect(() => {
    const element = stage.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia(MOBILE_QUERY);
    let current = 0;
    let angle = 0;
    let busy = false;
    let allowScrollFlip = true;
    let finish: ReturnType<typeof setTimeout> | undefined;

    const publish = (status = "") =>
      setDisplay({
        current,
        angle,
        mobile: mobile.matches,
        reduced: motion.matches,
        status,
      });

    const canFlip = () =>
      interactiveOnAllViewports || mobile.matches;

    const flipTo = (side: number, status = "") => {
      if (busy || !canFlip() || side === current) return;
      busy = true;
      current = side;
      angle += 180;
      publish(status);
      clearTimeout(finish);
      finish = setTimeout(() => {
        busy = false;
      }, motion.matches ? 0 : FLIP_MS);
    };

    const onTap = () => {
      if (flipTriggerButtonOnly || busy || !canFlip()) return;
      const next = 1 - current;
      if (next === 0) allowScrollFlip = false;
      flipTo(
        next,
        next === 0
          ? `${title}の表面を表示`
          : `${title}の${detailPhrase}を表示`,
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!mobile.matches || busy) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onTap();
    };

    selectSide.current = (side) => {
      if (side === 0) allowScrollFlip = false;
      flipTo(
        side,
        side === 0
          ? `${title}の表面を表示`
          : `${title}の${detailPhrase}を表示`,
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (disableScrollFlip || !mobile.matches || motion.matches) return;
        const ratio = entry.intersectionRatio;
        if (ratio < RESET_RATIO) {
          allowScrollFlip = true;
          return;
        }
        if (
          ratio >= scrollFlipVisibleRatio &&
          current === 0 &&
          allowScrollFlip
        ) {
          flipTo(1, `${title}の${detailPhrase}を表示`);
        }
      },
      {
        threshold: [0, RESET_RATIO, scrollFlipVisibleRatio, 1].filter(
          (v, i, a) => a.indexOf(v) === i,
        ),
      },
    );

    const onViewportChange = () => publish();
    const onMotionChange = () => publish();

    observer.observe(element);
    if (!flipTriggerButtonOnly) {
      element.addEventListener("click", onTap);
      element.addEventListener("keydown", onKeyDown);
    }
    mobile.addEventListener("change", onViewportChange);
    motion.addEventListener("change", onMotionChange);
    publish();

    return () => {
      clearTimeout(finish);
      observer.disconnect();
      if (!flipTriggerButtonOnly) {
        element.removeEventListener("click", onTap);
        element.removeEventListener("keydown", onKeyDown);
      }
      mobile.removeEventListener("change", onViewportChange);
      motion.removeEventListener("change", onMotionChange);
    };
  }, [
    title,
    detailPhrase,
    interactiveOnAllViewports,
    flipTriggerButtonOnly,
    disableScrollFlip,
    scrollFlipVisibleRatio,
  ]);

  const toggleFlip = () => {
    const next = 1 - display.current;
    selectSide.current(next);
  };

  return { display, selectSide, toggleFlip, stage };
}
