"use client";

import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";
import { FlowTimelinePageContent } from "@/components/services/FlowTimelinePageContent";

type ServiceOfferingProcessDetailProps = {
  slug: "dx-strategy" | "ai-apps";
};

export function ServiceOfferingProcessDetail({
  slug,
}: ServiceOfferingProcessDetailProps) {
  if (slug === "dx-strategy") {
    return (
      <ConsultingDetailPageContent embedded hideHeader offeringEmbed />
    );
  }
  return (
    <FlowTimelinePageContent
      embedded
      hideHeader
      offeringEmbed={{ fixedTrack: "app" }}
    />
  );
}
