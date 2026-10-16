import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import { AxProse } from "@/components/ui/ax/patterns";

const kaigoDisplay = "font-[family-name:var(--font-kaigo-display)]";
const kaigoMono = "font-[family-name:var(--font-kaigo-mono)]";

const BEFORE_FLOW = [
  {
    title: "現場からLINE Worksで報告",
    body: "自由記述・口頭ベースで届く",
    tone: "default" as const,
  },
  {
    title: "内勤が一件ずつ目視で確認",
    body: "もれ・見落としのリスク",
    tone: "warn" as const,
  },
  {
    title: "報告書・Excelへ手転記",
    body: "時間がかかり、転記ミスも発生",
    tone: "highlight" as const,
  },
];

type Perm = "full" | "part" | "none";

const MATRIX_ROWS: { label: string; perms: Perm[] }[] = [
  {
    label: "報告の入力",
    perms: ["full", "full", "part", "part", "none"],
  },
  {
    label: "担当拠点の閲覧",
    perms: ["part", "part", "full", "none", "full"],
  },
  {
    label: "全拠点の俯瞰",
    perms: ["none", "none", "full", "none", "full"],
  },
  {
    label: "報告書の承認・確定",
    perms: ["none", "part", "full", "none", "none"],
  },
  {
    label: "医療連携・予定共有",
    perms: ["none", "full", "full", "part", "none"],
  },
  {
    label: "スタッフ・権限管理",
    perms: ["none", "none", "full", "none", "part"],
  },
];

const MATRIX_COLS = [
  "現場スタッフ",
  "自社 看護師",
  "内勤・管理者",
  "外部 医療者",
  "経営者",
];

const SECURITY_CARDS = [
  {
    tag: "ACCESS",
    title: "RBAC＋拠点データ分離",
    body:
      "役割と拠点に応じて、見える情報・操作を厳密に制御。「自分に関係しないデータには到達できない」構造を基盤にします。",
  },
  {
    tag: "LOG",
    title: "全操作の監査ログ",
    body:
      "誰が・いつ・どの利用者の・どの情報を見た/編集したかを記録。外部医療者の閲覧も含め追跡可能にします。",
  },
  {
    tag: "CRYPTO",
    title: "通信・保存の暗号化",
    body:
      "通信経路・保存データの双方を暗号化。端末紛失時の遮断や、退職・異動時の即時権限失効フローを用意します。",
  },
  {
    tag: "GOVERN",
    title: "同意・第三者提供の運用",
    body:
      "利用目的の明示と同意取得、医療機関連携のルール化、保管・バックアップ・漏えい時の報告体制まで整備します。",
  },
] as const;

const ROADMAP = [
  {
    num: "01",
    phase: "2〜3週",
    title: "業務ヒアリング",
    body: "現行のExcel・帳票・報告フローを実物で確認し、最も効果が出る範囲を特定します。",
  },
  {
    num: "02",
    phase: "PoC / 1〜2拠点",
    title: "小さく試す",
    body: "1〜2拠点に限定して報告〜報告書自動化を試行。Before/Afterで効果を数値化します。",
  },
  {
    num: "03",
    phase: "段階展開",
    title: "横展開",
    body: "効果を確認しながら拡大。権限・医療連携・セキュリティを本格運用に。",
  },
  {
    num: "04",
    phase: "継続",
    title: "定着と改善",
    body: "現場の声を反映し継続改善。訪問診療連携など、対象業務を広げていきます。",
  },
] as const;

function PermBadge({ level }: { level: Perm }) {
  const styles: Record<Perm, string> = {
    full: "bg-[#dceee5] text-[#3b8c6c]",
    part: "bg-[#faead2] text-[#9c6418]",
    none: "bg-[#f0efea] text-[var(--ax-text-supporting)]",
  };
  const label = level === "full" ? "●" : level === "part" ? "◐" : "−";
  return (
    <span
      className={`inline-grid h-6 w-6 place-items-center rounded-md text-[12px] font-bold ${styles[level]}`}
    >
      {label}
    </span>
  );
}

export function KaigoHeroBeforeFlow() {
  return (
    <div className="rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-5 shadow-[0_24px_60px_rgba(20,40,34,0.12)]">
      <p className={`${kaigoMono} mb-4 text-[12px] font-bold tracking-[0.12em] text-[var(--ax-text-supporting)]`}>
        業務の流れ — Before
      </p>
      <ul className="list-none space-y-0">
        {BEFORE_FLOW.map((step, i) => (
          <li key={step.title}>
            <div
              className={
                step.tone === "highlight"
                  ? "rounded-[13px] bg-gradient-to-br from-[#175e51] to-[#0f4438] p-3.5 text-white"
                  : "rounded-[13px] bg-[var(--ax-surface-muted)] p-3.5"
              }
            >
              <h4 className="text-[13.5px] font-bold leading-snug">{step.title}</h4>
              <p
                className={
                  step.tone === "highlight"
                    ? "mt-1 text-[11.5px] leading-[1.5] text-[#cfe4dd]"
                    : "mt-1 text-[11.5px] leading-[1.5] text-[var(--ax-text-supporting)]"
                }
              >
                {step.body}
              </p>
            </div>
            {i < BEFORE_FLOW.length - 1 ? (
              <p className="py-1 text-center text-[var(--ax-border-subtle)]" aria-hidden>
                ↓
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KaigoPermissionMatrix() {
  return (
    <AxSection tone="default" className="!bg-[var(--ax-surface-page)]" aria-labelledby="kaigo-matrix">
      <AxContainer>
        <AxText role="eyebrow" className={kaigoMono}>
          権限設計 — ロールベースアクセス制御
        </AxText>
        <h2
          id="kaigo-matrix"
          className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.4] text-[var(--ax-text-heading)]`}
        >
          「自分に関係する範囲しか見えない」を、原則に。
        </h2>
        <div className="mt-8 overflow-x-auto rounded-[14px] border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)]">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-[var(--ax-surface-muted)]">
                <th className="border-b border-[var(--ax-border-subtle)] px-4 py-3 text-left font-bold">
                  機能 / データ
                </th>
                {MATRIX_COLS.map((col) => (
                  <th
                    key={col}
                    className="border-b border-l border-[var(--ax-border-subtle)] px-3 py-3 text-center text-[11px] font-bold text-[var(--ax-text-supporting)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-[var(--ax-border-subtle)] last:border-b-0">
                  <td className="border-r border-[var(--ax-border-subtle)] px-4 py-3 font-bold">
                    {row.label}
                  </td>
                  {row.perms.map((p, i) => (
                    <td key={i} className="border-l border-[var(--ax-border-subtle)] px-3 py-3 text-center">
                      <PermBadge level={p} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] italic text-[var(--ax-text-supporting)]">
          ● 全範囲　◐ 限定（担当・許可された範囲のみ）　− 不可。外部医療者は限定ポータル経由でアクセスします。
        </p>
      </AxContainer>
    </AxSection>
  );
}

export function KaigoSecuritySection() {
  return (
    <AxSection id="sec" tone="surface" aria-labelledby="kaigo-sec">
      <AxContainer>
        <AxText role="eyebrow" className={kaigoMono}>
          セキュリティ — 要配慮個人情報を扱う前提
        </AxText>
        <h2
          id="kaigo-sec"
          className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.4] text-[var(--ax-text-heading)]`}
        >
          信頼を預かるシステムとして、設計する。
        </h2>
        <div className="mt-6 flex gap-3.5 rounded-[14px] border border-[#ebc4b8] bg-[#f7e2dc] p-5">
          <span className="text-[#be5239]" aria-hidden>⚠</span>
          <p className="text-[13.5px] leading-[1.7] text-[#7a3a2a]">
            本システムが扱う情報の大半は、障害・病歴・診療情報といった
            <strong className="text-[#be5239]">「要配慮個人情報」</strong>
            です。医療情報の安全管理に関するガイドラインの考え方に沿って設計します（正式提案前に準拠水準を再確認します）。
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SECURITY_CARDS.map((card) => (
            <article
              key={card.tag}
              className="relative overflow-hidden rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-page)] p-6"
            >
              <span
                className={`${kaigoMono} absolute right-4 top-4 text-[10px] tracking-[0.1em] text-[var(--ax-text-supporting)]`}
              >
                {card.tag}
              </span>
              <div className="mb-4 grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[var(--ax-brand-primary)] text-white">
                ●
              </div>
              <h3 className="text-[16px] font-bold text-[var(--ax-text-heading)]">
                {card.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.75] text-[var(--ax-text-supporting)]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </AxContainer>
    </AxSection>
  );
}

export function KaigoRoadmapSection() {
  return (
    <AxSection tone="surface" aria-labelledby="kaigo-road">
      <AxContainer>
        <AxText role="eyebrow" className={kaigoMono}>
          導入の進め方 — スモールスタート
        </AxText>
        <h2
          id="kaigo-road"
          className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.4] text-[var(--ax-text-heading)]`}
        >
          <span className="block">いきなり全面導入ではなく、</span>
          <span className="block">低リスクの PoC から始める。</span>
        </h2>
        <ol className="mt-10 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((step, index) => (
            <li key={step.num} className="relative text-center">
              <div
                className={
                  index === 0
                    ? "mx-auto grid h-11 w-11 place-items-center rounded-full bg-[var(--ax-brand-primary)] font-[family-name:var(--font-kaigo-mono)] text-[15px] font-bold text-white"
                    : "mx-auto grid h-11 w-11 place-items-center rounded-full border-2 border-[var(--ax-brand-primary)] bg-[var(--ax-surface-card)] font-[family-name:var(--font-kaigo-mono)] text-[15px] font-bold text-[var(--ax-brand-primary)]"
                }
              >
                {step.num}
              </div>
              <p className={`${kaigoMono} mt-4 text-[11px] font-bold tracking-wide text-[var(--ax-theme-accent,#de8e33)]`}>
                {step.phase}
              </p>
              <h3 className="mt-2 text-[15px] font-bold text-[var(--ax-text-heading)]">
                {step.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-[var(--ax-text-supporting)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </AxContainer>
    </AxSection>
  );
}

export function KaigoAutoReportNote() {
  return (
    <AxProse className="mt-6">
      <p className="text-[12px] italic text-[var(--ax-text-supporting)]">
        ※ 自動生成はあくまで「ドラフト」です。最終的な記録の確定は、内勤・担当者の確認と承認を経て行う設計とし、責任の所在を明確にします。
      </p>
    </AxProse>
  );
}
