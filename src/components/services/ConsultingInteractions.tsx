import { Fragment } from "react";
import { ArrowRight, FileInput, Monitor, Sparkles } from "lucide-react";
import styles from "./consulting-page.module.css";

/** problem の「|」は、狭い画面で改行してよい位置。 */
const examples = [
  {
    problem: ["同じ情報を、", "何度も入力している。"],
    focus: ["入力を減らすには、", "どこを変えるべきか。"],
    body: "同じ情報を入力している箇所を調べ、既存システムの連携、業務手順の変更、システムの入れ替えを比較します。",
    Icon: FileInput,
  },
  {
    problem: ["AIを、", "どの業務に使えばよいか|わからない。"],
    focus: ["試す業務と、", "効果の確認方法を決める。"],
    body: "対象となる業務や使える情報を調べ、人が確認すべき部分も含めて小さな検証の進め方を考えます。",
    Icon: Sparkles,
  },
  {
    problem: ["今のシステムを、", "どこまで変えるべきか。"],
    focus: ["残す部分と、", "変更する部分を決める。"],
    body: "現在の利用状況と制約を確認し、機能追加、一部改修、全体の入れ替えを比較します。",
    Icon: Monitor,
  },
];

export function ConsultingExamples() {
  return (
    <ol className={styles.examples}>
      {examples.map(({ problem, focus, body, Icon }) => (
        <li key={body}>
          <div className={styles.exampleTop}>
            <div className={styles.exampleProblemCol}>
              <span className={styles.exampleIcon} aria-hidden="true">
                <Icon />
              </span>
              <div className={styles.exampleProblemText}>
                <p className={styles.exampleLabel}>ご相談</p>
                <h3 className={styles.exampleProblem}>
                  {problem.map((line) => (
                    <span key={line}>
                      {line.split("|").map((part, index) => (
                        <Fragment key={part}>
                          {index > 0 && <wbr />}
                          {part}
                        </Fragment>
                      ))}
                    </span>
                  ))}
                </h3>
              </div>
            </div>
            <span className={styles.exampleArrow} aria-hidden="true">
              <ArrowRight />
            </span>
            <div className={styles.exampleConsiderCol}>
              <p className={styles.exampleLabel}>何を検討するか</p>
              <p className={styles.exampleFocus}>
                {focus.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </div>
          <p className={styles.exampleBody}>{body}</p>
        </li>
      ))}
    </ol>
  );
}
