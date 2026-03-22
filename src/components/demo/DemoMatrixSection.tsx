"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RrinoFoundationDiagram } from "./RrinoFoundationDiagram";
import { DemoCrossServiceLinks } from "@/components/layout/CrossServiceNav";
import {
  INDUSTRY_KEYS,
  type IndustryKey,
} from "@/lib/demo/industry-module-map";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function getSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function matchDemos(
  demos: (AiDemo | DemoItem)[],
  functionTag: string | null,
  industryKey: IndustryKey
): (AiDemo | DemoItem)[] {
  const industryLabels: Record<IndustryKey, string> = {
    construction: "建設",
    legal: "士業",
    manufacturing: "製造",
  };
  const industryValues: Record<IndustryKey, string> = {
    construction: "construction",
    legal: "legal",
    manufacturing: "manufacturing",
  };
  const functionLabels: Record<string, string> = {
    voice: "音声入力",
    search: "DB検索",
    summary: "要約",
    chat: "対話",
  };
  const targetIndustry = industryLabels[industryKey];
  const targetIndustryValue = industryValues[industryKey];
  const targetFunction = functionTag ? functionLabels[functionTag] : null;

  return demos.filter((d) => {
    const hasIndustry =
      !targetIndustry ||
      (d as AiDemo).industry === targetIndustryValue ||
      (d.industryTags ?? []).some(
        (t) => t === targetIndustry || t.includes(targetIndustry)
      );
    const hasFunction =
      !targetFunction ||
      (d.functionTags ?? []).some(
        (t) => t === targetFunction || t.includes(targetFunction)
      );
    return hasIndustry && hasFunction;
  });
}

interface DemoMatrixSectionProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoMatrixSection({ demos }: DemoMatrixSectionProps) {
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryKey | null>("construction");
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const industry = selectedIndustry ?? "construction";
  const matchedDemos = matchDemos(demos, selectedFunction, industry);
  const hasMatch = matchedDemos.length > 0;

  return (
    <section
      className="container mx-auto flex min-h-[calc(100vh-4rem)] snap-start snap-always flex-col justify-center px-4 py-24 md:px-6"
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
    >
      <h2 className="mb-2 text-center text-xl font-bold text-accent md:text-2xl">
        RRINO-AI 基盤図
      </h2>
      <p className="mb-12 text-center text-text-sub">
        機能と業種を選ぶと、この組み合わせで動くデモが表示されます。
      </p>

      <RrinoFoundationDiagram
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        selectedFunction={selectedFunction}
        onFunctionChange={setSelectedFunction}
      />

      {/* 該当デモ or 2週間メッセージ */}
      <div className="mt-12 text-center">
        {hasMatch ? (
          <div className="flex flex-wrap justify-center gap-4">
            {matchedDemos.slice(0, 3).map((demo) => {
              const slug = getSlug(demo);
              return (
                <Button key={demo._id} asChild variant="outline">
                  <Link href={slug ? `/demo/${slug}` : "#"}>{demo.title}</Link>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-silver/20 bg-base-dark px-6 py-8">
            <p className="mb-4 text-text">
              あなたの現場の課題を、2週間でデモ化します。
            </p>
            <Button asChild>
              <Link href="/contact">相談する</Link>
            </Button>
          </div>
        )}
      </div>

      {/* 下部 CTA */}
      <div className="mt-16 flex justify-center">
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </div>

      <DemoCrossServiceLinks />
    </section>
  );
}
