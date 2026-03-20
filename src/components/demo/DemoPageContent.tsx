"use client";

import { DemoStoryScroll } from "./DemoStoryScroll";
import { DemoMatrixSection } from "./DemoMatrixSection";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import type { DemoItem } from "@/lib/sanity/types";

interface DemoPageContentProps {
  demos: DemoItem[];
}

export function DemoPageContent({ demos }: DemoPageContentProps) {
  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {demos.length > 0 ? (
        <>
          <DemoStoryScroll
            demos={demos}
            title="実際に触って、導入後の業務変化を体感してください。"
          />
          <DemoMatrixSection demos={demos} />
        </>
      ) : (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <SkeletonShimmer key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <p className="text-text-sub">準備中です。</p>
        </div>
      )}
    </div>
  );
}
