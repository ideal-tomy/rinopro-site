"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ConsultingExamples } from "./ConsultingInteractions";
import { ConsultingResultSample } from "./ConsultingResultSample";
import shared from "./service-landing-shared.module.css";
import styles from "./consulting-page.module.css";
import { ServicePageLinks } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import { ServiceHeroProcessDiagram } from "./ServiceHeroProcessDiagram";

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
    <div className={`${shared.page} ${navigation.page}`} data-service-page>
      <ServicePageLinks current="consulting" />
      <section
        className={`${shared.hero} ${shared.heroConsulting}`}
        aria-labelledby="consulting-heading"
      >
        <div className={`${shared.container} ${shared.heroColumns}`}>
          <div>
            <h1
              id="consulting-heading"
              className={`${shared.heroTitle} ${shared.lines}`}
            >
              <span>何を変えるか。</span>
              <span className={shared.accent}>どこから始めるか。</span>
            </h1>
            <p className={shared.heroBody}>
              経営の方針と現場の状況を確認し、課題を整理します。改善案を比較したうえで、取り組む範囲と進め方を決めます。
            </p>
          </div>
          <ServiceHeroProcessDiagram pageKey="consulting" />
        </div>
      </section>

      <section
        id="consulting-details"
        className={shared.section}
        aria-labelledby="role-heading"
      >
        <div className={`${shared.container} ${shared.split}`}>
          <div>
            <h2 id="role-heading" className={`${shared.heading} ${shared.lines}`}>
              <span>状況を確認し、</span>
              <span>
                <span className={styles.highlight}>判断材料をそろえる。</span>
              </span>
            </h2>
            <p className={shared.body}>
              システムの導入が最初から答えとは限りません。業務の進め方を変えるだけで改善できる場合もあります。
            </p>
            <p className={shared.body}>
              方法を決めつけず、費用や負担も含めて比較します。
            </p>
          </div>
          <ul className={shared.lineList}>
            {roles.map((role) => (
              <li key={role.title}>
                <h3 className={shared.itemTitle}>{role.title}</h3>
                <p className={shared.itemBody}>{role.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className={`${shared.section} ${shared.tint}`}
        aria-labelledby="work-heading"
      >
        <div className={shared.container}>
          <h2 id="work-heading" className={`${shared.heading} ${shared.lines}`}>
            <span>整理する。比較する。</span>
            <span className={shared.accent}>進め方を決める。</span>
          </h2>
          <p className={shared.body}>
            まず現在の仕事を把握し、複数の方法から現実的な案を選びます。検討だけで終了することもできます。
          </p>
          <ol className={shared.steps}>
            {steps.map((step) => (
              <li key={step.label}>
                <p className={shared.stepLabel}>{step.label}</p>
                <h3 className={shared.itemTitle}>{step.title}</h3>
                <p className={shared.itemBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="consulting-examples"
        className={shared.section}
        aria-labelledby="examples-heading"
      >
        <div className={shared.container}>
          <h2 id="examples-heading" className={shared.heading}>
            例えば、こんなご相談から。
          </h2>
          <p className={shared.body}>
            解決方法が決まっていない段階でも、ご相談いただけます。
          </p>
          <ConsultingExamples />
        </div>
      </section>

      <section
        className={`${shared.section} ${shared.tint}`}
        aria-labelledby="result-heading"
      >
        <div className={`${shared.container} ${shared.split} ${styles.resultSplit}`}>
          <div>
            <h2 id="result-heading" className={`${shared.heading} ${shared.lines}`}>
              <span>社内で説明し、</span>
              <span>判断できる資料に。</span>
            </h2>
            <p className={shared.body}>
              検討した内容は、関係者が確認できる形にまとめます。相談内容に応じて、業務の整理資料や改善案、実行計画などを作成します。
            </p>
            <p className={shared.note}>
              ※ 右は構成例です。作成する資料は、ご依頼の範囲によって異なります。
            </p>
          </div>
          <ConsultingResultSample />
        </div>
      </section>

      <section
        id="contact-consulting"
        className={shared.contact}
        aria-labelledby="consultation-heading"
      >
        <div className={`${shared.container} ${shared.contactInner}`}>
          <h2
            id="consultation-heading"
            className={`${shared.heading} ${shared.lines}`}
          >
            <span>
              課題の整理や
              <wbr />
              計画づくりだけでも、
            </span>
            <span>ご相談いただけます。</span>
          </h2>
          <p className={`${shared.body} ${shared.contactBodyLines}`}>
            <span>現在困っていることや、検討中の内容をお聞かせください。</span>
            <span>開発に進むかどうかも含めて、一緒に考えます。</span>
          </p>
          <div className={shared.actions}>
            <Link className={shared.contactButton} href="/contact">
              お問い合わせ
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              className={shared.textLink}
              href="/services/insourcing-enablement"
            >
              開発・運用の伴走を見る<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <ServicePageLinks current="consulting" bottom />
    </div>
  );
}
