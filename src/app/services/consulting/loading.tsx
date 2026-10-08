import { PageShell } from "@/components/layout/PageShell";
import styles from "@/components/services/consulting-page.module.css";

export default function Loading() {
  return (
    <PageShell>
      <div className={styles.page} data-scroll-reveal="off">
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>コンサルティング</h1>
            <p className={styles.lead}>
              業務やシステムの見直しを、計画づくりから支援します。
            </p>
            <p>
              経営の方針と現場の状況を確認し、取り組む範囲と進め方をまとめます。
            </p>
          </div>
        </section>
        <section
          id="consulting-scope"
          className={`${styles.container} ${styles.section}`}
          aria-label="支援範囲"
        >
          <div className={styles.diagram}>
            <div className={styles.sources}>
              <div className={styles.source}>
                <div>
                  <h3>経営の方針</h3>
                  <p>目標・投資・優先順位</p>
                </div>
              </div>
              <div className={styles.source}>
                <div>
                  <h3>現場の状況</h3>
                  <p>業務・情報・既存システム</p>
                </div>
              </div>
            </div>
            <svg
              className={styles.planConnector}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
            <div className={styles.diagramCenter}>
              <h3>AXEON</h3>
              <p>課題と対応方法を整理</p>
            </div>
            <svg
              className={styles.planConnector}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
            <div className={styles.diagramPlan}>
              <h3>社内で検討するための計画</h3>
              <ul>
                <li>変更する範囲</li>
                <li>着手する順番</li>
                <li>担当と進め方</li>
              </ul>
            </div>
          </div>
        </section>
        <section
          id="consulting-support"
          className={`${styles.container} ${styles.section}`}
        >
          <h2 className={styles.sectionHeading}>支援内容</h2>
          <p className={styles.supportIntro}>
            相談内容に応じて、必要な支援を組み合わせます。
          </p>
          <ul>
            <li>
              業務と課題の整理：業務の流れと、困っている箇所を確認します。
            </li>
            <li>投資と着手順の検討：効果・費用・実施の難しさを比較します。</li>
            <li>
              システム・データの整理：既存システムと、情報の受け渡しを整理します。
            </li>
            <li>
              実行と検証の計画：担当・進め方・効果の確認方法をまとめます。
            </li>
          </ul>
        </section>
        <section className={styles.consultation}>
          <div className={`${styles.container} ${styles.consultationInner}`}>
            <h2>ご相談について</h2>
            <p>検討中の内容や、現在困っていることをお聞かせください。</p>
            <a className={styles.button} href="/contact">
              お問い合わせ →
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
