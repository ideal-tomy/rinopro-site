"use client";

import { useState } from "react";
import Link from "next/link";
import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import {
  AxBeforeAfter,
  AxContactCta,
  AxEditorialIntro,
  AxProductScreen,
} from "@/components/ui/ax/patterns";
import {
  KaigoAutoReportNote,
  KaigoHeroBeforeFlow,
  KaigoPermissionMatrix,
  KaigoRoadmapSection,
  KaigoSecuritySection,
} from "@/components/lp/kaigo/KaigoLpSections";
import {
  KaigoFieldView,
  KaigoMedicalView,
  KaigoOfficeView,
} from "@/components/lp/kaigo/KaigoDemoViews";

type RoleView = "field" | "office" | "medical";

const kaigoDisplay = "font-[family-name:var(--font-kaigo-display)]";

const BEFORE = [
  "報告の形式がバラバラで、確認に手間がかかる",
  "未報告・未確認が一覧で見えず、もれが起きる",
  "報告書への手転記でミスと時間ロスが発生",
  "医療者との予定共有が個別連絡頼み",
] as const;

const AFTER = [
  "選択式・ワンタップ報告で入力を標準化",
  "未報告・未確認・アラートを自動ハイライト",
  "報告から報告書ドラフトを自動生成し承認するだけ",
  "看護師×医師の予定を1つのカレンダーで共有",
] as const;

const ROLE_LABELS: Record<RoleView, string> = {
  field: "現場スタッフ",
  office: "内勤・管理者",
  medical: "医療連携（外部）",
};

export function KaigoCareDxPage() {
  const [role, setRole] = useState<RoleView>("field");

  return (
    <div data-ax-theme="care" className="ax-page min-h-screen bg-[var(--ax-surface-page)]">
      <header className="sticky top-0 z-30 border-b border-[var(--ax-border-subtle)] bg-[color-mix(in_srgb,var(--ax-surface-page)_90%,transparent)] backdrop-blur">
        <AxContainer className="flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="text-[16px] font-bold tracking-wide text-[var(--ax-text-heading)] no-underline"
          >
            AXEON
          </Link>
          <nav className="hidden gap-4 text-[13px] text-[var(--ax-text-supporting)] sm:flex">
            <a href="#demo" className="hover:text-[var(--ax-brand-primary)]">
              デモ
            </a>
            <a href="#core" className="hover:text-[var(--ax-brand-primary)]">
              中核機能
            </a>
            <a href="#sec" className="hover:text-[var(--ax-brand-primary)]">
              セキュリティ
            </a>
            <a href="#kaigo-road" className="hover:text-[var(--ax-brand-primary)]">
              進め方
            </a>
          </nav>
          <a
            href="#contact-kaigo"
            className="rounded-full bg-[var(--ax-brand-primary)] px-4 py-2 text-[13px] font-bold text-white no-underline"
          >
            PoCのご相談
          </a>
        </AxContainer>
      </header>

      <AxSection tone="default" className="!bg-[var(--ax-surface-page)]">
        <AxContainer>
          <AxEditorialIntro
            eyebrow="障害福祉・訪問看護・訪問診療 DX 提案"
            title={
              <>
                <span className="block">現場は入力するだけ。</span>
                <span className={`block ${kaigoDisplay}`}>
                  <span className="relative">
                    報告書まで自動で作成
                    <span
                      className="absolute -bottom-1 left-0 right-0 -z-10 h-3.5 bg-[#faead2]"
                      aria-hidden
                    />
                  </span>
                </span>
              </>
            }
            lead={
              <p>
                LINE Worksの報告を内勤が目視で確認し、Excelや書類へ手転記する——その属人的な連鎖を、ひとつの構造化データに集約します。確認もれ・転記ミスをゼロに近づけ、本来向き合うべき利用者さんとの時間を取り戻すための業務基盤です。
              </p>
            }
            visual={<KaigoHeroBeforeFlow />}
          />
        </AxContainer>
      </AxSection>

      <AxSection tone="surface" aria-labelledby="kaigo-problem">
        <AxContainer>
          <AxText role="eyebrow">解決する課題</AxText>
          <h2
            id="kaigo-problem"
            className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.4] text-[var(--ax-text-heading)]`}
          >
            <span className="block">「人の目と手」が律速になっている業務を、</span>
            <span className="block">仕組みで置き換える。</span>
          </h2>
          <AxBeforeAfter
            className="mt-8"
            beforeItems={BEFORE}
            afterItems={AFTER}
            beforeLabel="現状 / AS-IS"
            afterLabel="提案 / TO-BE"
          />
        </AxContainer>
      </AxSection>

      <section
        id="demo"
        className="scroll-mt-24 bg-[var(--ax-theme-demo-bg,#11342c)] py-[var(--ax-section-standard-y)] text-[var(--ax-theme-demo-fg,#eaf0ed)]"
        aria-labelledby="kaigo-demo"
      >
        <AxContainer>
          <p className="mb-3 text-[12px] font-bold tracking-[0.22em] text-[var(--ax-theme-accent,#de8e33)]">
            インタラクティブ・デモ
          </p>
          <h2
            id="kaigo-demo"
            className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-snug text-white`}
          >
            立場ごとに、見える画面も権限も変わる。
          </h2>
          <p className="mt-3 max-w-[54ch] text-[15.5px] leading-[1.7] text-[var(--ax-theme-demo-muted,#a9c2b9)]">
            同じシステムでも、現場スタッフ・内勤管理者・外部の医療者では表示と操作できる範囲が異なります。タブを切り替えて、それぞれの体験をご確認ください。
          </p>

          <div
            className="mt-8 inline-flex flex-wrap gap-1 rounded-xl border border-slate-400/30 bg-white/10 p-1"
            role="tablist"
            aria-label="役割の切り替え"
          >
            {(Object.keys(ROLE_LABELS) as RoleView[]).map((id) => {
              const tabId = `kaigo-tab-${id}`;
              const panelId = `kaigo-panel-${id}`;
              const selected = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  id={tabId}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  className={
                    selected
                      ? "rounded-lg bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#0F4438]"
                      : "rounded-lg px-4 py-2.5 text-[13.5px] font-bold text-[var(--ax-theme-demo-muted,#a9c2b9)]"
                  }
                  onClick={() => setRole(id)}
                >
                  {ROLE_LABELS[id]}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <div
              id="kaigo-panel-field"
              role="tabpanel"
              aria-labelledby="kaigo-tab-field"
              hidden={role !== "field"}
            >
              {role === "field" ? <KaigoFieldView /> : null}
            </div>
            <div
              id="kaigo-panel-office"
              role="tabpanel"
              aria-labelledby="kaigo-tab-office"
              hidden={role !== "office"}
            >
              {role === "office" ? <KaigoOfficeView /> : null}
            </div>
            <div
              id="kaigo-panel-medical"
              role="tabpanel"
              aria-labelledby="kaigo-tab-medical"
              hidden={role !== "medical"}
            >
              {role === "medical" ? <KaigoMedicalView /> : null}
            </div>
          </div>
        </AxContainer>
      </section>

      <AxSection id="core" tone="surface" aria-labelledby="kaigo-core">
        <AxContainer>
          <AxText role="eyebrow">中核機能 — 報告書の自動生成</AxText>
          <h2
            id="kaigo-core"
            className={`${kaigoDisplay} text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.4] text-[var(--ax-text-heading)]`}
          >
            <span className="block">バラバラな報告を、提出できる書類に。</span>
            <span className="block">転記の手間を、確認だけに。</span>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)] p-5">
              <p className="ax-role-ui-label mb-3">LINE Works ＞ さくらホーム報告</p>
              <p className="rounded-xl bg-[var(--ax-surface-card)] p-3 text-[13px] leading-[1.7] text-[var(--ax-text-body)]">
                田中さん 10時訪問。血圧132/84、体温36.4。朝の薬きちんと飲めました。体調良好で食欲もあり。
              </p>
            </div>
            <p className="text-center text-[var(--ax-brand-primary)]" aria-hidden>
              →
            </p>
            <AxProductScreen urlLabel="report / draft" badge="AI 自動構造化">
              <dl className="space-y-2 text-[14px]">
                <div className="flex gap-3 border-b border-[var(--ax-border-subtle)] py-2">
                  <dt className="w-20 shrink-0 font-bold text-[var(--ax-text-supporting)]">
                    利用者
                  </dt>
                  <dd className="m-0">田中 様</dd>
                </div>
                <div className="flex gap-3 border-b border-[var(--ax-border-subtle)] py-2">
                  <dt className="w-20 shrink-0 font-bold text-[var(--ax-text-supporting)]">
                    バイタル
                  </dt>
                  <dd className="m-0">血圧 132/84　体温 36.4℃</dd>
                </div>
                <div className="flex gap-3 py-2">
                  <dt className="w-20 shrink-0 font-bold text-[var(--ax-text-supporting)]">
                    服薬
                  </dt>
                  <dd className="m-0">朝食後 確認済</dd>
                </div>
              </dl>
            </AxProductScreen>
          </div>
          <KaigoAutoReportNote />
        </AxContainer>
      </AxSection>

      <KaigoPermissionMatrix />
      <KaigoSecuritySection />
      <KaigoRoadmapSection />

      <AxContactCta
        id="contact-kaigo"
        titleId="kaigo-contact-title"
        eyebrow="NEXT STEP"
        title={
          <>
            <span className="block">まずは、現状を見せてください。</span>
          </>
        }
        lead={
          <p>
            今お使いのExcelと報告フローを拝見するところから始めます。1〜2拠点の小さなPoCで、確認・転記にかかる時間がどれだけ減るかを、実際の数字でお示しします。
          </p>
        }
        primaryHref="/contact"
        primaryLabel="PoCについて相談する"
        secondaryHref="/experience"
        secondaryLabel="ほかの体験を見る"
      />

      <footer className="border-t border-[var(--ax-border-subtle)] py-8 text-center">
        <AxContainer>
          <p className="ax-role-supporting">
            © AXEON株式会社 — 障害福祉・訪問看護・訪問診療 業務DX 提案
          </p>
        </AxContainer>
      </footer>
    </div>
  );
}
