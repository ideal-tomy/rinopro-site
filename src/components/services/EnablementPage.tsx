"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  MessagesSquare,
  Settings,
  Split,
  FileSearch,
  ClipboardCheck,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { FlowTimelinePageContent } from "./FlowTimelinePageContent";
import base from "./consulting-page.module.css";
import styles from "./enablement-page.module.css";
import { ServicePageLinks, ServiceSectionNav } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import { useScrollReveal } from "./useScrollReveal";

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
const checks = [
  {
    title: "社内で担当する範囲",
    body: "どこまで自社で対応し、どこを外部に任せるかを確認します。",
    icon: Split,
  },
  {
    title: "担当者と使える時間",
    body: "誰が参加し、どの程度の時間を確保できるかを確認します。",
    icon: CalendarClock,
  },
  {
    title: "知識と手順の共有",
    body: "何を覚え、どんな手順を残す必要があるかを確認します。",
    icon: BookOpen,
  },
  {
    title: "開発・運用の環境",
    body: "現在のツールや権限を、どこまで利用できるかを確認します。",
    icon: Settings,
  },
  {
    title: "開発会社との分担",
    body: "誰が要件を伝え、確認し、契約や管理を担当するかを確認します。",
    icon: MessagesSquare,
  },
];
const pairs = [
  [
    "何を開発すべきか決めにくい",
    "業務を確認し、開発するものと手順変更で対応するものを整理します。",
  ],
  [
    "開発会社への説明・確認が難しい",
    "要件整理、打ち合わせへの同席、提案内容の確認を支援します。",
  ],
  [
    "担当者に知識が集中する",
    "実案件を通じて知識を共有し、操作・管理の手順を整えます。",
  ],
];
const pairIcons = [FileSearch, MessagesSquare, BookOpen];
const anchors = [
  ["approach", "支援の進め方"],
  ["checks", "確認すること"],
  ["support", "課題と支援"],
  ["development", "開発の進め方"],
] as const;

export function EnablementPage() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const approachReveal = useScrollReveal<HTMLElement>(`.${styles.stages} > li`);
  const checksReveal = useScrollReveal<HTMLElement>(`.${styles.checks} > button, .${styles.description}`);
  const supportReveal = useScrollReveal<HTMLElement>(`.${styles.pairs} > div`);
  const DetailIcon = checks[selected].icon;
  return (
    <div
      className={`${base.page} ${styles.page} ${navigation.page}`}
      
      data-service-page
    >
      <ServicePageLinks current="enablement" />
      <section className={base.hero} aria-labelledby="enablement-title">
        <div className={`${base.container} ${base.heroColumns}`}>
          <div>
            <h1 id="enablement-title">半内製化</h1>
            <p className={base.lead}>
              課題の整理から開発・運用まで、社内メンバーと一緒に進めます。
            </p>
            <p>
              必要な仕組みを作りながら、知識と手順を共有し、社内で運用・改善できる範囲を広げます。
            </p>
            <p className={base.note}>月額の支援・3か月ごとの更新が基本です。</p>
          </div>
          <div className={base.imageWrap}>
            <Image
              src="/images/services01.jpg"
              width={1672}
              height={941}
              alt="AXEONの支援範囲：戦略コンサルティング、ITコンサルティング、システム開発、導入・展開、運用・保守。半内製化では③〜⑤を中心に支援します。"
              priority
              sizes="(max-width: 899px) 100vw, 56vw"
            />
            {[40.4, 60, 79.6].map((left, index) => (
              <span
                key={left}
                aria-hidden="true"
                className={base.imageFrame}
                style={{
                  left: `${left}%`,
                  width: index === 2 ? "18.8%" : "18.4%",
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <ServiceSectionNav items={anchors} label="半内製化のページ内リンク" />
      <section
        ref={approachReveal}
        id="approach"
        className={`${base.section} ${styles.approachSection}`}
        aria-labelledby="approach-title"
      >
        <div className={base.container}>
          <h2 id="approach-title" className={base.sectionHeading}>
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
        className={`${base.section} ${base.tinted} ${styles.checksSection}`}
        aria-labelledby="checks-title"
      >
        <div className={base.container}>
          <h2 id="checks-title" className={base.sectionHeading}>
            支援を始める前に
          </h2>
          <p className={styles.intro}>
            現在の体制や業務に合わせて、担当する範囲と進め方を確認します。
          </p>
          <div className={styles.checks}>
            {checks.map(({ title, icon: Icon }, index) => (
              <button
                key={title}
                type="button"
                id={`${id}-check-${index}`}
                aria-pressed={selected === index}
                aria-controls={`${id}-description`}
                onClick={() => setSelected(index)}
              >
                <Icon aria-hidden="true" />
                <span>{title}</span>
              </button>
            ))}
          </div>
          <div
            className={styles.description}
            id={`${id}-description`}
            role="region"
            aria-labelledby={`${id}-check-${selected}`}
            aria-live="polite"
          >
            <div className={styles.descriptionContent} key={selected}>
              <div>
                <h3>{checks[selected].title}</h3>
                <p>{checks[selected].body}</p>
              </div>
              <DetailIcon className={styles.descriptionArt} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
      <section
        ref={supportReveal}
        id="support"
        className={`${base.section} ${styles.supportSection}`}
        aria-labelledby="support-title"
      >
        <div className={base.container}>
          <h2 id="support-title" className={base.sectionHeading}>
            自社で進める際の課題
          </h2>
          <div className={styles.columnHeads} aria-hidden="true">
            <h3>自社で進める際の課題</h3>
            <h3>AXEONの支援</h3>
          </div>
          <dl className={styles.pairs}>
            {pairs.map(([issue, support], index) => {
              const Icon = pairIcons[index];
              return (
                <div key={issue} data-pair={index}>
                  <dt>
                    <span className={styles.mobileLabel}>
                      自社で進める際の課題
                    </span>
                    {issue}
                  </dt>
                  <dd>
                    <span className={styles.mobileLabel}>AXEONの支援</span>
                    <Icon className={styles.pairIcon} aria-hidden="true" />
                    <span className={styles.pairSupportCopy}>{support}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
      <section
        id="development"
        className={`${base.section} ${base.tinted}`}
        aria-labelledby="development-title"
      >
        <div className={base.container}>
          <h2 id="development-title" className={base.sectionHeading}>
            開発の進め方
          </h2>
          <div className={styles.development}>
            <FlowTimelinePageContent embedded hideHeader enablement />
          </div>
        </div>
      </section>
      <section
        className={base.consultation}
        aria-labelledby="consultation-title"
      >
        <div className={`${base.container} ${base.consultationInner}`}>
          <h2 id="consultation-title">ご相談について</h2>
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
