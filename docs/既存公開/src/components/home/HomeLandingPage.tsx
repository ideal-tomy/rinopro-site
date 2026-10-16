import { HomeCeoMessageSection } from "@/components/home/HomeCeoMessageSection";
import { HomeDemoFirstShowcase } from "@/components/home/HomeDemoFirstShowcase";
import { HomeBrandStorySection } from "@/components/home/HomeBrandStorySection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFirstView } from "@/components/home/HomeFirstView";
import { HomeIndustryShowcaseSection } from "@/components/home/HomeIndustryShowcaseSection";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeValuesSection } from "@/components/home/HomeValuesSection";

/** 現行トップページのセクション構成。表示順の変更はここで行う。 */
export function HomeLandingPage() {
  return (
    <>
      <div className="home-landing-copy home-top">
        <HomeFirstView />
        <HomeBrandStorySection />
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
