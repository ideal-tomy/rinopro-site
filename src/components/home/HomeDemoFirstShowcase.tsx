import { HOME_DEMO_SHOWCASE_STYLES } from "./home-presentation";
import Link from "next/link";
import { TopFeaturedDemoShowcase } from "@/components/home/demo-showcase/TopFeaturedDemoShowcase";
import { getTopFeaturedDemos } from "@/lib/content/top-featured-demos";

/** TOP — 代表デモ4枚（Ideal「動くデモで確かめる。」移植） */
export function HomeDemoFirstShowcase() {
  const demos = getTopFeaturedDemos();

  return (
    <section
      id="demos"
      className={HOME_DEMO_SHOWCASE_STYLES.section}
      aria-labelledby="home-demos-heading"
    >
      <div className={HOME_DEMO_SHOWCASE_STYLES.container}>
        <h2
          id="home-demos-heading"
          className={HOME_DEMO_SHOWCASE_STYLES.heading}
        >
          
          <br className="hidden md:inline" />
          動くデモで確かめる。
        </h2>
        <p className={HOME_DEMO_SHOWCASE_STYLES.body}>
          サンプルデータで完走できるデモです。右の動きはイメージ再生、本編は「サンプルで体験」から辿れます。
        </p>
      </div>

      <TopFeaturedDemoShowcase demos={demos} />

      <div className={HOME_DEMO_SHOWCASE_STYLES.ctaContainer}>
        <Link
          href="/experience"
          className={HOME_DEMO_SHOWCASE_STYLES.cta}
        >
          すべてのdemoを見る
        </Link>
      </div>
    </section>
  );
}
