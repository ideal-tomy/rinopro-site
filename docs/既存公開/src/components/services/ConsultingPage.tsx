"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ConsultingExamples } from "./ConsultingInteractions";
import { ConsultingResultSample } from "./ConsultingResultSample";
import { ServicePageLinks } from "./ServicePageNavigation";
import { SERVICE_HERO_PROCESS_PAGE_CONFIG } from "@/lib/content/service-hero-process-stages";
import { ServiceFlowDiagram } from "./ServiceFlowDiagram";
import styles from "./consulting-final.module.css";

const roles = [
  {
    title: "業務と課題の整理",
    body: "誰が何を担当し、どこで時間がかかっているかを確認します。",
  },
  {
    title: "対応方法の比較",
    body: "運用の変更、既存ツールの活用、システム改修・導入を比較します。",
  },
  {
    title: "優先順位の検討",
    body: "効果、費用、実施の難しさを考え、先に取り組む範囲を決めます。",
  },
  {
    title: "実行計画の作成",
    body: "担当する人、進める順番、成果の確認方法を整理します。",
  },
];

const steps = [
  {
    label: "STEP 1",
    title: "現在の業務を確認",
    body: "担当者から話を聞き、業務の流れや実際に使っている資料・システムを確認します。",
  },
  {
    label: "STEP 2",
    title: "改善案を比較",
    body: "対応方法ごとに、費用や効果、導入に必要な作業を比べます。",
  },
  {
    label: "STEP 3",
    title: "実行計画にまとめる",
    body: "先に実施する内容と、担当者、確認する項目を決めます。",
  },
];

export function ConsultingPage() {
  return (
    <div className={styles.page} data-service-page>
      <ServicePageLinks current="consulting" />
      <section className={styles.hero} aria-labelledby="consulting-heading">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <p className={styles.kicker}>コンサルティング</p>
            <h1 id="consulting-heading" className={styles.heroTitle}>
              <span>何を変えるか。</span>
              <span className={styles.accent}>どこから始めるか。</span>
            </h1>
            <p className={styles.lead}>
              <span>経営の方針と現場の状況を確認し、課題を整理します。</span>
              <span>改善案を比較したうえで、取り組む範囲と進め方を決めます。</span>
            </p>
          </div>
          <ServiceFlowDiagram
            highlightedStageIds={
              SERVICE_HERO_PROCESS_PAGE_CONFIG.consulting.highlightedStageIds
            }
          />
        </div>
      </section>

      <section
        id="consulting-details"
        className={`${styles.section} ${styles.sectionMuted}`}
        aria-labelledby="role-heading"
      >
        <div className={styles.container}>
          <p className={styles.kicker}>支援の内容</p>
          <h2 id="role-heading" className={styles.sectionTitle}>
            状況を確認し、判断材料をそろえる。
          </h2>
          <p className={styles.prose}>
            システムの導入が最初から答えとは限りません。業務の進め方を変えるだけで改善できる場合もあります。
          </p>
          <p className={styles.prose}>
            方法を決めつけず、費用や負担も含めて比較します。
          </p>
          <ul className={styles.roleList}>
            {roles.map(({ title, body }) => (
              <li key={title} className={styles.roleItem}>
                <h3 className={styles.roleTitle}>{title}</h3>
                <p className={styles.roleBody}>{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="work-heading">
        <div className={styles.container}>
          <p className={styles.kicker}>進め方</p>
          <h2 id="work-heading" className={styles.sectionTitle}>
            整理する。比較する。進め方を決める。
          </h2>
          <p className={styles.prose}>
            まず現在の仕事を把握し、複数の方法から現実的な案を選びます。検討だけで終了することもできます。
          </p>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step.label}>
                <p className={styles.stepLabel}>{step.label}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="consulting-examples"
        className={`${styles.section} ${styles.sectionMuted}`}
        aria-labelledby="examples-heading"
      >
        <div className={styles.container}>
          <p className={styles.kicker}>ご相談例</p>
          <h2 id="examples-heading" className={styles.sectionTitle}>
            例えば、こんなご相談から。
          </h2>
          <p className={styles.prose}>
            解決方法が決まっていない段階でも、ご相談いただけます。
          </p>
          <ConsultingExamples />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="result-heading">
        <div className={`${styles.container} ${styles.resultGrid}`}>
          <div>
            <p className={styles.kicker}>成果物</p>
            <h2 id="result-heading" className={styles.sectionTitle}>
              社内で説明し、判断できる資料に。
            </h2>
            <p className={styles.prose}>
              検討した内容は、関係者が確認できる形にまとめます。相談内容に応じて、業務の整理資料や改善案、実行計画などを作成します。
            </p>
            <p className={styles.note}>
              ※ 図は構成例です。作成する資料は、ご依頼の範囲によって異なります。
            </p>
          </div>
          <ConsultingResultSample />
        </div>
      </section>

      <section
        id="contact-consulting"
        className={styles.contact}
        aria-labelledby="consultation-heading"
      >
        <div className={`${styles.container} ${styles.contactInner}`}>
          <p className={styles.kicker}>お問い合わせ</p>
          <h2 id="consultation-heading" className={styles.contactTitle}>
            <span>課題の整理や計画づくりだけでも</span>
            <span>ご相談いただけます。</span>
          </h2>
          <p className={styles.contactLead}>
            <span>困っていることや検討中の内容をお聞かせください。</span>
            <span>開発に進むかどうかも含めて、一緒に考えます。</span>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/contact">
              お問い合わせ
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className={styles.secondary} href="/services/insourcing-enablement">
              開発・運用の伴走を見る
            </Link>
          </div>
        </div>
      </section>
      <ServicePageLinks current="consulting" bottom />
    </div>
  );
}
