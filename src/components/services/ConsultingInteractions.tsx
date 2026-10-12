"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./consulting-page.module.css";
import cases from "./consulting-mobile-cases.module.css";

const examples = [
  {
    label: "部門間の二重入力",
    title: "同じ情報を何度も入力している。",
    titleDesktopLines: ["同じ情報を", "何度も入力している。"],
    titleMobileLines: ["同じ情報を", "何度も入力している。"],
    conclusion: "入力を減らすために、どこから変えるか",
    conclusionMobileLines: ["入力を減らすために", "どこから変えるか"],
    body: "情報の流れと入力が重複する箇所を確認し、システム連携、一部業務の変更、全体の入れ替えを比較します。",
  },
  {
    label: "AI導入の検討",
    title: "AIを、どの業務に使えばいいか。",
    titleDesktopLines: ["AIを", "どの業務に使えばいいか。"],
    titleMobileLines: ["AIを", "どの業務に使えばいいか。"],
    conclusion: "試す業務の範囲と効果の確かめ方",
    conclusionMobileLines: ["試す業務の範囲と", "効果の確かめ方"],
    body: "対象業務、使う情報、人による確認箇所を整理し、AIの利用や既存ツールの設定変更、業務手順の見直しを比較します。",
  },
  {
    label: "既存システムの見直し",
    title: "今のシステムを、どこまで変えるか。",
    titleDesktopLines: ["今のシステムを", "どこまで変えるか。"],
    titleMobileLines: ["今のシステムを", "どこまで変えるか。"],
    conclusion: "残す部分・変える部分・移行の順番",
    conclusionMobileLines: ["残す部分→変える部分", "→移行の順番"],
    body: "利用状況と移行の制約を確認し、入れ替え、部分変更、機能追加などを比較します。",
  },
];

export function ConsultingExamples() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const track = useRef<HTMLOListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const frame = useRef<number | null>(null);
  const leftFor = (index: number) => {
    const element = track.current;
    return element && cards.current[index]
      ? cards.current[index]!.offsetLeft -
          parseFloat(getComputedStyle(element).paddingLeft)
      : 0;
  };
  const move = (index: number) => {
    track.current?.scrollTo({
      left: leftFor(index),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const sync = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const element = track.current;
      if (!element) return;
      let nearest = 0;
      cards.current.forEach((_, index) => {
        if (
          Math.abs(leftFor(index) - element.scrollLeft) <
          Math.abs(leftFor(nearest) - element.scrollLeft)
        )
          nearest = index;
      });
      currentRef.current = nearest;
      setCurrent(nearest);
      frame.current = null;
    });
  };
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const card = cards.current[currentRef.current];
      if (card && element.clientWidth)
        element.scrollTo({
          left:
            card.offsetLeft - parseFloat(getComputedStyle(element).paddingLeft),
          behavior: "instant",
        });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  return (
    <div className={cases.examples}>
      <p id="examples-instructions" className={styles.srOnly}>
        左右のスワイプ、下の位置ボタン、または一覧にフォーカスして左右の矢印キーで相談例を切り替えられます。
      </p>
      <ol
        ref={track}
        className={cases.track}
        onScroll={sync}
        tabIndex={0}
        aria-describedby="examples-instructions"
        aria-label="相談例の一覧"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (!direction && event.key !== "Home" && event.key !== "End") return;
          if (!track.current || track.current.scrollWidth <= track.current.clientWidth) return;
          event.preventDefault();
          move(event.key === "Home" ? 0 : event.key === "End" ? examples.length - 1 : Math.max(0, Math.min(examples.length - 1, currentRef.current + direction)));
        }}
      >
        {examples.map((example, index) => (
          <li key={example.label} ref={(node) => { cards.current[index] = node; }} className={cases.card}>
            <article aria-labelledby={`example-title-${index}`}>
              <div className={cases.problem}>
                <h3 id={`example-title-${index}`}>
                  <span className={styles.srOnly}>{example.title}</span>
                  <span className={cases.titleDesktop} aria-hidden="true">
                    {example.titleDesktopLines.map((line) => (
                      <span key={line} className={cases.titleLine}>{line}</span>
                    ))}
                  </span>
                  <span className={cases.titleMobile} aria-hidden="true">
                    {example.titleMobileLines.map((line) => (
                      <span key={`m-${line}`} className={cases.titleLine}>{line}</span>
                    ))}
                  </span>
                </h3>
                <div className={cases.problemAccent} aria-hidden="true" />
              </div>
              <div className={cases.response}>
                <p className={cases.responseEyebrow}></p>
                <div className={cases.conclusion}>
                  <p>
                    <span className={styles.srOnly}>{example.conclusion}</span>
                    <span className={cases.conclusionDesktop} aria-hidden="true">{example.conclusion}</span>
                    <span className={cases.conclusionMobile} aria-hidden="true">
                      {example.conclusionMobileLines.map((line) => (
                        <span key={line} className={cases.conclusionLine}>{line}</span>
                      ))}
                    </span>
                  </p>
                </div>
                <hr className={cases.responseDivider} aria-hidden="true" />
                <p className={cases.body}>{example.body}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <div className={cases.position} aria-label="相談例の現在位置">
        {examples.map((example, index) => (
          <button key={example.label} type="button" aria-label={`${index + 1}件目：${example.title}を表示`} aria-current={current === index ? "true" : undefined} onClick={() => move(index)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className={cases.note}></p>
    </div>
  );
}
