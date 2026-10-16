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
  const [canStartParticle, setCanStartParticle] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;

    const windowWithIdle = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof windowWithIdle.requestIdleCallback === "function") {
      const handle = windowWithIdle.requestIdleCallback(
        () => setCanStartParticle(true),
        { timeout: 1200 }
      );
      return () => {
        if (typeof windowWithIdle.cancelIdleCallback === "function") {
          windowWithIdle.cancelIdleCallback(handle);
        }
      };
    }

    const timer = globalThis.setTimeout(() => setCanStartParticle(true), 700);
    return () => globalThis.clearTimeout(timer);
  }, [mounted, prefersReducedMotion]);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-base"
      aria-hidden="true"
    >
      {canStartParticle ? (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      ) : null}
    </div>
  );
}
