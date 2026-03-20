"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface DemoDetailContentProps {
  demo: DemoItem;
}

export function DemoDetailContent({ demo }: DemoDetailContentProps) {
  const tags = [
    ...(demo.functionTags ?? []),
    ...(demo.industryTags ?? []),
    ...(demo.moduleTags ?? []),
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
        {demo.title}
      </h1>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-full px-3 py-1 text-xs",
                "border border-silver/30 bg-base-dark text-text-sub"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 動画 or 画像 */}
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

      {/* 説明 */}
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

      {/* 導線 */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/demo">一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
