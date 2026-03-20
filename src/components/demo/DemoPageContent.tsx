"use client";

import Link from "next/link";
import { List } from "lucide-react";
import { DemoStoryScroll } from "./DemoStoryScroll";
import { DemoMatrixSection } from "./DemoMatrixSection";
import { SkeletonShimmer } from "@/components/ui/skeleton";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

const REPRESENTATIVE_COUNT = 3;

interface DemoPageContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoPageContent({ demos }: DemoPageContentProps) {
  const representativeDemos = demos.slice(0, REPRESENTATIVE_COUNT);

  return (
    <div className="relative">
      <div
        className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory overscroll-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {demos.length > 0 ? (
          <>
            <DemoStoryScroll
              demos={representativeDemos}
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

      {/* 一覧ボタン（固定・下・目立ち過ぎない） */}
      {demos.length > REPRESENTATIVE_COUNT && (
        <Link
          href="/demo/list"
          className="fixed bottom-20 left-4 z-30 flex items-center gap-2 rounded-full border border-silver/30 bg-base-dark/90 px-4 py-2.5 text-sm text-text-sub backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent md:bottom-24 md:left-6"
          aria-label="デモ一覧を見る"
        >
          <List className="h-4 w-4" />
          <span>一覧</span>
        </Link>
      )}
    </div>
  );
}
