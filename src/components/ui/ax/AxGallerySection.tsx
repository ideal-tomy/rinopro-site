import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import {
  AxBeforeAfter,
  AxContactCta,
  AxDecisionComparison,
  AxEditorialIntro,
  AxProcessFlow,
  AxProductScreen,
  AxProse,
} from "@/components/ui/ax/patterns";

/** prototype-showroom 向け共通部品カタログ（フェーズ B） */
export function AxGallerySection() {
  return (
    <AxSection
      id="ax-ui-gallery"
      tone="muted"
      aria-labelledby="ax-gallery-heading"
    >
      <AxContainer>
        <AxText role="eyebrow">AXEON UI</AxText>
        <AxText role="sectionTitle" id="ax-gallery-heading">
          共通タイポロールと表現パターン
        </AxText>
        <AxProse className="mt-6">
          <p>
            docs/最終改善/AXEON_UI共通ルール.md の実寸サンプルです。新規ページはこれらの部品を優先してください。
          </p>
        </AxProse>

        <div className="mt-12 space-y-10 rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-6 md:p-10">
          <div className="space-y-3">
            <p className="ax-role-eyebrow">eyebrow</p>
            <p className="ax-role-display">display 見出し</p>
            <p className="ax-role-page-title">page-title</p>
            <p className="ax-role-section-title">section-title</p>
            <p className="ax-role-item-title">item-title</p>
            <p className="ax-role-lead">lead — 要旨用のリード文です。</p>
            <p className="ax-role-body">body — 標準本文 16px。サイトの基準サイズです。</p>
            <p className="ax-role-supporting">supporting — 注釈・キャプション</p>
            <p className="ax-role-ui-label">ui-label</p>
          </div>

          <AxEditorialIntro
            eyebrow="EditorialIntro"
            title={
              <>
                <span className="block">何を変えるか。</span>
                <span className="block text-[var(--ax-brand-primary)]">
                  どこから始めるか。
                </span>
              </>
            }
            lead={<p>経営の方針と現場の状況を確認し、課題を整理します。</p>}
          />

          <AxProcessFlow
            steps={[
              {
                label: "STEP 1",
                title: "現在の業務を確認",
                body: "担当者から話を聞き、業務の流れを確認します。",
              },
              {
                label: "STEP 2",
                title: "改善案を比較",
                body: "費用や効果、導入に必要な作業を比べます。",
              },
              {
                label: "STEP 3",
                title: "実行計画にまとめる",
                body: "先に実施する内容と担当者を決めます。",
              },
            ]}
          />

          <AxDecisionComparison
            items={[
              {
                title: "業務と課題の整理",
                body: "誰が何を担当し、どこで時間がかかっているかを確認します。",
              },
              {
                title: "対応方法の比較",
                body: "運用変更、既存ツール、システム改修を比較します。",
              },
            ]}
          />

          <AxBeforeAfter
            beforeItems={["同じ情報を複数回入力", "報告が属人的"]}
            afterItems={["入力箇所を減らす", "確認すべき項目が前に出る"]}
          />

          <AxProductScreen urlLabel="gallery.axeon / preview" badge="SAMPLE">
            <p className="ax-role-body">操作画面フレームのサンプルです。</p>
          </AxProductScreen>

          <div className="space-y-4 border-t border-[var(--ax-border-subtle)] pt-8">
            <AxText role="itemTitle">部品契約プレビュー（フェーズ E）</AxText>
            <p className="ax-role-supporting">
              docs/ui-migration/component-contracts.md — home.demo-featured-article /
              home.implementation-showcase-card
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="flex min-h-[160px] flex-col rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)] p-4">
                <p className="ax-role-ui-label mb-2">demo-featured 右スロット</p>
                <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)]">
                  <span className="ax-role-supporting">min-h 280 / 320</span>
                </div>
              </article>
              <article className="flex h-full min-h-[160px] flex-col overflow-hidden rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)]">
                <div className="aspect-video shrink-0 bg-[var(--ax-surface-muted)]" />
                <div className="flex flex-1 flex-col p-4">
                  <p className="ax-role-item-title">implementation-showcase</p>
                  <p className="ax-role-supporting mt-2">h-full + flex-col</p>
                </div>
              </article>
            </div>
          </div>

          <figure className="ax-evidence-paper" aria-label="Evidence サンプル">
            <div className="ax-evidence-paper__header">
              <p>検討資料</p>
              <p>SAMPLE</p>
            </div>
            <p className="ax-evidence-paper__title">サンプル業務</p>
            <p className="ax-evidence-paper__meta">構成例</p>
          </figure>
        </div>
      </AxContainer>

      <div className="mt-12">
        <AxContactCta
          titleId="ax-gallery-cta"
          title={
            <>
              <span className="block">課題の整理や計画づくりだけでも</span>
              <span className="block">ご相談いただけます。</span>
            </>
          }
          lead={<p>ContactCTA パターンのプレビューです。</p>}
          primaryHref="/contact"
          primaryLabel="お問い合わせ"
          secondaryHref="/services"
          secondaryLabel="ご支援内容を見る"
        />
      </div>
    </AxSection>
  );
}
