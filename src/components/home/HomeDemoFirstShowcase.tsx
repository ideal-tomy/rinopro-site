import Link from "next/link";
import { TopFeaturedDemoShowcase } from "@/components/home/demo-showcase/TopFeaturedDemoShowcase";
import { getTopFeaturedDemos } from "@/lib/content/top-featured-demos";

/** TOP — 代表デモ4枚（Ideal「資料ではなく、動くデモで確かめる。」移植） */
export function HomeDemoFirstShowcase() {
  const demos = getTopFeaturedDemos();

  return (
    <section
      id="demos"
      className="home-demo-first bg-[var(--df-bg-blue)] py-[clamp(40px,8vw,64px)] md:py-20"
      aria-labelledby="home-demos-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="home-demos-heading"
          className="mb-4 text-[clamp(26px,5.6vw,40px)] leading-[1.5] font-bold text-[var(--df-text)] md:mb-6"
        >
          資料ではなく、
          <br className="hidden md:inline" />
          動くデモで確かめる。
        </h2>
        <p className="mb-6 max-w-[640px] text-[16px] leading-[1.75] text-[var(--df-text-muted)] md:mb-8 md:text-[17px]">
          サンプルデータで完走できるデモです。右の動きはイメージ再生、本編は「サンプルで体験」から辿れます。
        </p>
      </div>

      <TopFeaturedDemoShowcase demos={demos} />

      <div className="container mx-auto mt-8 flex max-w-6xl justify-center px-4 md:mt-10 md:px-6">
        <Link
          href="/experience"
          className="inline-flex items-center gap-2.5 rounded-xl border border-[var(--site-border)] bg-[var(--df-bg)] px-7 py-3.5 font-bold text-[var(--df-text)] transition-colors hover:border-[var(--df-primary)]/45 hover:text-[var(--df-primary)]"
        >
          すべてのdemoを見る
        </Link>
      </div>
    </section>
  );
}
