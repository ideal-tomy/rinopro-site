import Link from "next/link";
import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import {
  AxContactCta,
  AxEditorialIntro,
  AxProcessFlow,
  AxProse,
} from "@/components/ui/ax/patterns";
import { ChukenCasesSection } from "@/components/lp/chuken/ChukenCasesSection";
import { ChukenSiteHeader } from "@/components/lp/chuken/ChukenSiteHeader";
import { ChukenTeamSection } from "@/components/lp/chuken/ChukenTeamSection";

const CHALLENGES = [
  "社内でAI活用の議論は始まっているが、実装が進まない",
  "PoCをやってみたが、本実装に進めず止まっている",
  "大手SIerに見積もりを取ったら、予算が合わなかった",
  "ツールを導入したが、現場で使われていない",
  "社内にDXを推進できる専任人材がいない",
] as const;

const PRINCIPLES = [
  {
    label: "01 ／ STRATEGY",
    title: "「実装できる戦略」しか提案しない",
    body: "事業の中身、業務の現実、組織の力量を踏まえて、実現可能な選択肢を提案します。",
  },
  {
    label: "02 ／ EXECUTION",
    title: "PoCで終わらせない、定着まで伴走する",
    body: "本実装・運用・改善まで、同じチームで併走します。",
  },
  {
    label: "03 ／ ARTICULATION",
    title: "課題の言語化を、最重要視する",
    body: "経営層と現場、人とAI、技術と業務。それぞれの言葉を一つに繋ぐ精度を大切にします。",
  },
] as const;

const APPROACH_STEPS = [
  {
    label: "STEP 01",
    title: "現状の確認",
    body: "経営の意図と現場の実態を聞き、課題を言語化します。",
  },
  {
    label: "STEP 02",
    title: "小さく試す",
    body: "PoCで効果と負担を確かめ、本実装の条件を明確にします。",
  },
  {
    label: "STEP 03",
    title: "実装する",
    body: "現場で使える形に作り、導入と定着まで伴走します。",
  },
  {
    label: "STEP 04",
    title: "運用・改善",
    body: "使われ続ける状態を保ち、改善サイクルを回します。",
  },
] as const;

const SOLUTION_PHASES = [
  {
    num: "01",
    en: "STRATEGY",
    ja: "戦略フェーズ",
    services: [
      {
        code: "SERVICE 01",
        title: "DX戦略設計",
        desc: "「何から手をつけるか」の優先順位設計から、投資対効果を見極めた施策設計まで。専任担当がいなくても進められる進め方を組み立てます。",
        href: "/services/consulting",
      },
      {
        code: "SERVICE 05",
        title: "業界別ソリューション",
        desc: "業種固有の業務に最適化したパッケージ的支援。導入までの時間を大幅に短縮します。",
        href: "/industries/construction",
      },
    ],
  },
  {
    num: "02",
    en: "IMPLEMENTATION",
    ja: "実装フェーズ",
    services: [
      {
        code: "SERVICE 02",
        title: "AI業務アプリ開発",
        desc: "大規模なシステム刷新ではなく、業務の中で「ここを変えたら効く」というポイントに、使えるAIアプリを実装します。",
        href: "/services/insourcing-enablement",
      },
      {
        code: "SERVICE 04",
        title: "データ活用基盤構築",
        desc: "データを業務に活用できる基盤づくり。集めただけで終わらせない設計を行います。",
        href: "/services/insourcing-enablement",
      },
    ],
  },
  {
    num: "03",
    en: "OPERATION",
    ja: "運用・定着フェーズ",
    services: [
      {
        code: "SERVICE 03",
        title: "内製化支援",
        desc: "外注を続けると、コストもベンダー依存も増えがちです。社内でAIを使いこなせるチームへ、スキル移管を含めて伴走します。",
        href: "/services/insourcing-enablement",
      },
      {
        code: "SERVICE 06",
        title: "保守・運用",
        desc: "導入後の運用保守・改善で、長く使える仕組みに育てていきます。",
        href: "/services/insourcing-enablement",
      },
    ],
  },
] as const;

const FAQ = [
  {
    q: "小さく始めることはできますか？",
    a: "可能です。PoC・小規模実装からのスタートが多く、3ヶ月単位での区切りを設けて段階的に進めるケースが大半です。",
  },
  {
    q: "PoCで止まらず、本実装まで進めるには何が必要ですか？",
    a: "PoCの設計段階で「本実装で何を達成するか」を明確にしておくことが鍵です。AXEONは本実装・運用までの連続したプロセスとして設計します。",
  },
  {
    q: "専任のIT担当がいないのですが、進められますか？",
    a: "問題ありません。経営者や兼任担当者の方を窓口に、現場ヒアリングから巻き取って進めます。",
  },
  {
    q: "大手SIerと比べて、何が違いますか？",
    a: "小回りが効く少数精鋭です。代表が直接案件に伴走し、意思決定が早く、要件の変化にも柔軟に対応します。",
  },
  {
    q: "既存のベンダーや内製チームと並走できますか？",
    a: "可能です。既存パートナーを置き換えるご提案はしません。",
  },
  {
    q: "費用感はどのくらいですか？",
    a: "本実装で1,000万円〜数千万円規模が一つの目安です。詳細は初回相談でお伝えします。",
  },
] as const;

const SCOPE_ROWS = [
  ["業種実績", "製造、金融、流通、医療、小売、公共 など"],
  ["支援テーマ", "業務自動化、データ活用、業務AI化、社内DX、内製化支援、組織開発"],
  ["プロジェクト規模", "1,000万円〜数千万円規模に対応（要相談で柔軟）"],
  ["標準期間", "PoC：3ヶ月〜／本実装：6ヶ月〜"],
  ["契約形態", "業務委託 / 顧問契約 / 段階的な契約も可能"],
] as const;

const chukenDisplay = "font-[family-name:var(--font-chuken-display),serif]";
const chukenBody = "font-[family-name:var(--font-chuken-body),sans-serif]";

/**
 * 中堅企業向け LP（旧 public/lp/chuken-enterprise-v2.html）。
 * フェーズ F2: Experience / Team / Cases / Solutions / Header parity。
 */
export function ChukenEnterpriseV2Page() {
  return (
    <div
      data-ax-theme="chuken"
      className={`ax-page min-h-screen bg-[var(--ax-surface-page)] text-[var(--ax-text-body)] ${chukenBody}`}
    >
      <ChukenSiteHeader />

      <AxSection tone="default" className="!bg-[var(--ax-surface-page)]">
        <AxContainer>
          <AxEditorialIntro
            eyebrow="FOR GROWING COMPANIES"
            title={
              <>
                <span className={`block ${chukenDisplay}`}>PoCで終わらないAI導入を、</span>
                <span className={`block ${chukenDisplay}`}>
                  戦略から
                  <em className="not-italic text-[var(--ax-theme-accent,#c84a3a)]">実装</em>
                  まで一気に。
                </span>
              </>
            }
            lead={
              <p>
                大手向けの大規模プロジェクトでも、ベンダー任せの不安な開発でもなく。
                経営の意図を、現場で動くシステムに変える。少数精鋭の伴走チームです。
              </p>
            }
          />
          <p className="mt-8">
            <a
              href="/contact?from=lp-chuken-v2"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ax-theme-accent,#c84a3a)] px-6 py-3.5 text-[15px] font-bold text-white no-underline"
            >
              初回相談（無料・30分）を予約する →
            </a>
          </p>
        </AxContainer>
      </AxSection>

      <AxSection tone="surface" aria-labelledby="chuken-challenges">
        <AxContainer>
          <AxText role="eyebrow">01 · CHALLENGES</AxText>
          <AxText role="sectionTitle" id="chuken-challenges">
            こんな課題、ありませんか？
          </AxText>
          <ul className="mt-8 list-none space-y-3">
            {CHALLENGES.map((text) => (
              <li
                key={text}
                className="flex gap-3 rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] px-4 py-3.5 text-[15px] leading-[1.6] text-[var(--ax-text-heading)]"
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--ax-theme-accent,#c84a3a)]"
                  aria-hidden
                />
                {text}
              </li>
            ))}
          </ul>
          <AxProse className="mt-8">
            <p>
              一つでも当てはまる方は、まずは<strong>30分の無料相談</strong>
              から。中堅企業の実情を踏まえた、実装可能な選択肢をご提案します。
            </p>
          </AxProse>
        </AxContainer>
      </AxSection>

      <AxSection id="principles" tone="muted" aria-labelledby="chuken-principles">
        <AxContainer>
          <AxText role="eyebrow">02 · OUR PRINCIPLES</AxText>
          <AxText role="sectionTitle" id="chuken-principles">
            私たちが大切にしている、3つの考え方
          </AxText>
          <AxProse className="mt-4">
            <p>
              AI導入を、派手なプロジェクトにはしません。お客様の業務に組み込まれ、続けて使われる形を、地道に作ります。
            </p>
          </AxProse>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <article
                key={p.label}
                className="rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-5"
              >
                <p className="ax-role-ui-label text-[var(--ax-theme-accent,#c84a3a)]">
                  {p.label}
                </p>
                <h3 className="ax-role-item-title mt-3 text-[var(--ax-text-heading)]">
                  {p.title}
                </h3>
                <p className="ax-role-body mt-3 text-[var(--ax-text-supporting)]">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </AxContainer>
      </AxSection>

      <AxSection id="solutions" tone="surface" aria-labelledby="chuken-solutions">
        <AxContainer>
          <AxText role="eyebrow">03 · OUR SOLUTIONS</AxText>
          <h2
            id="chuken-solutions"
            className={`${chukenDisplay} ax-role-section-title text-[var(--ax-text-heading)]`}
          >
            <span className="block">6つのサービス領域で、</span>
            <span className="block">構想から定着まで支援します。</span>
          </h2>
          <AxProse className="mt-4">
            <p>
              戦略・実装・運用の3つのフェーズに対応する6つのサービスで、プロジェクト全体を伴走します。
            </p>
          </AxProse>

          <div className="mt-10 space-y-10">
            {SOLUTION_PHASES.map((phase) => (
              <div key={phase.num}>
                <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-[var(--ax-border-subtle)] pb-3">
                  <span className={`${chukenDisplay} text-[28px] font-semibold text-[var(--ax-brand-primary)]`}>
                    {phase.num}
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.18em] text-[var(--ax-text-supporting)]">
                    {phase.en}
                  </span>
                  <span className="text-[15px] font-bold text-[var(--ax-text-heading)]">
                    {phase.ja}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {phase.services.map((s) => (
                    <article
                      key={s.code}
                      className="rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-5"
                    >
                      <p className="ax-role-ui-label text-[var(--ax-theme-accent,#c84a3a)]">
                        {s.code}
                      </p>
                      <h3 className="ax-role-item-title mt-2 text-[var(--ax-text-heading)]">
                        {s.title}
                      </h3>
                      <p className="ax-role-body mt-3 text-[var(--ax-text-supporting)]">
                        {s.desc}
                      </p>
                      <Link
                        href={s.href}
                        className="mt-4 inline-block text-[14px] font-bold text-[var(--ax-brand-primary)] no-underline"
                      >
                        詳しく見る →
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)] p-5 sm:p-6">
            <p className="text-[16px] font-bold text-[var(--ax-text-heading)]">
              戦略から運用まで、一気通貫で支援します。
            </p>
            <p className="ax-role-body mt-2 text-[var(--ax-text-supporting)]">
              戦略コンサルティングだけ、開発会社だけ、ではなく。同じチームでプロジェクト全体を伴走することで、PoC止まりを防ぎます。
            </p>
          </div>
        </AxContainer>
      </AxSection>

      <AxSection id="approach" tone="muted" aria-labelledby="chuken-approach">
        <AxContainer>
          <AxText role="eyebrow">04 · APPROACH</AxText>
          <h2
            id="chuken-approach"
            className={`${chukenDisplay} ax-role-section-title text-[var(--ax-text-heading)]`}
          >
            <span className="block">4つのステップで、</span>
            <span className="block">確実に成果へ。</span>
          </h2>
          <AxProse className="mt-4">
            <p>最初から大きく動かさず、小さく試して確かめながら前に進みます。</p>
          </AxProse>
          <AxProcessFlow
            className="mt-10 max-md:[&>li:not(:last-child)]:relative max-md:[&>li:not(:last-child)]:pb-8 max-md:[&>li:not(:last-child)]:after:absolute max-md:[&>li:not(:last-child)]:after:bottom-2 max-md:[&>li:not(:last-child)]:after:left-1/2 max-md:[&>li:not(:last-child)]:after:h-4 max-md:[&>li:not(:last-child)]:after:w-px max-md:[&>li:not(:last-child)]:after:-translate-x-1/2 max-md:[&>li:not(:last-child)]:after:bg-[var(--ax-border-subtle)] max-md:[&>li:not(:last-child)]:after:content-['']"
            steps={[...APPROACH_STEPS]}
          />
          <p className="mt-6 text-center text-[12px] text-[var(--ax-text-supporting)]">
            ※ 期間は標準的な目安。プロジェクト規模・複雑度により変動します。
          </p>
        </AxContainer>
      </AxSection>

      <ChukenCasesSection />

      <AxSection tone="muted" aria-labelledby="chuken-experience">
        <AxContainer className="text-center">
          <AxText role="eyebrow">06 · LIVE EXPERIENCE</AxText>
          <h2
            id="chuken-experience"
            className={`${chukenDisplay} ax-role-section-title text-[var(--ax-text-heading)]`}
          >
            課題を、3分で体験してもらう。
          </h2>
          <AxProse className="mx-auto mt-4 max-w-[42rem] text-left sm:text-center">
            <p>
              各業界向けの実装プロダクトを、実際に触って試せます。詳しい話を聞く前に、リアルな動作を確かめてください。
            </p>
          </AxProse>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { num: "8", label: "Demo Products" },
              { num: "5+", label: "Industries" },
              { num: "3分", label: "平均体験時間" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] px-3 py-5"
              >
                <p
                  className={`${chukenDisplay} text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ax-brand-primary)]`}
                >
                  {stat.num}
                </p>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-[var(--ax-text-supporting)] sm:text-[12px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8">
            <Link
              href="/experience"
              className="inline-flex rounded-xl bg-[var(--ax-brand-primary)] px-6 py-3 text-[15px] font-bold text-white no-underline"
            >
              Experienceページを見る →
            </Link>
          </p>
        </AxContainer>
      </AxSection>

      <ChukenTeamSection />

      <AxSection tone="muted" aria-labelledby="chuken-scope">
        <AxContainer>
          <AxText role="eyebrow">08 · OUR SCOPE</AxText>
          <AxText role="sectionTitle" id="chuken-scope">
            ご支援可能な領域
          </AxText>
          <dl className="mt-8 divide-y divide-[var(--ax-border-subtle)] rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)]">
            {SCOPE_ROWS.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="ax-role-ui-label m-0 font-bold text-[var(--ax-text-heading)]">
                  {k}
                </dt>
                <dd className="ax-role-body m-0 text-[var(--ax-text-supporting)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </AxContainer>
      </AxSection>

      <AxSection id="faq" tone="surface" aria-labelledby="chuken-faq">
        <AxContainer>
          <AxText role="eyebrow">09 · FAQ</AxText>
          <AxText role="sectionTitle" id="chuken-faq">
            よくある質問
          </AxText>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-[16px] font-semibold text-[var(--ax-text-heading)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="ax-role-body mt-3 text-[var(--ax-text-supporting)]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </AxContainer>
      </AxSection>

      <AxSection id="company" tone="muted" aria-labelledby="chuken-company">
        <AxContainer>
          <AxText role="eyebrow">10 · COMPANY</AxText>
          <AxText role="sectionTitle" id="chuken-company">
            会社概要
          </AxText>
          <AxProse className="mt-5">
            <p>
              AXEONは、経営・事業の視点とAI実装力を結合した、少数精鋭のチームです。
              派手さよりも、現場に効く確実な成果を志しています。
            </p>
          </AxProse>
          <dl className="mt-6 space-y-2 text-[15px]">
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-bold">社名</dt>
              <dd className="m-0">AXEON株式会社</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-bold">代表者</dt>
              <dd className="m-0">秋吉 莉乃</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-bold">設立</dt>
              <dd className="m-0">2026年6月</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-bold">連絡先</dt>
              <dd className="m-0">contact@axeon.jp</dd>
            </div>
          </dl>
          <p className="mt-6">
            <Link
              href="/about"
              className="text-[14px] font-bold text-[var(--ax-brand-primary)] no-underline"
            >
              会社情報を見る →
            </Link>
          </p>
        </AxContainer>
      </AxSection>

      <AxContactCta
        id="contact"
        titleId="chuken-contact-title"
        eyebrow="LET'S TALK"
        title={
          <>
            <span className="block">まずは、お話を</span>
            <span className="block">聞かせてください。</span>
          </>
        }
        lead={
          <p>
            30分の無料相談で、課題の整理と「次の一歩」を一緒に決めます。売り込みはしません。
          </p>
        }
        primaryHref="/contact?from=lp-chuken-v2"
        primaryLabel="初回相談（無料・30分）を予約する"
        secondaryHref="/experience"
        secondaryLabel="体験デモを見る"
      />

      <footer className="border-t border-[var(--ax-border-subtle)] py-8 text-center">
        <AxContainer>
          <p className="ax-role-supporting">
            © 2026 AXEON Inc. ALL RIGHTS RESERVED.
          </p>
        </AxContainer>
      </footer>
    </div>
  );
}
