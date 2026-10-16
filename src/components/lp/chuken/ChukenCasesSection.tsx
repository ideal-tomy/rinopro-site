import type { ReactNode } from "react";
import Link from "next/link";
import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import { AxProse } from "@/components/ui/ax/patterns";

function DummyChrome({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-[180px] flex-col overflow-hidden rounded-t-lg border border-[#d9d4c4] bg-white shadow-sm sm:h-[200px]">
      <div className="flex h-[22px] shrink-0 items-center gap-1 border-b border-[#d9d4c4] bg-[#f3eee1] px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d9d4c4]" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-[#d9d4c4]" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-[#d9d4c4]" aria-hidden />
        <span className="ml-2 text-[9px] tracking-wide text-[#8a8a8a]">{title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-2.5">{children}</div>
    </div>
  );
}

const CASES = [
  {
    name: "AI Knowledge Bot",
    sub: "社内ナレッジ共有BOT",
    desc: "数百人規模の組織で、社内問い合わせ窓口の負担が膨らんでいる方へ。属人化を解消し、社員が自分で情報にたどり着ける状態を作ります。",
    tags: ["業務全般", "情報共有"],
    href: "/experience/internal-knowledge-share-bot",
    external: false,
    preview: (
      <DummyChrome title="AI Knowledge Bot">
        <div className="space-y-2 text-[10px]">
          <div className="flex gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8e0cf] text-[8px] font-bold">
              Q
            </span>
            <span className="rounded-lg bg-[#f5f0e6] px-2 py-1.5 text-[var(--ax-text-heading)]">
              出張申請の経費精算ルールを教えて
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ax-brand-primary)] text-[8px] font-bold text-white">
              A
            </span>
            <div>
              <span className="block rounded-lg bg-white px-2 py-1.5 text-[var(--ax-text-heading)] shadow-sm">
                国内は¥30,000以内、海外は事前申請が必要です。
              </span>
              <span className="mt-1 block text-[9px] text-[var(--ax-text-supporting)]">
                📎 出典：経費規程 v2.4
              </span>
            </div>
          </div>
        </div>
      </DummyChrome>
    ),
  },
  {
    name: "受発注ダッシュボード",
    sub: "営業パイプライン管理",
    desc: "複数部門・複数担当者で受発注業務を回している方へ。営業活動の状況を一画面で可視化します。",
    tags: ["営業・営業事務"],
    href: "https://leaning-dashboard.vercel.app/?industry=sales",
    external: true,
    preview: (
      <DummyChrome title="受発注ダッシュボード">
        <div className="space-y-2 text-[10px]">
          {[
            ["商談中", "78%", "32", false],
            ["受注待ち", "42%", "12", true],
            ["受注済み", "24%", "8", false],
          ].map(([label, width, num, accent]) => (
            <div key={String(label)} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-[var(--ax-text-supporting)]">{label}</span>
              <div className="h-1.5 flex-1 rounded-full bg-[#ece7db]">
                <div
                  className={`h-full rounded-full ${accent ? "bg-[var(--ax-theme-accent,#c84a3a)]" : "bg-[var(--ax-brand-primary)]"}`}
                  style={{ width: String(width) }}
                />
              </div>
              <span className="w-6 text-right font-bold text-[var(--ax-text-heading)]">
                {num}
              </span>
            </div>
          ))}
          <div className="mt-2 grid grid-cols-3 gap-1 border-t border-[#ece7db] pt-2">
            {[
              ["今月", "¥12.4M"],
              ["先月比", "+18%"],
              ["案件数", "52"],
            ].map(([k, v]) => (
              <div key={k} className="text-center">
                <p className="text-[8px] text-[var(--ax-text-supporting)]">{k}</p>
                <p className="font-bold text-[var(--ax-text-heading)]">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </DummyChrome>
    ),
  },
  {
    name: "採用コックピット",
    sub: "採用・選考パイプライン管理",
    desc: "採用担当が少人数の方へ。応募管理・選考プロセスが散らばっている課題に対し、採用パイプラインを一画面で見える化します。",
    tags: ["人事・採用"],
    href: "https://saiyou-demo0420.vercel.app/",
    external: true,
    preview: (
      <DummyChrome title="採用コックピット">
        <div className="grid h-full grid-cols-4 gap-1.5 text-[9px]">
          {[
            ["応募", "28", 3],
            ["選考中", "12", 2],
            ["内定", "4", 1],
            ["入社", "2", 1],
          ].map(([head, count, cards]) => (
            <div key={String(head)} className="rounded bg-[#f5f0e6] p-1">
              <p className="font-bold text-[var(--ax-text-heading)]">{head}</p>
              <p className="text-[11px] font-bold text-[var(--ax-brand-primary)]">{count}</p>
              <div className="mt-1 space-y-1">
                {Array.from({ length: Number(cards) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 rounded-sm bg-white border border-[#e8e0cf]"
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DummyChrome>
    ),
  },
];

export function ChukenCasesSection() {
  return (
    <AxSection id="cases" tone="surface" aria-labelledby="chuken-cases">
      <AxContainer>
        <AxText role="eyebrow">05 · INDUSTRY SHOWCASE</AxText>
        <AxText role="sectionTitle" id="chuken-cases">
          業界別の、実装事例
        </AxText>
        <AxProse className="mt-4">
          <p>すべて、3分で体験できるデモを用意しています。</p>
        </AxProse>

        <ul className="mt-8 grid list-none gap-5 md:grid-cols-3">
          {CASES.map((c) => (
            <li
              key={c.name}
              className="overflow-hidden rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)]"
            >
              <div className="border-b border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)] p-3 pb-0">
                {c.preview}
              </div>
              <div className="bg-[var(--ax-surface-card)] p-5">
                <h3 className="ax-role-item-title text-[var(--ax-text-heading)]">{c.name}</h3>
                <p className="ax-role-supporting mt-1">{c.sub}</p>
                <p className="ax-role-body mt-3 text-[14px] text-[var(--ax-text-supporting)]">
                  {c.desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--ax-border-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--ax-text-heading)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="mt-4 inline-block text-[14px] font-bold text-[var(--ax-brand-primary)] no-underline"
                >
                  体験する →
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link
            href="/experience"
            className="inline-flex rounded-xl bg-[var(--ax-brand-primary)] px-6 py-3 text-[15px] font-bold text-white no-underline"
          >
            Experienceページで体験する →
          </Link>
        </p>
      </AxContainer>
    </AxSection>
  );
}
