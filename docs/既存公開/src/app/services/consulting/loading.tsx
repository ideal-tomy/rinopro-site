import { PageShell } from "@/components/layout/PageShell";
import shared from "@/components/services/service-landing-shared.module.css";

export default function Loading() {
  return (
    <PageShell>
      <div className={shared.page} data-scroll-reveal="off">
        <section className={`${shared.hero} ${shared.heroConsulting}`}>
          <div className={shared.container}>
            <h1 className={`${shared.heroTitle} ${shared.lines}`}>
              <span>何を変えるか。</span>
              <span className={shared.accent}>どこから始めるか。</span>
            </h1>
            <p className={shared.heroBody}>
              経営の方針と現場の状況を確認し、課題を整理します。改善案を比較したうえで、取り組む範囲と進め方を決めます。
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
