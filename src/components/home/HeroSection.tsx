import { HomeCeoMessageSection } from "@/components/home/HomeCeoMessageSection";
import { HomeDemoFirstShowcase } from "@/components/home/HomeDemoFirstShowcase";
import { HomeEmpathyCards } from "@/components/home/HomeEmpathyCards";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFirstView } from "@/components/home/HomeFirstView";
import { HomeIndustryShowcaseSection } from "@/components/home/HomeIndustryShowcaseSection";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeValuesSection } from "@/components/home/HomeValuesSection";

export function HeroSection() {
  return (
    <>
      <div className="home-landing-copy">
        <HomeFirstView />
        <HomeEmpathyCards />
        <HomeSectionShell tone="pure">
          <HomeDemoFirstShowcase />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeIndustryShowcaseSection />
        </HomeSectionShell>
        <HomeValuesSection />
        <HomeSectionShell>
          <HomeCeoMessageSection />
        </HomeSectionShell>
        <HomeSectionShell tone="pure">
          <HomeFaqSection />
        </HomeSectionShell>
        <HomeSectionShell>
          <HomeClosingCta />
        </HomeSectionShell>
      </div>
    </>
  );
}
