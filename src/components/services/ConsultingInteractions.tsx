"use client";

import { Fragment, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChartColumn,
  CheckCircle2,
  ClipboardList,
  Columns2,
  FileText,
  FlaskConical,
  Monitor,
  ScanSearch,
  Table,
  type LucideIcon,
} from "lucide-react";
import { useScrollLinkedOpacity } from "@/components/home/demo-showcase/useScrollLinkedOpacity";
import { AxPhrases } from "@/components/ui/ax/AxPhrases";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  viewSlideProgress,
  viewSlideTranslateX,
} from "@/lib/motion/view-slide";
import styles from "./consulting-final.module.css";

type FlowStep = { label: string; Icon: LucideIcon };

/** トップ SP デモ Before/After と同じスクロール幅 */
const SLIDE_START_BRAND = 0.16;
const SLIDE_START_MAIN = 0.3;
const SLIDE_SPAN = 0.75;
const SLIDE_DISTANCE_PX = 120;

const examples: {
  problem: readonly string[];
  focus: readonly string[];
  body: string;
  flowSteps: FlowStep[];
  flowAriaLabel: string;
}[] = [
  {
    problem: ["同じ情報を、", "何度も入力している。"],
    focus: ["入力を減らすには、", "どこを変えるべきか。"],
    body: "同じ情報を入力している箇所を調べ、既存システムの連携、業務手順の変更、システムの入れ替えを比較します。",
    flowSteps: [
      { label: "Excel", Icon: Table },
      { label: "受注管理", Icon: Monitor },
      { label: "請求管理", Icon: FileText },
    ],
    flowAriaLabel: "Excelから受注管理、請求管理へ情報が流れるイメージ",
  },
  {
    problem: ["AIを、", "どの業務に使えばよいか", "わからない。"],
    focus: ["試す業務と、", "効果の確認方法を決める。"],
    body: "対象となる業務や使える情報を調べ、人が確認すべき部分も含めて小さな検証の進め方を考えます。",
    flowSteps: [
      { label: "候補業務", Icon: ClipboardList },
      { label: "試作検証", Icon: FlaskConical },
      { label: "効果確認", Icon: ChartColumn },
    ],
    flowAriaLabel: "候補業務の選定から試作検証、効果確認までの流れ",
  },
  {
    problem: ["今のシステムを、", "どこまで変えるべきか。"],
    focus: ["残す部分と、", "変更する部分を決める。"],
    body: "現在の利用状況と制約を確認し、機能追加、一部改修、全体の入れ替えを比較します。",
    flowSteps: [
      { label: "現状整理", Icon: ScanSearch },
      { label: "選択肢比較", Icon: Columns2 },
      { label: "方針決定", Icon: CheckCircle2 },
    ],
    flowAriaLabel: "現状整理から選択肢比較、方針決定までの流れ",
  },
];

const DIAGRAM_FADE = { once: true, amount: 0.25 } as const;

function FlowConnectorStatic() {
  return (
    <div className={styles.exampleFlowConnectorStatic} aria-hidden>
      <ArrowRight />
    </div>
  );
}

/** 左：一度だけフェード（矢印の順次アニメはなし） */
function ConsultingExampleFlowDiagram({
  steps,
  ariaLabel,
}: {
  steps: FlowStep[];
  ariaLabel: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={styles.exampleDiagram}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={DIAGRAM_FADE}
      transition={{ duration: 0.45, ease: [0.45, 0, 0.55, 1] }}
    >
      <div className={styles.exampleFlowRow} role="img" aria-label={ariaLabel}>
        {steps.map((step, index) => (
          <Fragment key={step.label}>
            <div className={styles.exampleFlowStep}>
              <span className={styles.exampleDiagramIcon} aria-hidden="true">
                <step.Icon />
              </span>
              <span className={styles.exampleFlowStepLabel}>{step.label}</span>
            </div>
            {index < steps.length - 1 ? <FlowConnectorStatic /> : null}
          </Fragment>
        ))}
      </div>
    </motion.figure>
  );
}

function ConsultingExampleAside({
  focus,
  body,
}: {
  focus: readonly string[];
  body: string;
}) {
  const asideRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const scrollOpacity = useScrollLinkedOpacity(asideRef, {
    disabled: reduceMotion,
  });

  const brandSlide = reduceMotion
    ? 1
    : viewSlideProgress(scrollOpacity, SLIDE_START_BRAND, SLIDE_SPAN);
  const mainSlide = reduceMotion
    ? 1
    : viewSlideProgress(scrollOpacity, SLIDE_START_MAIN, SLIDE_SPAN);

  const brandX = reduceMotion ? 0 : viewSlideTranslateX(brandSlide, SLIDE_DISTANCE_PX);
  const mainX = reduceMotion ? 0 : -viewSlideTranslateX(mainSlide, SLIDE_DISTANCE_PX);

  const showBrand = reduceMotion || brandSlide > 0.02;
  const showMain = reduceMotion || mainSlide > 0.02;

  return (
    <aside
      ref={asideRef}
      className={styles.exampleAside}
      aria-label="AXEONが検討すること"
    >
      {showBrand ? (
        <div
          className={styles.examplePillBrand}
          style={{
            transform: `translateX(${brandX}px)`,
            opacity: reduceMotion ? 1 : Math.min(1, brandSlide * 1.1),
          }}
        >
          AXEONが検討すること
        </div>
      ) : (
        <div className={styles.exampleAsideSpacer} aria-hidden="true" />
      )}
      {showMain ? (
        <div
          className={styles.examplePillMain}
          style={{
            transform: `translateX(${mainX}px)`,
            opacity: reduceMotion ? 1 : Math.min(1, mainSlide * 1.1),
          }}
        >
          <p className={styles.examplePillFocus}>
            <AxPhrases phrases={focus} />
          </p>
          <p className={styles.examplePillBody}>{body}</p>
        </div>
      ) : null}
    </aside>
  );
}

function ConsultingExampleRow({
  index,
  problem,
  focus,
  body,
  flowSteps,
  flowAriaLabel,
}: {
  index: number;
  problem: readonly string[];
  focus: readonly string[];
  body: string;
  flowSteps: FlowStep[];
  flowAriaLabel: string;
}) {
  return (
    <li className={styles.example}>
      <div className={styles.exampleMain}>
        <p className={styles.exampleIndex}>
          <span className={styles.srOnly}>事例 </span>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className={styles.exampleProblem}>
          <AxPhrases phrases={problem} />
        </h3>
        <ConsultingExampleFlowDiagram
          steps={flowSteps}
          ariaLabel={flowAriaLabel}
        />
      </div>
      <ConsultingExampleAside focus={focus} body={body} />
    </li>
  );
}

export function ConsultingExamples() {
  return (
    <ol className={styles.examples}>
      {examples.map((item, index) => (
        <ConsultingExampleRow
          key={item.body}
          index={index}
          problem={item.problem}
          focus={item.focus}
          body={item.body}
          flowSteps={item.flowSteps}
          flowAriaLabel={item.flowAriaLabel}
        />
      ))}
    </ol>
  );
}
