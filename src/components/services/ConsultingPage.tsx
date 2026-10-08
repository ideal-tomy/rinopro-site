import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  UsersRound,
  FileSearch,
  FileText,
  CircleCheck,
  Search,
  Scale,
  Database,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import { ConsultingExamples } from "./ConsultingInteractions";
import styles from "./consulting-page.module.css";

const support = [
  {
    title: "業務と課題の整理",
    titleParts: ["業務と", "課題の整理"],
    body: "業務の流れと、困っている箇所を確認します。",
    icon: Search,
  },
  {
    title: "投資と着手順の検討",
    titleParts: ["投資と", "着手順の検討"],
    body: "効果・費用・実施の難しさを比較します。",
    icon: Scale,
  },
  {
    title: "システム・データの整理",
    titleParts: ["システム・", "データの整理"],
    body: "既存システムと、情報の受け渡しを整理します。",
    icon: Database,
  },
  {
    title: "実行と検証の計画",
    titleParts: ["実行と", "検証の計画"],
    body: "担当・進め方・効果の確認方法をまとめます。",
    icon: ClipboardCheck,
  },
];

export function ConsultingPage() {
  return (
    <div className={styles.page} data-scroll-reveal="off">
      <section className={styles.hero} aria-labelledby="consulting-heading">
        <div className={`${styles.container} ${styles.heroColumns}`}>
          <div>
            <h1 id="consulting-heading">コンサルティング</h1>
            <p className={styles.lead}>
              <span>業務やシステムの見直しを、</span>
              <span>計画づくりから支援します。</span>
            </p>
            <p>
              経営の方針と現場の状況を確認し、取り組む範囲と進め方をまとめます。
            </p>
          </div>
          <div className={styles.imageWrap}>
            <Image
              src="/images/services01.jpg"
              alt="①戦略コンサルティング、②ITコンサルティング、③システム開発、④導入・展開、⑤運用・保守の全体図。①②がコンサルティングの主な範囲です。"
              width={1672}
              height={941}
              sizes="(max-width: 899px) calc(100vw - 40px), 700px"
              preload
            />
            {[1.2, 20.8].map((left) => (
              <span
                key={left}
                className={styles.imageFrame}
                style={{ left: `${left}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </section>
      <nav className={styles.anchorBar} aria-label="ページ内リンク">
        <div className={styles.container}>
          <a href="#consulting-scope" className={styles.initialAnchor}>
            支援範囲
          </a>
          <a href="#consulting-examples">相談例</a>
          <a href="#consulting-support">支援内容</a>
        </div>
      </nav>
      <section
        id="consulting-scope"
        className={`${styles.container} ${styles.section}`}
        aria-labelledby="scope-heading"
      >
        <h2 id="scope-heading" className={styles.srOnly}>
          支援範囲
        </h2>
        <div className={styles.diagram}>
          <div className={styles.sources}>
            <div className={styles.source}>
              <Building2 aria-hidden="true" />
              <div>
                <h3>経営の方針</h3>
                <p>
                  <span>目標・投資・</span>
                  <span>優先順位</span>
                </p>
              </div>
            </div>
            <div className={styles.source}>
              <UsersRound aria-hidden="true" />
              <div>
                <h3>現場の状況</h3>
                <p>
                  <span>業務・情報・</span>
                  <span>既存システム</span>
                </p>
              </div>
            </div>
          </div>
          <svg
            className={styles.mergeConnector}
            viewBox="0 0 100 240"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 52 H18 Q30 52 30 66 V108 Q30 120 42 120 H88 M0 188 H18 Q30 188 30 174 V132 Q30 120 42 120 M72 106 L88 120 72 134" />
          </svg>
          <div className={styles.diagramCenter}>
            <FileSearch aria-hidden="true" />
            <h3>AXEON</h3>
            <p>課題と対応方法を整理</p>
          </div>
          <ArrowRight className={styles.planConnector} aria-hidden="true" />
          <div className={styles.diagramPlan}>
            <FileText aria-hidden="true" />
            <h3>社内で検討するための計画</h3>
            <ul>
              {["変更する範囲", "着手する順番", "担当と進め方"].map((label) => (
                <li key={label}>
                  <CircleCheck aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section
        id="consulting-examples"
        className={styles.tinted}
        aria-labelledby="examples-heading"
      >
        <div className={`${styles.container} ${styles.section}`}>
          <h2 id="examples-heading" className={styles.sectionHeading}>
            相談例
          </h2>
          <ConsultingExamples />
        </div>
      </section>
      <section
        id="consulting-support"
        className={styles.section}
        aria-labelledby="support-heading"
      >
        <div className={styles.container}>
          <h2 id="support-heading" className={styles.sectionHeading}>
            支援内容
          </h2>
          <p className={styles.supportIntro}>
            相談内容に応じて、必要な支援を組み合わせます。
          </p>
        </div>
        <ul className={styles.steps}>
          {support.map(({ title, titleParts, body, icon: Icon }) => (
            <li key={title} className={styles.step}>
              <div className={styles.stepIcon}>
                <Icon aria-hidden="true" />
              </div>
              <div className={styles.stepCopy}>
                <h3>
                  {titleParts.map((part) => (
                    <span key={part}>{part}</span>
                  ))}
                </h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section
        className={styles.consultation}
        aria-labelledby="consultation-heading"
      >
        <div className={`${styles.container} ${styles.consultationInner}`}>
          <h2 id="consultation-heading">ご相談について</h2>
          <p>検討中の内容や、現在困っていることをお聞かせください。</p>
          <Link className={styles.button} href="/contact">
            お問い合わせ
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
