"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import {
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";

interface DemoStoryScrollProps {
  demos: (AiDemo | DemoItem)[];
  title?: string;
}

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
        "inline-block rounded-full px-3 py-1 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AIデモ" : "モックデモ（実運用時の出力イメージ）"}
    </span>
  );
}

export function DemoStoryScroll({ demos, title }: DemoStoryScrollProps) {
  if (demos.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-text-sub">準備中です。</p>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* 冒頭タイトルパネル */}
      <div
        className="flex min-h-screen snap-start flex-col items-center justify-center px-4"
        style={{ scrollSnapAlign: "start" }}
      >
        <h1 className="mb-4 text-center text-2xl font-bold text-accent md:text-3xl">
          {title ?? "実際に触って、導入後の業務変化を体感してください。"}
        </h1>
        <p className="mb-8 text-center text-text-sub">
          スクロールして各デモをご覧ください
        </p>
      </div>

      {/* 1デモ＝1パネル */}
      {demos.map((demo, i) => {
        const slug = getSlug(demo);
        const imageUrl = demo.image?.url;
        const oneLiner = demo.oneLiner ?? demo.description;
        const functionTags = demo.functionTags ?? [];
        const industryTags = demo.industryTags ?? [];

        return (
          <div
            key={demo._id}
            className="relative flex min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-16"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* 背景グラデーション（星空風） */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 50%, color-mix(in srgb, var(--color-glow) 14%, transparent) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "flex w-full max-w-2xl flex-col items-center text-center",
                "md:max-w-3xl md:rounded-2xl md:border md:border-silver/20 md:bg-base-dark/20 md:px-10 md:py-12",
                "lg:max-w-4xl lg:px-14 lg:py-14"
              )}
            >
              {imageUrl && (
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl lg:mb-8">
                  <Image
                    src={imageUrl}
                    alt={demo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority={i < 2}
                  />
                </div>
              )}
              <div className="mb-3 flex flex-col items-center gap-3">
                <RunModeBadge demo={demo} />
                <h2 className="text-3xl font-semibold text-text md:text-4xl lg:text-5xl">
                  {demo.title}
                </h2>
              </div>
              {oneLiner && (
                <p className="mb-6 line-clamp-2 text-lg text-text-sub md:mb-8 md:text-xl lg:text-2xl">
                  {oneLiner}
                </p>
              )}
              {(functionTags.length > 0 || industryTags.length > 0) && (
                <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10">
                  {functionTags.slice(0, 2).map((t) => (
                    <span
                      key={`fn-${t}`}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
                        getFunctionTagClass(t)
                      )}
                    >
                      {t}
                    </span>
                  ))}
                  {industryTags.slice(0, 2).map((t) => (
                    <span
                      key={`ind-${t}`}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium md:px-4 md:py-1.5 md:text-sm",
                        getIndustryTagClass(t)
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <Button asChild size="lg" className="px-8 text-[1rem] md:px-10 md:text-lg">
                <Link href={slug ? `/demo/${slug}` : "#"}>体験する</Link>
              </Button>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}
