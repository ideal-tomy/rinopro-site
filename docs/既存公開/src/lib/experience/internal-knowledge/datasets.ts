import type { IndustryDataset } from "./types";
import { allIndustryDatasets } from "./industries";

export const INTERNAL_KNOWLEDGE_DATASETS: IndustryDataset[] =
  allIndustryDatasets;

const byId = new Map(
  INTERNAL_KNOWLEDGE_DATASETS.map((d) => [d.id, d] as const)
);

export function getInternalKnowledgeDataset(
  industryId: string
): IndustryDataset | undefined {
  return byId.get(industryId);
}

export function listInternalKnowledgeIndustries(): {
  id: string;
  label: string;
  icon: string;
}[] {
  return INTERNAL_KNOWLEDGE_DATASETS.map((d) => ({
    id: d.id,
    label: d.label,
    icon: d.icon,
  }));
}

export const DEFAULT_INTERNAL_KNOWLEDGE_INDUSTRY_ID =
  INTERNAL_KNOWLEDGE_DATASETS[0]?.id ?? "construction";
