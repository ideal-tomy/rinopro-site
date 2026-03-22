"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ParticleField = dynamic(
  () => import("./ParticleField").then((mod) => mod.ParticleField),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ParticleBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-base"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
    </div>
  );
}
