"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordVisitorPageVisit } from "@/lib/journey/visitor-journey-storage";

export function VisitorJourneyTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;
    recordVisitorPageVisit(pathname);
  }, [pathname]);

  return null;
}
