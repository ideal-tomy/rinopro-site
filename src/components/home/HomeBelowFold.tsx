"use client";

import { PageSectionDivider } from "@/components/layout/PageSectionDivider";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeCompanyTeaser } from "@/components/home/HomeCompanyTeaser";
import { HomeDemoEvidenceSection } from "@/components/home/HomeDemoEvidenceSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeSeoEntrySection } from "@/components/home/HomeSeoEntrySection";

export function HomeBelowFold() {
  return (
    <>
      <div className="py-14 md:py-24">
        <PageSectionDivider />
      </div>

      <HomeDemoEvidenceSection />

      <div className="py-14 md:py-24">
        <PageSectionDivider />
      </div>

      <HomeSeoEntrySection />

      <div className="py-14 md:py-24">
        <PageSectionDivider />
      </div>

      <HomeFaqSection />

      <div className="py-14 md:py-24">
        <PageSectionDivider />
      </div>

      <HomeCompanyTeaser />

      <div className="py-14 md:py-24">
        <PageSectionDivider />
      </div>

      <HomeClosingCta />
    </>
  );
}
