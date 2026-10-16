import { PageShell } from "@/components/layout/PageShell";
import styles from "@/components/services/consulting-final.module.css";

export default function Loading() {
  return (
    <PageShell>
      <div className={styles.page} data-scroll-reveal="off">
        <section className={styles.hero} aria-busy="true" aria-label="読み込み中">
          <div className={styles.container}>
            <p className={styles.kicker}>コンサルティング</p>
            <h1 className={styles.heroTitle}>
              <span>何を変えるか。</span>
              <span className={styles.accent}>どこから始めるか。</span>
            </h1>
            <p className={styles.lead}>
              <span>経営の方針と現場の状況を確認し、課題を整理します。</span>
              <span>改善案を比較したうえで、取り組む範囲と進め方を決めます。</span>
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
