"use client";

import shared from "./service-landing-shared.module.css";
import styles from "./enablement-page.module.css";
import { ServicePageLinks } from "./ServicePageNavigation";
import navigation from "./service-navigation.module.css";
import { useEnablementSectionReveal } from "./useEnablementSectionReveal";
import { headingAccentRuleClasses } from "@/lib/ui/heading-accent-rule-styles";
import { EnablementPreSupportCards } from "./EnablementPreSupportCards";
import { EnablementExternalItSections } from "./EnablementExternalItSections";
import { SERVICE_HERO_PROCESS_PAGE_CONFIG } from "@/lib/content/service-hero-process-stages";
import { ServiceFlowDiagram } from "./ServiceFlowDiagram";
import { axLayout } from "@/lib/ui/ax-typography";
import { AxPhrases } from "@/components/ui/ax/AxPhrases";

export function EnablementPage() {
  const checksReveal = useEnablementSectionReveal();
  return (
    <div
      className={`ax-page ${shared.page} ${styles.page} ${navigation.page}`}
      data-ax-theme="corporate"
      data-scroll-reveal="off"
      data-service-page
    >
      <ServicePageLinks current="enablement" />
      <section
        className={`${shared.hero} ${shared.heroExternal}`}
        aria-labelledby="enablement-title"
      >
        <div className={`${shared.container} ${shared.heroColumns}`}>
          <div>
            <h1
              id="enablement-title"
              className={`${shared.heroTitle} ${shared.lines}`}
            >
              <span>IT担当を、</span>
              <span className={shared.accent}>社内で雇わない</span>
              <span>という選択。</span>
            </h1>
            <p className={shared.heroBody}>
              <span className="block">
                <AxPhrases
                  phrases={[
                    "社内に専任者を置かず、",
                    "AXEONが外部のIT担当として",
                    "継続的に対応します。",
                  ]}
                />
              </span>
              <span className="block">
                <AxPhrases
                  phrases={[
                    "日々のIT相談から、",
                    "システムの管理・改善、",
                    "新しい技術の検討まで。",
                  ]}
                />
              </span>
            </p>
            <p className={shared.heroStrong}>
              必要な仕事を、必要な範囲で任せられます。
            </p>
          </div>
          <ServiceFlowDiagram
            highlightedStageIds={
              SERVICE_HERO_PROCESS_PAGE_CONFIG.enablement.highlightedStageIds
            }
          />
        </div>
      </section>
      <section
        ref={checksReveal}
        id="checks"
        className={`${axLayout.sectionStandard} ${styles.checksSection}`}
        aria-labelledby="checks-title"
      >
        <div className={axLayout.containerWide}>
          <h2 id="checks-title" className={headingAccentRuleClasses.default}>
            支援を始める前に
          </h2>
          <p className={styles.intro}>
            <AxPhrases
              phrases={["現在の体制や業務に合わせて、", "担当する範囲と進め方を確認します。"]}
            />
          </p>
          <EnablementPreSupportCards />
        </div>
      </section>
      <EnablementExternalItSections />
      <ServicePageLinks current="enablement" bottom />
    </div>
  );
}
