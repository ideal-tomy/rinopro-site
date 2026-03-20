"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function getSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function RunModeBadge({ demo }: { demo: AiDemo | DemoItem }) {
  if ((demo as AiDemo)._type !== "aiDemo") return null;
  const runMode = (demo as AiDemo).runMode ?? "mock_preview";
  const isLive = runMode === "ai_live";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

interface DemoListContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoListContent({ demos }: DemoListContentProps) {
  if (demos.length === 0) {
    return (
      <p className="py-16 text-center text-text-sub">デモは準備中です。</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {demos.map((demo) => {
        const slug = getSlug(demo);
        const imageUrl = demo.image?.url;
        const oneLiner = demo.oneLiner ?? demo.description;
        const tags = [
          ...(demo.functionTags ?? []),
          ...(demo.industryTags ?? []),
        ].slice(0, 3);

        return (
          <div
            key={demo._id}
            className="flex flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/30"
          >
            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={demo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center gap-2">
                <RunModeBadge demo={demo} />
                <h2 className="font-semibold text-text">{demo.title}</h2>
              </div>
              {oneLiner && (
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-text-sub">
                  {oneLiner}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-silver/10 px-2 py-0.5 text-xs text-text-sub"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href={slug ? `/demo/${slug}` : "#"}>体験する</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
