"use client";

import { Card } from "@/components/ui/card";
import type { CaseStudy } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  caseStudy: CaseStudy;
  className?: string;
}

export function CaseCard({ caseStudy, className }: CaseCardProps) {
  return (
    <Card className={cn("p-6 transition-colors hover:border-accent/50", className)}>
      <h2 className="mb-2 font-semibold text-text">{caseStudy.title}</h2>
      {caseStudy.industry && (
        <p className="mb-2 text-xs text-accent">{caseStudy.industry}</p>
      )}
      <p className="text-sm text-text-sub">
        {caseStudy.description ?? "事例"}
      </p>
    </Card>
  );
}
