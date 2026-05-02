import { ParticleBackground } from "@/components/three/ParticleBackground";
import { HomeBelowFoldDeferred } from "@/components/home/HomeBelowFoldDeferred";
import { HomeEmpathyCards } from "@/components/home/HomeEmpathyCards";
import { HomeFirstView } from "@/components/home/HomeFirstView";
import { HomeServiceFlowRow } from "@/components/home/HomeServiceFlowRow";
import { HomeWhyPillars } from "@/components/home/HomeWhyPillars";

export function HeroSection() {
  return (
    <>
      <ParticleBackground />
      <div className="home-landing-copy">
        <HomeFirstView />
        <HomeEmpathyCards />
        <HomeWhyPillars />
        <HomeServiceFlowRow />
        <HomeBelowFoldDeferred />
      </div>
    </>
  );
}
