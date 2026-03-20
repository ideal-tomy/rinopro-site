"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface DemoStoryScrollProps {
  demos: DemoItem[];
  title?: string;
}

function getSlug(demo: DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
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
        const tags = [
          ...(demo.functionTags ?? []),
          ...(demo.industryTags ?? []),
        ].slice(0, 4);

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
                  "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,242,255,0.08) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex max-w-2xl flex-col items-center text-center"
            >
              {imageUrl && (
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl">
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
              <h2 className="mb-2 text-xl font-semibold text-text md:text-2xl">
                {demo.title}
              </h2>
              {oneLiner && (
                <p className="mb-4 line-clamp-2 text-text-sub">{oneLiner}</p>
              )}
              {tags.length > 0 && (
                <div className="mb-6 flex flex-wrap justify-center gap-2">
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
              <Button asChild>
                <Link href={slug ? `/demo/${slug}` : "#"}>体験する</Link>
              </Button>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}
