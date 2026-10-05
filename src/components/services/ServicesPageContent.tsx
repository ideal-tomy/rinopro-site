import Link from "next/link";
import { supportHubCopy, supportPillars } from "@/lib/content/support-pillars";
import { servicesValueBandCopy } from "@/lib/content/services-embedded-copy";
import styles from "./services-page.module.css";

const readingTerms = /(?:社内|論点|コード|本実装|権限|範囲|定着|運用|設計|制約|関係者|データ基盤)/;

function ServiceText({ text }: { text: string }) {
  return text.split(new RegExp(`(${readingTerms.source})`)).map((part, index) =>
    readingTerms.test(part)
      ? <span className={styles.phrase} key={index}>{part}</span>
      : part,
  );
}

export function ServicesPageContent() {
  return (
    <div className={`services-page ${styles.page}`}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <h1>{supportHubCopy.title}</h1>
          <div className={styles.introDescription}>
            <p><ServiceText text={supportHubCopy.purpose} /></p>
            <nav className={styles.anchors} aria-label="ご支援内容のページ内リンク">
              {supportPillars.map((pillar) => (
                <a key={pillar.id} href={`#${pillar.id}`}>
                  {pillar.title} <span aria-hidden="true">↓</span>
                </a>
              ))}
            </nav>
          </div>
        </header>
      </div>
      {supportPillars.map((pillar) => (
        <section key={pillar.id} id={pillar.id} className={styles.service}
          aria-labelledby={`${pillar.id}-heading`}>
          <div className={`${styles.container} ${styles.serviceGrid}`}>
            <div className={styles.overview}>
              <p className={styles.kicker}>{pillar.kicker}</p>
              <h2 id={`${pillar.id}-heading`}>{pillar.title}</h2>
              <p className={styles.lead}><ServiceText text={pillar.audience} /></p>
              <p className={styles.body}><ServiceText text={pillar.lead} /></p>
            </div>
            <dl className={styles.workItems}>
              {pillar.workItems.map((item) => (
                <div key={item.title} className={styles.workItem}>
                  <dt>{item.title}</dt>
                  <dd><ServiceText text={item.body} /></dd>
                </div>
              ))}
            </dl>
            <Link href={pillar.href} className={styles.detailLink}>
              {pillar.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      ))}
      <section className={`${styles.container} ${styles.process}`} aria-labelledby="services-process-heading">
        <div className={styles.processIntro}>
          <h2 id="services-process-heading">成功の大半は、<br className={styles.mobileBreak} />作る前に決まる</h2>
          <p><ServiceText text={servicesValueBandCopy.lead} /></p>
        </div>
        <ol className={styles.steps}>
          {servicesValueBandCopy.journeySteps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.stepNumber}>{step.number}</span>
              <p className={styles.stepLabel}>{step.duration}</p>
              <h3>{step.title}</h3>
              <p className={styles.stepDescription}><ServiceText text={step.description} /></p>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${styles.container} ${styles.cta}`} aria-labelledby="services-contact-heading">
        <h2 id="services-contact-heading">課題の整理から、<br className={styles.mobileBreak} />ご相談ください。</h2>
        <Link className={styles.contactButton} href="/contact">問い合わせ <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
