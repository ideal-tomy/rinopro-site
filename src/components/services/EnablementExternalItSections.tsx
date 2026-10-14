import Link from "next/link";
import { ArrowRight } from "lucide-react";
import shared from "./service-landing-shared.module.css";
import styles from "./enablement-page.module.css";

const reasons = [
  {
    number: "01",
    title: "採用だけに頼らない",
    body: "候補者のスキルを見極めたり、IT担当者を採用・育成したりする負担を抑えられます。",
  },
  {
    number: "02",
    title: "必要な専門知識に対応する",
    body: "システム、AI、セキュリティなど、課題に応じて必要な知識や対応方法を検討します。",
  },
  {
    number: "03",
    title: "事業に合わせて契約を見直す",
    body: "必要な仕事が変わったときは、業務範囲や契約内容の変更を相談できます。",
  },
];

const roles = [
  {
    label: "日常の対応",
    title: "社内からのIT相談",
    body: "PCやクラウドサービスの困りごとを確認し、対応方法を案内します。",
  },
  {
    label: "アカウント管理",
    title: "利用環境の管理",
    body: "社員の入退社に伴うアカウント管理や設定作業などを支援します。",
  },
  {
    label: "外部との調整",
    title: "IT業者とのやり取り",
    body: "保守会社やサービス提供会社への問い合わせ、調整を担当します。",
  },
  {
    label: "改善・導入",
    title: "システムの見直し",
    body: "使いにくい業務や重複する作業を確認し、改善方法を検討します。",
  },
  {
    label: "新技術への対応",
    title: "AI・新ツールの検討",
    body: "新しい技術が自社の業務に使えるか調べ、試す方法を提案します。",
  },
  {
    label: "運用体制",
    title: "安全に使うための確認",
    body: "権限、バックアップ、更新状況など、運用上の注意点を確認します。",
  },
];

const HIRE = "社内でIT担当を採用";
const EXTERNAL = "AXEONと外部契約";

const comparisons = [
  {
    point: "対応できる業務",
    hire: "採用した人の経験・専門分野による",
    external: "契約範囲に応じ、必要な対応を相談できる",
  },
  {
    point: "費用の考え方",
    hire: "給与・社会保険・採用などに費用がかかる",
    external: "契約内容に応じた委託費用がかかる",
  },
  {
    point: "体制の見直し",
    hire: "採用・配置・教育を社内で行う",
    external: "契約条件に沿って業務範囲や継続を見直す",
  },
  {
    point: "日々の連携",
    hire: "社内に担当者がおり、その場で状況を確認しやすい",
    external: "窓口・連絡手段・対応時間を決めて運用する",
  },
];

const flow = [
  {
    number: "01",
    title: "現状を確認する",
    body: "利用中のシステム、困りごと、社内の担当状況を把握します。",
  },
  {
    number: "02",
    title: "担当範囲を決める",
    body: "対応する業務、連絡先、対応時間、費用を決めます。",
  },
  {
    number: "03",
    title: "窓口を設けて対応する",
    body: "相談を受け、必要な確認や作業を進めます。",
  },
  {
    number: "04",
    title: "定期的に見直す",
    body: "業務量や新しい課題に合わせて、担当範囲を検討します。",
  },
];

export function EnablementExternalItSections() {
  return (
    <>
      <section
        className={`${shared.section} ${shared.ruled}`}
        aria-labelledby="why-heading"
      >
        <div className={`${shared.container} ${shared.split} ${styles.whySplit}`}>
          <div>
            <p className={shared.label}>
              <span>WHY EXTERNAL IT</span>
              <span>外部に任せる理由</span>
            </p>
            <h2 id="why-heading" className={`${shared.heading} ${shared.lines}`}>
              <span>採用する前に、</span>
              <span>
                <span className={shared.accent}>外部契約</span>という方法も。
              </span>
            </h2>
            <p className={shared.body}>
              ITに詳しい社員が必要だと感じても、一人の担当者ですべてに対応できるとは限りません。採用・育成の負担や、必要な知識が変化することも考える必要があります。
            </p>
            <p className={shared.body}>
              AXEONに任せる方法なら、対応範囲と費用を確認してから始められます。
            </p>
          </div>
          <ol className={`${shared.lineList} ${shared.numbered}`}>
            {reasons.map((reason) => (
              <li key={reason.number}>
                <span className={shared.marker}>{reason.number}</span>
                <div>
                  <h3 className={shared.itemTitle}>{reason.title}</h3>
                  <p className={shared.itemBody}>{reason.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="external-roles"
        className={`${shared.section} ${styles.scopeSection}`}
        aria-labelledby="scope-heading"
      >
        <div className={shared.container}>
          <p className={shared.label}>
            <span>SCOPE OF SUPPORT</span>
            <span>任せられる仕事</span>
          </p>
          <h2 id="scope-heading" className={`${shared.heading} ${shared.lines}`}>
            <span>ITの相談先を、</span>
            <span>社内で探さなくていい。</span>
          </h2>
          <p className={shared.body}>
            社員からの質問に答えるだけでなく、日々の管理、外部業者との連絡、システム改善の検討などを継続的に担当します。
          </p>
          <ul className={styles.scopeGrid}>
            {roles.map((role) => (
              <li key={role.title}>
                <p className={styles.scopeLabel}>{role.label}</p>
                <h3 className={shared.itemTitle}>{role.title}</h3>
                <p className={shared.itemBody}>{role.body}</p>
              </li>
            ))}
          </ul>
          <p className={shared.note}>
            ※ 上記は対応内容の例です。実際の担当範囲、対応時間、現地対応の有無などは契約時に決めます。
          </p>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="contract-heading">
        <div className={shared.container}>
          <p className={shared.label}>
            <span>CONTRACT MODEL</span>
            <span>採用と外部契約</span>
          </p>
          <h2 id="contract-heading" className={`${shared.heading} ${shared.lines}`}>
            <span>社員を採用する方法と、</span>
            <span>何が違うのか。</span>
          </h2>
          <p className={shared.body}>
            どちらが適しているかは、日常の業務量や社内の体制によって変わります。必要な支援を見極めるための比較です。
          </p>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">比較すること</th>
                <th scope="col">{HIRE}</th>
                <th scope="col" className={styles.compareExternal}>
                  {EXTERNAL}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row.point}>
                  <th scope="row">{row.point}</th>
                  <td data-label={HIRE}>{row.hire}</td>
                  <td data-label={EXTERNAL} className={styles.compareExternal}>
                    {row.external}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={shared.note}>
            ※ 外部契約がすべての企業に適しているわけではありません。常駐や即時対応が多く必要な企業には、社内採用が向く場合もあります。解約・変更条件は契約内容に従います。
          </p>
        </div>
      </section>

      <section
        className={`${shared.section} ${shared.tint}`}
        aria-labelledby="flow-heading"
      >
        <div className={shared.container}>
          <p className={shared.label}>
            <span>HOW IT WORKS</span>
            <span>支援の進め方</span>
          </p>
          <h2 id="flow-heading" className={`${shared.heading} ${shared.lines}`}>
            <span>任せる仕事を決めて、</span>
            <span>
              外部のIT担当として
              <wbr />
              始める。
            </span>
          </h2>
          <p className={shared.body}>
            最初から社内のIT業務をすべて任せる必要はありません。現在の体制を確認して、必要な範囲から始めます。
          </p>
          <ol className={`${shared.steps} ${styles.flowSteps}`}>
            {flow.map((step) => (
              <li key={step.number}>
                <p className={shared.stepNumber}>{step.number}</p>
                <h3 className={shared.itemTitle}>{step.title}</h3>
                <p className={shared.itemBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="our-role-heading">
        <div className={`${shared.container} ${shared.split} ${styles.roleSplit}`}>
          <div>
            <p className={shared.label}>
              <span>OUR ROLE</span>
              <span>AXEONが担うこと</span>
            </p>
            <h2 id="our-role-heading" className={`${shared.heading} ${shared.lines}`}>
              <span>ITの判断を、</span>
              <span>
                一人で抱える
                <wbr />
                必要はありません。
              </span>
            </h2>
          </div>
          <div>
            <p className={shared.body}>
              社内の業務について決めるのは、お客様です。AXEONは技術面の確認や提案、実際の対応を担当します。
            </p>
            <p className={shared.body}>
              経営や現場の判断と、専門的なIT対応を分けることで、社内の担当者が本来の業務に集中できる体制を目指します。
            </p>
            <p className={shared.note}>
              何を変えるべきか決まっていない場合は、先にコンサルティングで課題や優先順位を整理することもできます。
            </p>
            <div className={shared.actions}>
              <Link href="/services/consulting" className={shared.textLink}>
                コンサルティングを見る<span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-enablement"
        className={`${shared.contact} ${styles.contactBand}`}
        aria-labelledby="external-contact-heading"
      >
        <div className={shared.container}>
          <p className={shared.label}>
            <span>CONTACT</span>
          </p>
          <h2
            id="external-contact-heading"
            className={`${shared.heading} ${shared.lines}`}
          >
            <span>
              IT担当の採用を
              <wbr />
              考える前に、
            </span>
            <span>
              外部へ任せる方法も
              <wbr />
              ご相談ください。
            </span>
          </h2>
          <p className={shared.body}>
            社内のIT担当がいない場合も、兼任の担当者が手いっぱいの場合も。今の状況を伺い、対応できる範囲と進め方をご案内します。
          </p>
          <div className={shared.actions}>
            <Link className={shared.contactButton} href="/contact">
              お問い合わせ
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
