"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DemoRuntimePanel } from "./DemoRuntimePanel";
import { DemoCrossServiceLinks } from "@/components/layout/CrossServiceNav";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import {
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";
import { ExperiencePrototypeRunner } from "@/components/experience/ExperiencePrototypeRunner";
import {
  getExperiencePrototypeBySlug,
  getExperienceUrlForDemoSlug,
} from "@/lib/experience/prototype-registry";

function isAiDemo(demo: AiDemo | DemoItem): demo is AiDemo {
  return (demo as AiDemo)._type === "aiDemo" || "systemPrompt" in demo;
}

function getDemoSlugCurrent(demo: AiDemo | DemoItem): string | undefined {
  const s = demo.slug;
  if (s == null) return undefined;
  if (typeof s === "string") return s;
  return s.current;
}

interface DemoDetailContentProps {
  demo: AiDemo | DemoItem;
}

export function DemoDetailContent({ demo }: DemoDetailContentProps) {
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];
  const hasTags = functionTags.length > 0 || industryTags.length > 0;

  const runMode = isAiDemo(demo) ? (demo.runMode ?? "mock_preview") : null;
  const isLive = runMode === "ai_live";

  const hasDemoPanel =
    isAiDemo(demo) &&
    (demo.systemPrompt ||
      (demo.runMode === "mock_preview" &&
        (demo.mockOutputPrimary || demo.mockOutputSecondary)));

  const demoSlugStr = getDemoSlugCurrent(demo);
  const immersiveProto = demoSlugStr
    ? getExperiencePrototypeBySlug(demoSlugStr)
    : undefined;
  const useImmersiveFirst = Boolean(immersiveProto?.immersiveOnDemoDetail);

  const experienceHref =
    isAiDemo(demo) &&
    (demo.experienceUrl ?? getExperienceUrlForDemoSlug(demoSlugStr));
  const experienceIsExternal =
    typeof experienceHref === "string" && experienceHref.startsWith("http");

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-6 md:py-16 md:px-6",
        useImmersiveFirst ? "max-w-6xl" : "max-w-3xl"
      )}
    >
      {/* 1. タイトル（モバイルでコンパクト） */}
      <div className="mb-3 flex flex-wrap items-center gap-2 md:mb-4 md:gap-3">
        {runMode !== null && (
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
              isLive
                ? "border border-accent/50 bg-accent/10 text-accent"
                : "border border-silver/40 bg-silver/10 text-text-sub"
            )}
          >
            {isLive ? "実AIデモ" : "モックデモ（実運用時の出力イメージ）"}
          </span>
        )}
        <h1 className="text-xl font-bold text-accent md:text-3xl">
          {demo.title}
        </h1>
      </div>

      {/* 2. カテゴリタグ（モバイルでコンパクト） */}
      {hasTags && (
        <div className="mb-4 flex flex-wrap gap-1.5 md:mb-8 md:gap-2">
          {functionTags.map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
                getFunctionTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
          {industryTags.map((t) => (
            <span
              key={`ind-${t}`}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {experienceHref && useImmersiveFirst ? (
        <p className="mb-4 text-sm text-text-sub md:text-[1rem]">
          下の画面が操作の中心です。{" "}
          <Link
            href={experienceHref}
            className="text-accent underline-offset-2 hover:underline"
          >
            体験専用ページ
          </Link>
          でも同じ内容を開けます。
        </p>
      ) : experienceHref ? (
        <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm md:text-base">
          <p className="mb-2 text-text-sub">
            画面操作の体験版（プロトタイプ）があります。
          </p>
          <Button asChild variant="outline" size="sm" className="border-action/50">
            <a
              href={experienceHref}
              {...(experienceIsExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {experienceIsExternal
                ? "体験版を別タブで開く"
                : "体験版を開く"}
            </a>
          </Button>
        </div>
      ) : null}

      {useImmersiveFirst && immersiveProto ? (
        <div className="mb-8">
          <ExperiencePrototypeRunner meta={immersiveProto} />
        </div>
      ) : null}

      {/* 3. チャット画面＋サンプル */}
      {hasDemoPanel && useImmersiveFirst ? (
        <details
          className="mb-8 rounded-xl border border-silver/25 bg-base-dark/50 [&>summary::-webkit-details-marker]:hidden"
        >
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-text transition-colors hover:text-accent md:text-[1rem]">
            チャット形式でも試す（モックストリーム）
          </summary>
          <div className="border-t border-silver/20 px-4 pb-4 pt-2">
            <DemoRuntimePanel demo={demo} />
          </div>
        </details>
      ) : hasDemoPanel ? (
        <div className="mb-8">
          <DemoRuntimePanel demo={demo} />
        </div>
      ) : null}

      {/* 4. 説明エリア（スクロールで下に） */}
      {demo.videoUrl ? (
        <div className="mb-8 aspect-video overflow-hidden rounded-xl">
          <video
            src={demo.videoUrl}
            controls
            className="h-full w-full object-cover"
            poster={demo.videoPoster}
          >
            お使いのブラウザは動画再生に対応していません。
          </video>
        </div>
      ) : (
        demo.image?.url && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={demo.image.url}
              alt={demo.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )
      )}

      {demo.description && (
        <p className="mb-8 text-text">{demo.description}</p>
      )}

      {demo.highlights && demo.highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text">できること</h2>
          <ul className="list-inside list-disc space-y-2 text-text-sub">
            {demo.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {demo.howItHelps && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text">こんな人におすすめ</h2>
          <p className="text-text-sub">{demo.howItHelps}</p>
        </div>
      )}

      {demo.moduleTags && demo.moduleTags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text">構成モジュール</h2>
          <div className="flex flex-wrap gap-2">
            {demo.moduleTags.map((m) => (
              <span
                key={m}
                className={cn(
                  "rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-text"
                )}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 導線（ctaTitle / ctaButtonText は aiDemo 用） */}
      <div className="flex flex-wrap gap-4">
        {(isAiDemo(demo) && (demo.ctaTitle || demo.ctaButtonText)) ? (
          <>
            {demo.ctaTitle && (
              <p className="w-full text-text-sub">{demo.ctaTitle}</p>
            )}
            <Button asChild>
              <Link href="/contact">
                {demo.ctaButtonText ?? "相談する"}
              </Link>
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link href="/contact">相談する</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/demo">一覧に戻る</Link>
        </Button>
      </div>

      <DemoCrossServiceLinks />
    </div>
  );
}
