"use client";

import { useState } from "react";
import { IndustryShowcaseSection } from "@/components/home/IndustryShowcaseSection";
import { PatternCaseGrid } from "@/components/home/PatternCaseGrid";
import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { cn } from "@/lib/utils";

const copy = homeLandingCopy.seoEntries;

export function HomeSeoEntrySection() {
  const [activeTab, setActiveTab] = useState<"industry" | "pattern">("industry");

  return (
    <div
      id="industry"
      className="border-t border-transparent scroll-mt-32"
      role="region"
      aria-labelledby="home-seo-entries-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-[120px]">
        <HomeLandingSectionHeading
          id="home-seo-entries-heading"
          index={copy.sectionIndex}
          kicker={copy.sectionKicker}
          title={copy.heading}
          description={copy.intro}
        />
        <div
          role="tablist"
          aria-label="業種・業務の切り替え"
          className="mt-8 flex items-center justify-center gap-2 md:mt-10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "industry"}
            aria-controls="home-seo-entry-panel-industry"
            id="home-seo-entry-tab-industry"
            className={cn(
              "clickable-element rounded-full border px-4 py-2 text-[14px] font-medium transition-[color,background-color,border-color,transform,opacity] md:text-[15px]",
              activeTab === "industry"
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-silver/25 bg-white/[0.02] text-white/80 hover:border-accent/45 hover:text-white"
            )}
            onClick={() => setActiveTab("industry")}
          >
            業種から探す
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "pattern"}
            aria-controls="home-seo-entry-panel-pattern"
            id="home-seo-entry-tab-pattern"
            className={cn(
              "clickable-element rounded-full border px-4 py-2 text-[14px] font-medium transition-[color,background-color,border-color,transform,opacity] md:text-[15px]",
              activeTab === "pattern"
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-silver/25 bg-white/[0.02] text-white/80 hover:border-accent/45 hover:text-white"
            )}
            onClick={() => setActiveTab("pattern")}
          >
            業務から探す
          </button>
        </div>
      </div>
      <div
        id="home-seo-entry-panel-industry"
        role="tabpanel"
        aria-labelledby="home-seo-entry-tab-industry"
        hidden={activeTab !== "industry"}
      >
        <IndustryShowcaseSection nested showHeading={false} />
      </div>
      <div
        id="home-seo-entry-panel-pattern"
        role="tabpanel"
        aria-labelledby="home-seo-entry-tab-pattern"
        hidden={activeTab !== "pattern"}
      >
        <PatternCaseGrid nested showHeading={false} />
      </div>
    </div>
  );
}
