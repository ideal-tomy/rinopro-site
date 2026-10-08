"use client";

import { useRef, useState } from "react";
import styles from "./consulting-page.module.css";

const examples = [
  {
    label: ["部門間の", "二重入力"],
    title: "同じ情報を、部門ごとに入力している",
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
  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="相談内容">
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
            onClick={() => setSelected(index)}
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
              tabs.current[next]?.focus();
            }}
          >
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
          className={styles.examplePanel}
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
            {example.details.map((body, i) => (
              <div
                key={detailLabels[i]}
                className={i === 2 ? styles.conclusion : undefined}
              >
                <dt>{detailLabels[i]}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </>
  );
}
