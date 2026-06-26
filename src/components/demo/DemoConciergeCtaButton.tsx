"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DemoConciergeCtaButton({ label }: { label: string }) {
  return (
    <Button
      asChild
      variant="outline"
      size="default"
      className="clickable-element border-silver/25 opacity-95 hover:opacity-100"
    >
      <Link href="/demo/list">{label}</Link>
    </Button>
  );
}
