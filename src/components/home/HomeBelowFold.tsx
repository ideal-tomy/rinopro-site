"use client";

import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeCompanyTeaser } from "@/components/home/HomeCompanyTeaser";
import { HomeDemoEvidenceSection } from "@/components/home/HomeDemoEvidenceSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeSeoEntrySection } from "@/components/home/HomeSeoEntrySection";

export function HomeBelowFold() {
  return (
    <>
      <HomeSectionShell>
        <HomeDemoEvidenceSection />
      </HomeSectionShell>

      {/* dividerの数は半減: 章境界として残すのは「実績→業種別」「FAQ→会社情報」の2箇所のみ */}
      <div className="py-10 md:py-16">
        <PageSectionDivider />
      </div>

      <HomeSectionShell tone="alt">
        <HomeSeoEntrySection />
      </HomeSectionShell>

      <HomeSectionShell>
        <HomeFaqSection />
      </HomeSectionShell>

      <div className="py-10 md:py-16">
        <PageSectionDivider />
      </div>

      <HomeSectionShell tone="alt">
        <HomeCompanyTeaser />
      </HomeSectionShell>

      <HomeSectionShell>
        <HomeClosingCta />
      </HomeSectionShell>
    </>
  );
}
