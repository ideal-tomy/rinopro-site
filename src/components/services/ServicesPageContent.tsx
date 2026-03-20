"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  PageSectionWithScroll,
  StaggerGrid,
} from "@/components/layout/PageSectionWithScroll";
import { servicesCopy } from "@/lib/content/site-copy";

export function ServicesPageContent() {
  return (
    <PageSectionWithScroll
      title={servicesCopy.title}
      cta={{ href: "/contact", label: servicesCopy.cta }}
    >
      <p className="mb-8 max-w-2xl text-text-sub">
        {servicesCopy.purpose}
      </p>
      <StaggerGrid cols="2">
        <Link href={servicesCopy.development.href}>
          <Card className="p-6 transition-colors hover:border-accent/50">
            <h2 className="mb-2 font-semibold text-text">
              {servicesCopy.development.title}
            </h2>
            <p className="text-sm text-text-sub">
              {servicesCopy.development.desc}
            </p>
          </Card>
        </Link>
        <Link href={servicesCopy.consulting.href}>
          <Card className="p-6 transition-colors hover:border-accent/50">
            <h2 className="mb-2 font-semibold text-text">
              {servicesCopy.consulting.title}
            </h2>
            <p className="text-sm text-text-sub">
              {servicesCopy.consulting.desc}
            </p>
          </Card>
        </Link>
      </StaggerGrid>
    </PageSectionWithScroll>
  );
}
