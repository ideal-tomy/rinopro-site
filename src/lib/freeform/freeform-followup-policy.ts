import type { FactEnvelope } from "@/lib/facts/canonical-facts";
import { FACT_LABELS } from "@/lib/facts/canonical-facts";

const FOLLOWUP_KEYS = [
  "productCategory",
  "productArchetype",
  "targetSummary",
  "timeline",
  "integration",
  "usageSurface",
  "audienceScope",
  "dataSensitivity",
] as const;

export function buildFreeformFollowupLines(
  factEnvelopes: FactEnvelope[]
): string[] {
  return factEnvelopes
    .filter(
      (envelope) =>
        envelope.state === "candidate" &&
        FOLLOWUP_KEYS.includes(
          envelope.key as (typeof FOLLOWUP_KEYS)[number]
        ) &&
        envelope.key in FACT_LABELS
    )
    .slice(0, 4)
    .map((envelope) => {
      const label = FACT_LABELS[envelope.key as keyof typeof FACT_LABELS];
      return `${label}: ${envelope.value}（要確認）`;
    });
}
