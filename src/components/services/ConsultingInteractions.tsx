"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, ChartNoAxesColumnIncreasing, FileText, Search, Settings, Sparkles } from "lucide-react";
import styles from "./consulting-page.module.css";
import mobile from "./consulting-mobile-cases.module.css";
import { useServiceTabs } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import { useScrollReveal } from "./useScrollReveal";

const examples = [
  {
    label: ["部門間の", "二重入力"],
    title: "同じ情報を、部門ごとに入力している",
    mobile: {
      title: "同じ情報を何度も入力している",
      titleParts: ["同じ情報を", "何度も入力している"],
      body: "重複する入力を確認し、システム連携・業務変更・入れ替えを比較します。",
      conclusion: "変更する範囲と、先に取り組む業務",
    },
    situation:
      "営業・製造・管理で別々の仕組みを使い、同じ情報を何度も入力しています。",
    details: [
      "情報の流れと、入力が重複する箇所を確認します。",
      "システムの連携、一部業務の変更、全体の入れ替えを比較します。",
      "変更する範囲と、先に取り組む業務",
    ],
  },
  {
    label: ["AI導入の", "検討"],
    title: "AIを使いたいが、どの業務に使うか決まっていない",
    mobile: {
      title: "AIをどの業務に使うか決めたい",
      titleParts: ["AIをどの業務に", "使うか決めたい"],
      body: "使う情報と確認作業を整理し、AI・既存ツール・手順変更を比較します。",
      conclusion: "試す業務の範囲と、効果の確認方法",
    },
    situation:
      "AIの導入を検討していますが、使う業務や確認方法が決まっていません。",
    details: [
      "対象業務、使う情報、人による確認が必要な箇所を確認します。",
      "AIの利用、既存ツールの設定変更、業務手順の見直しを比較します。",
      "試す業務の範囲と、効果の確認方法",
    ],
  },
  {
    label: ["既存", "システム", "の見直し"],
    title: "今のシステムを、どこまで変えるか決められない",
    mobile: {
      title: "今のシステムをどこまで変えるか",
      titleParts: ["今のシステムを", "どこまで変えるか"],
      body: "利用状況や移行の制約を確認し、入れ替え・部分変更・機能追加を比較します。",
      conclusion: "残す部分と変更する部分、移行の順番",
    },
    situation:
      "使いにくい箇所はあるものの、全体を入れ替えるべきか判断できていません。",
    details: [
      "利用部門、システム間のつながり、データ移行の制約を確認します。",
      "全体の入れ替え、段階的な変更、既存機能の追加を比較します。",
      "残す部分、変更する部分、移行の順番",
    ],
  },
];
const detailLabels = ["確認すること", "比較する対応方法", "まとめる内容"];

export function ConsultingExamples() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const examplesReveal = useScrollReveal<HTMLDivElement>();
  const { barRef, revealPanel } = useServiceTabs();
  return (
    <>
      <MobileExamples />
      <div ref={examplesReveal.ref} data-reveal-ready={examplesReveal.ready} data-entered={examplesReveal.entered} className={`${mobile.desktop} ${styles.examplesRoot}`}>
        <div
          ref={barRef}
          className={`${styles.tabs} ${navigation.stickyTabs}`}
          role="tablist"
          aria-label="相談内容"
        >
          {examples.map((example, index) => (
            <button
              key={example.title}
              type="button"
              role="tab"
              id={`example-tab-${index}`}
              aria-selected={selected === index}
              aria-controls={`example-panel-${index}`}
              tabIndex={selected === index ? 0 : -1}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              onClick={() => {
                setSelected(index);
                revealPanel(`example-panel-${index}`);
              }}
              onKeyDown={(event) => {
                let next: number;
                if (event.key === "ArrowRight" || event.key === "ArrowDown")
                  next = (index + 1) % examples.length;
                else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
                  next = (index + examples.length - 1) % examples.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = examples.length - 1;
                else return;
                event.preventDefault();
                setSelected(next);
                tabs.current[next]?.focus({ preventScroll: true });
                revealPanel(`example-panel-${next}`);
              }}
            >
              {index === 0 ? <Building2 aria-hidden="true" /> : index === 1 ? <Sparkles aria-hidden="true" /> : <Settings aria-hidden="true" />}
              {example.label.map((phrase) => (
                <span key={phrase}>{phrase}</span>
              ))}
            </button>
          ))}
        </div>
        {examples.map((example, index) => (
          <div
            key={example.title}
            id={`example-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`example-tab-${index}`}
            tabIndex={0}
            hidden={selected !== index}
            className={`${styles.examplePanel} ${selected === index && examplesReveal.entered ? styles.examplePanelActive : ""}`}
          >
            <div className={styles.situationCopy}>
              <p className={styles.situation}>相談の状況</p>
              <h3>
                {example.title.split("、").map((phrase, i, parts) => (
                  <span key={phrase}>
                    {phrase}
                    {i < parts.length - 1 ? "、" : ""}
                  </span>
                ))}
              </h3>
              <p>{example.situation}</p>
              <p className={styles.note}>
                相談内容に応じた検討例です。実績ではありません。
              </p>
            </div>
            <dl className={styles.exampleDetails}>
              {example.details.slice(0, 2).map((body, i) => (
                <div
                  key={detailLabels[i]}
                  className={styles.detailStep}
                >
                  <span className={styles.detailIcon} aria-hidden="true">
                    {i === 0 ? <Search /> : <ChartNoAxesColumnIncreasing />}
                  </span>
                  <div>
                    <dt>{detailLabels[i]}</dt>
                    <dd>{body}</dd>
                  </div>
                </div>
              ))}
              <div className={styles.conclusion}>
                <FileText aria-hidden="true" />
                <div>
                  <dt>{detailLabels[2]}</dt>
                  <dd>{example.details[2]}</dd>
                </div>
                <span className={styles.conclusionArrow} aria-hidden="true"><ArrowRight /></span>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

function MobileExamples() {
  const mobileReveal = useScrollReveal<HTMLDivElement>();
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
    <div ref={mobileReveal.ref} data-reveal-ready={mobileReveal.ready} data-entered={mobileReveal.entered} className={mobile.mobile}>
      <p id="mobile-examples-instructions" className={styles.srOnly}>
        左右のスワイプ、上の選択ボタン、または一覧にフォーカスして左右の矢印キーで相談例を切り替えられます。
      </p>
      <div
        className={mobile.position}
      >
        <div aria-label="相談例を選ぶ">
          {examples.map((example, index) => (
            <button
              key={example.title}
              type="button"
              aria-label={`${example.label.join("")}を表示`}
              aria-current={current === index ? "true" : undefined}
              onClick={() => move(index)}
            >
              {example.label.join("")}
            </button>
          ))}
        </div>
        <p aria-live="polite" aria-atomic="true">
          {current + 1} / {examples.length}
        </p>
      </div>
      <ol
        ref={track}
        className={mobile.track}
        onScroll={sync}
        tabIndex={0}
        aria-describedby="mobile-examples-instructions"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const direction =
            event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (!direction && event.key !== "Home" && event.key !== "End") return;
          event.preventDefault();
          move(
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? examples.length - 1
                : Math.max(
                    0,
                    Math.min(
                      examples.length - 1,
                      currentRef.current + direction,
                    ),
                  ),
          );
        }}
        aria-label="相談例の一覧"
      >
        {examples.map((example, index) => (
          <li
            key={example.title}
            ref={(node) => {
              cards.current[index] = node;
            }}
            className={mobile.card}
          >
            <article aria-labelledby={`mobile-example-title-${index}`}>
              <p className={mobile.category}>{example.label.join("")}</p>
              <h3 id={`mobile-example-title-${index}`}>
                {example.mobile.titleParts.map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </h3>
              <dl>
                <div className={mobile.comparison}>
                  <dt>確認・比較すること</dt>
                  <dd>{example.mobile.body}</dd>
                </div>
                <div className={mobile.conclusion}>
                  <dt>まとめる内容</dt>
                  <dd>{example.mobile.conclusion}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ol>
      <p className={mobile.note}>
        相談内容に応じた検討例です。実績ではありません。
      </p>
    </div>
  );
}
