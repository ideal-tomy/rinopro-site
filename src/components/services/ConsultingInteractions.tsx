import { Fragment } from "react";
import {
  ArrowRight,
  FileText,
  Monitor,
  Table,
  type LucideIcon,
} from "lucide-react";
import styles from "./consulting-page.module.css";

type ExampleDiagram = {
  steps: { label: string; Icon: LucideIcon }[];
};

/** problem の「|」は、狭い画面で改行してよい位置。 */
const examples: {
  problem: string[];
  focus: string[];
  body: string;
  diagram?: ExampleDiagram;
}[] = [
  {
    problem: ["同じ情報を、", "何度も入力している。"],
    focus: ["入力を減らすには、", "どこを変えるべきか。"],
    body: "同じ情報を入力している箇所を調べ、既存システムの連携、業務手順の変更、システムの入れ替えを比較します。",
    diagram: {
      steps: [
        { label: "Excel", Icon: Table },
        { label: "受注管理", Icon: Monitor },
        { label: "請求管理", Icon: FileText },
      ],
    },
  },
  {
    problem: ["AIを、どの業務に使えばよいか|わからない。"],
    focus: ["試す業務と、", "効果の確認方法を決める。"],
    body: "対象となる業務や使える情報を調べ、人が確認すべき部分も含めて小さな検証の進め方を考えます。",
  },
  {
    problem: ["今のシステムを、", "どこまで変えるべきか。"],
    focus: ["残す部分と、", "変更する部分を決める。"],
    body: "現在の利用状況と制約を確認し、機能追加、一部改修、全体の入れ替えを比較します。",
  },
];

function ConsultingExampleDiagram({ steps }: ExampleDiagram) {
  return (
    <figure className={styles.exampleDiagram}>
      <ol className={styles.exampleDiagramSteps}>
        {steps.map(({ label, Icon }, index) => (
          <Fragment key={label}>
            {index > 0 && (
              <li className={styles.exampleDiagramArrow} aria-hidden="true">
                <ArrowRight />
              </li>
            )}
            <li className={styles.exampleDiagramStep}>
              <span className={styles.exampleDiagramIcon} aria-hidden="true">
                <Icon />
              </span>
              <span>{label}</span>
            </li>
          </Fragment>
        ))}
      </ol>
    </figure>
  );
}

export function ConsultingExamples() {
  return (
    <ol className={styles.examples}>
      {examples.map(({ problem, focus, body, diagram }, index) => (
        <li key={body} className={styles.exampleItem}>
          <p className={styles.exampleCase}>
            <span className={styles.srOnly}>事例 </span>
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className={styles.exampleScenario}>
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
            {diagram && <ConsultingExampleDiagram {...diagram} />}
          </div>
          <div className={styles.exampleConsider}>
            <p className={styles.exampleLabel}>AXEONが検討すること</p>
            <p className={styles.exampleFocus}>
              {focus.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.exampleBody}>{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
