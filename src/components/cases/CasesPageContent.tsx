"use client";

import { CaseCard } from "./CaseCard";
import { PageSectionWithScroll, StaggerGrid } from "@/components/layout/PageSectionWithScroll";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import type { CaseStudy } from "@/lib/sanity/types";

interface CasesPageContentProps {
  cases: CaseStudy[];
}

export function CasesPageContent({ cases }: CasesPageContentProps) {
  return (
    <PageSectionWithScroll
      title="業界別の導入実績と、現場での活用シーン。"
      cta={{ href: "/contact", label: "相談する" }}
    >
      {cases.length > 0 ? (
        <StaggerGrid cols="2" layout="list">
          {cases.map((c) => (
            <CaseCard key={c._id} caseStudy={c} />
          ))}
        </StaggerGrid>
      ) : (
        <div className="mb-12 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonShimmer key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}
    </PageSectionWithScroll>
  );
}
