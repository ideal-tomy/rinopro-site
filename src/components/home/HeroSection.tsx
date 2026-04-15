import { ParticleBackground } from "@/components/three/ParticleBackground";
import { HomeHeroIntro } from "@/components/home/HomeHeroIntro";
import { HomeBelowFoldDeferred } from "@/components/home/HomeBelowFoldDeferred";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

interface HeroSectionProps {
  demos: (AiDemo | DemoItem)[];
}

export function HeroSection({ demos }: HeroSectionProps) {
  return (
    <>
      <ParticleBackground />
      <HomeHeroIntro />
      <HomeBelowFoldDeferred demos={demos} />
    </>
  );
}
