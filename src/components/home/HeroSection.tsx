import { ParticleBackground } from "@/components/three/ParticleBackground";
import { HomeAcquisitionIntro } from "@/components/home/HomeAcquisitionIntro";
import { HomeBelowFoldDeferred } from "@/components/home/HomeBelowFoldDeferred";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";

interface HeroSectionProps {
  demos: (AiDemo | DemoItem)[];
}

export function HeroSection({ demos }: HeroSectionProps) {
  return (
    <>
      <ParticleBackground />
      <HomeAcquisitionIntro />
      <HomeBelowFoldDeferred demos={demos} />
    </>
  );
}
