"use client";

import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { DriverVoiceIncidentExperience } from "@/components/experience/prototypes/DriverVoiceIncidentExperience";
import { LegalMemorySecretaryExperience } from "@/components/experience/prototypes/LegalMemorySecretaryExperience";
import { PropertyExteriorPhotoExperience } from "@/components/experience/prototypes/PropertyExteriorPhotoExperience";
import { InternalKnowledgeBotExperience } from "@/components/experience/prototypes/InternalKnowledgeBotExperience";
import { ReceiptPhotoExpenseExperience } from "@/components/experience/prototypes/ReceiptPhotoExpenseExperience";
import { RestaurantOpsDashboardExperience } from "@/components/experience/prototypes/RestaurantOpsDashboardExperience";
import { ServiceClaimReplyExperience } from "@/components/experience/prototypes/ServiceClaimReplyExperience";

interface ExperiencePrototypeRunnerProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function ExperiencePrototypeRunner({
  meta,
  className,
}: ExperiencePrototypeRunnerProps) {
  if (meta.slug === "legal-memory-secretary") {
    return (
      <LegalMemorySecretaryExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "property-exterior-photo-memo") {
    return (
      <PropertyExteriorPhotoExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "internal-knowledge-share-bot") {
    return (
      <InternalKnowledgeBotExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "restaurant-ops-dashboard-demo") {
    return (
      <RestaurantOpsDashboardExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "service-claim-reply-assist") {
    return (
      <ServiceClaimReplyExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "receipt-photo-expense-memo") {
    return (
      <ReceiptPhotoExpenseExperience meta={meta} className={className} />
    );
  }

  if (meta.slug === "driver-voice-incident-draft") {
    return (
      <DriverVoiceIncidentExperience meta={meta} className={className} />
    );
  }

  return null;
}
