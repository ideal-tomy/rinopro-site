"use client";

import { ConsultingExamples } from "./ConsultingInteractions";
import { ConsultingResultSample } from "./ConsultingResultSample";
import { ServicePageLinks } from "./ServicePageNavigation";
import { SERVICE_HERO_PROCESS_PAGE_CONFIG } from "@/lib/content/service-hero-process-stages";
import { ServiceFlowDiagram } from "./ServiceFlowDiagram";
import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import {
  AxContactCta,
  AxDecisionComparison,
  AxEditorialIntro,
  AxProcessFlow,
  AxProse,
} from "@/components/ui/ax/patterns";
import styles from "./consulting-final.module.css";

const roles = [
  {
    title: "業務と課題の整理",
    body: "誰が何を担当し、どこで時間がかかっているかを確認します。",
  },
  {
    title: "対応方法の比較",
    body: "運用の変更、既存ツールの活用、システム改修・導入を比較します。",
  },
  {
    title: "優先順位の検討",
    body: "効果、費用、実施の難しさを考え、先に取り組む範囲を決めます。",
  },
  {
    title: "実行計画の作成",
    body: "担当する人、進める順番、成果の確認方法を整理します。",
  },
] as const;

const steps = [
  {
    label: "STEP 1",
    title: "現在の業務を確認",
    body: "担当者から話を聞き、業務の流れや実際に使っている資料・システムを確認します。",
  },
  {
    label: "STEP 2",
    title: "改善案を比較",
    body: "対応方法ごとに、費用や効果、導入に必要な作業を比べます。",
  },
  {
    label: "STEP 3",
    title: "実行計画にまとめる",
    body: "先に実施する内容と、担当者、確認する項目を決めます。",
  },
] as const;

export function ConsultingPage() {
  return (
    <div className={`ax-page ${styles.page}`} data-ax-theme="corporate" data-service-page>
      <ServicePageLinks current="consulting" />

      <AxSection tone="surface" className={styles.hero} aria-labelledby="consulting-heading">
        <AxContainer>
          <div className={styles.heroGrid}>
            <AxEditorialIntro
              eyebrow="コンサルティング"
              titleId="consulting-heading"
              title={
                <>
                  <span className="block">何を変えるか。</span>
                  <span className={`block ${styles.accent}`}>どこから始めるか。</span>
                </>
              }
              lead={
                <>
                  <span className="block">
                    経営の方針と現場の状況を確認し、課題を整理します。
                  </span>
                  <span className="block">
                    改善案を比較したうえで、取り組む範囲と進め方を決めます。
                  </span>
                </>
              }
              split={false}
            />
            <ServiceFlowDiagram
              highlightedStageIds={
                SERVICE_HERO_PROCESS_PAGE_CONFIG.consulting.highlightedStageIds
              }
            />
          </div>
        </AxContainer>
      </AxSection>

      <AxSection
        id="consulting-details"
        tone="muted"
        aria-labelledby="role-heading"
      >
        <AxContainer>
          <AxText role="eyebrow">支援の内容</AxText>
          <AxText role="sectionTitle" id="role-heading">
            状況を確認し、判断材料をそろえる。
          </AxText>
          <AxProse className="mt-5">
            <p>
              システムの導入が最初から答えとは限りません。業務の進め方を変えるだけで改善できる場合もあります。
            </p>
            <p>方法を決めつけず、費用や負担も含めて比較します。</p>
          </AxProse>
          <AxDecisionComparison className="mt-12" items={roles} />
        </AxContainer>
      </AxSection>

      <AxSection tone="surface" aria-labelledby="work-heading">
        <AxContainer>
          <AxText role="eyebrow">進め方</AxText>
          <AxText role="sectionTitle" id="work-heading">
            整理する。比較する。進め方を決める。
          </AxText>
          <AxProse className="mt-5">
            <p>
              まず現在の仕事を把握し、複数の方法から現実的な案を選びます。検討だけで終了することもできます。
            </p>
          </AxProse>
          <AxProcessFlow className="mt-12" steps={steps} />
        </AxContainer>
      </AxSection>

      <AxSection
        id="consulting-examples"
        tone="muted"
        aria-labelledby="examples-heading"
      >
        <AxContainer>
          <AxText role="eyebrow">ご相談例</AxText>
          <AxText role="sectionTitle" id="examples-heading">
            例えば、こんなご相談から。
          </AxText>
          <AxProse className="mt-5">
            <p>解決方法が決まっていない段階でも、ご相談いただけます。</p>
          </AxProse>
          <ConsultingExamples />
        </AxContainer>
      </AxSection>

      <AxSection tone="surface" aria-labelledby="result-heading">
        <AxContainer>
          <div className={styles.resultGrid}>
            <div>
              <AxText role="eyebrow">成果物</AxText>
              <AxText role="sectionTitle" id="result-heading">
                社内で説明し、判断できる資料に。
              </AxText>
              <AxProse className="mt-5">
                <p>
                  検討した内容は、関係者が確認できる形にまとめます。相談内容に応じて、業務の整理資料や改善案、実行計画などを作成します。
                </p>
                <p className="ax-role-supporting">
                  ※ 図は構成例です。作成する資料は、ご依頼の範囲によって異なります。
                </p>
              </AxProse>
            </div>
            <ConsultingResultSample />
          </div>
        </AxContainer>
      </AxSection>

      <AxContactCta
        id="contact-consulting"
        titleId="consultation-heading"
        title={
          <>
            <span className="block">課題の整理や計画づくりだけでも</span>
            <span className="block">ご相談いただけます。</span>
          </>
        }
        lead={
          <>
            <span className="block">困っていることや検討中の内容をお聞かせください。</span>
            <span className="block">開発に進むかどうかも含めて、一緒に考えます。</span>
          </>
        }
        primaryHref="/contact"
        primaryLabel="お問い合わせ"
        secondaryHref="/services/insourcing-enablement"
        secondaryLabel="開発・運用の伴走を見る"
      />

      <ServicePageLinks current="consulting" bottom />
    </div>
  );
}
