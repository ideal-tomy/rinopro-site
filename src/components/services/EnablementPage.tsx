"use client";

import Link from "next/link";
import {
  ArrowRight,
  Settings,
  FileSearch,
  ClipboardCheck,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { EnablementDevelopmentFlipCards } from "./EnablementDevelopmentFlipCards";
import { FlowTimelinePageContent } from "./FlowTimelinePageContent";
import base from "./consulting-page.module.css";
import styles from "./enablement-page.module.css";
import { ServicePageLinks } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import { useScrollReveal } from "./useScrollReveal";
import { headingAccentRuleClasses } from "@/lib/ui/heading-accent-rule-styles";
import { EnablementPreSupportCards } from "./EnablementPreSupportCards";
import { ServiceHeroProcessDiagram } from "./ServiceHeroProcessDiagram";

const stages = [
  [
    "課題と担当を整理する",
    "業務の課題を確認し、社内と外部で担当する範囲を決めます。",
  ],
  [
    "小さく開発して確かめる",
    "社内メンバーと試作を確認し、必要な機能や手順を具体化します。",
  ],
  [
    "運用しながら引き継ぐ",
    "実際に使いながら、操作・管理・変更の手順を共有します。",
  ],
  [
    "社内で改善できる範囲を広げる",
    "社内で対応する業務を増やし、専門的な部分は外部が支援します。",
  ],
];
const stageTitleParts = [
  ["課題と担当を", "整理する"],
  ["小さく開発して", "確かめる"],
  ["運用しながら", "引き継ぐ"],
  ["社内で改善できる", "範囲を広げる"],
];
const stageIcons = [FileSearch, ClipboardCheck, Settings, ChartNoAxesColumnIncreasing];
const challengePairs = [
  {
    issue: "何を開発すべきか決めにくい",
    supportTitle: "開発と手順変更を切り分ける",
    supportBody:
      "業務を確認し、システムで変える部分と、仕事の進め方で変える部分を整理します。",
  },
  {
    issue: "開発会社への説明・確認が難しい",
    supportTitle: "要件整理と打ち合わせを支援する",
    supportBody:
      "依頼内容をまとめ、打ち合わせへの同席や提案内容の確認を支援します。",
  },
  {
    issue: "特定の人しか運用方法がわからない",
    supportTitle: "操作方法と対応手順を共有する",
    supportBody:
      "日々の操作や困ったときの対応を、社内で確認できるようにまとめます。",
  },
];
export function EnablementPage() {
  const approachReveal = useScrollReveal<HTMLElement>(`.${styles.stages} > li`);
  const checksReveal = useScrollReveal<HTMLElement>(`.${styles.preSupportCard}`);
  const supportReveal = useScrollReveal<HTMLElement>(`.${styles.challengeCard}`);
  return (
    <div
      className={`${base.page} ${styles.page} ${navigation.page}`}
      
      data-service-page
    >
      <ServicePageLinks current="enablement" />
      <section className={base.hero} aria-labelledby="enablement-title">
        <div className={`${base.container} ${base.heroColumns}`}>
          <div>
            <h1 id="enablement-title">半内製化（FED）</h1>
            <p className={`${base.lead} ${base.enablementLead}`}>
              課題の整理から開発・運用まで、社内メンバーと一緒に進めます。
            </p>
            <p className={base.enablementIntro}>
              必要な仕組みを作りながら、知識と手順を共有し、社内で運用・改善できる範囲を広げます。
            </p>
            <p className={base.note}></p>
          </div>
          <ServiceHeroProcessDiagram pageKey="enablement" />
        </div>
      </section>
      <section
        ref={approachReveal}
        id="approach"
        className={`${base.section} ${styles.approachSection}`}
        aria-labelledby="approach-title"
      >
        <div className={base.container}>
          <h2 id="approach-title" className={headingAccentRuleClasses.default}>
            支援の進め方
          </h2>
          <p className={styles.intro}>
            実際の業務を一緒に進めながら、社内で対応できる範囲を広げます。
          </p>
        </div>
        <ol className={styles.stages}>
          {stages.map(([title, body], index) => {
            const Icon = stageIcons[index];
            return (
              <li key={title}>
                <div className={styles.stageMeta}>
                  <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" />
                </div>
                <div className={styles.stageContent}>
                  <h3 className={styles.stageTitle}>
                    {stageTitleParts[index].map((part) => (
                      <span key={part}>{part}</span>
                    ))}
                  </h3>
                  <p>{body}</p>
                </div>
                {index < stages.length - 1 && <ArrowRight className={styles.stageArrow} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
        <div className={base.container}>
          <p className={styles.afterDiagram}>
            必要に応じて、開発会社との打ち合わせにも同席し、要件や進め方の確認を支援します。
          </p>
        </div>
      </section>
      <section
        ref={checksReveal}
        id="checks"
        className={`${base.section} ${styles.checksSection}`}
        aria-labelledby="checks-title"
      >
        <div className={base.container}>
          <h2 id="checks-title" className={headingAccentRuleClasses.default}>
            支援を始める前に
          </h2>
          <p className={styles.intro}>
            現在の体制や業務に合わせて、担当する範囲と進め方を確認します。
          </p>
          <EnablementPreSupportCards />
        </div>
      </section>
      <section
        ref={supportReveal}
        id="support"
        className={`${base.section} ${styles.supportSection}`}
        aria-labelledby="support-title"
      >
        <div className={base.container}>
          <h2 id="support-title" className={headingAccentRuleClasses.default}>
            自社で進める際の課題
          </h2>
          <ul className={styles.challengeRows}>
            {challengePairs.map((item) => (
              <li key={item.issue} className={styles.challengeCard}>
                <div className={styles.challengeSide}>
                  <p className={styles.challengeText}>{item.issue}</p>
                </div>
                <span className={styles.challengeArrow} aria-hidden="true">
                  →
                </span>
                <div className={styles.supportSide}>
                  <p className={styles.supportHeading}>{item.supportTitle}</p>
                  <p className={styles.supportBody}>{item.supportBody}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        id="development"
        className={`${base.section} ${base.tinted}`}
        aria-labelledby="development-title"
      >
        <div className={base.container}>
          <h2 id="development-title" className={headingAccentRuleClasses.default}>
            開発の進め方
          </h2>
          <div className={styles.development}>
            <EnablementDevelopmentFlipCards />
            <div className={styles.developmentTimeline}>
              <FlowTimelinePageContent
                embedded
                hideHeader
                enablement
                offeringEmbed={{ fixedTrack: "common" }}
                mediaTrack="dashboard"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        className={base.consultation}
        aria-labelledby="consultation-title"
      >
        <div className={`${base.container} ${base.consultationInner}`}>
          <h2 id="consultation-title" className={headingAccentRuleClasses.onDarkInline}>
            ご相談について
          </h2>
          <p>検討中の内容や、現在困っていることをお聞かせください。</p>
          <Link href="/contact" className={base.button}>
            お問い合わせ
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <ServicePageLinks current="enablement" bottom />
    </div>
  );
}
