import { HomeCeoMessageSection } from "@/components/home/HomeCeoMessageSection";
import { HomeEmpathyCards } from "@/components/home/HomeEmpathyCards";
import { HomeFirstView } from "@/components/home/HomeFirstView";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeSolutionsSection } from "@/components/home/HomeSolutionsSection";
import { HomeServiceFlowRow } from "@/components/home/HomeServiceFlowRow";
import { HomeValuesSection } from "@/components/home/HomeValuesSection";
import { HomeImplementationShowcaseSection } from "@/components/home/HomeImplementationShowcaseSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeCompanyTeaser } from "@/components/home/HomeCompanyTeaser";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";

export function HeroSection() {
  return (
    <>
      <div className="home-landing-copy">
        <HomeFirstView />
        <HomeSectionShell tone="warm">
          <HomeEmpathyCards />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeImplementationShowcaseSection />
        </HomeSectionShell>
        <HomeSectionShell tone="pure">
          <HomeValuesSection />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeCeoMessageSection />
        </HomeSectionShell>
        <HomeSectionShell tone="pure">
          <HomeSolutionsSection />
        </HomeSectionShell>
        <HomeSectionShell tone="neutral">
          <HomeServiceFlowRow />
        </HomeSectionShell>
        <HomeSectionShell tone="pure">
          <HomeFaqSection />
        </HomeSectionShell>
        <HomeSectionShell tone="neutral">
          <HomeCompanyTeaser />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeClosingCta />
        </HomeSectionShell>
      </div>
    </>
  );
}
