import type { ConciergeIndustryBundle } from "@/lib/chat/estimate-handoff";
import type { ConciergeDomainId } from "@/lib/demo/intelligent-concierge";
import {
  CONCIERGE_DOMAIN_OPTIONS,
  getConciergeDomainDetailLabel,
} from "@/lib/demo/intelligent-concierge";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";

/** コンシェルジュ domain → 詳細見積フォームの industry value（site-copy と一致） */
export function conciergeDomainToFormIndustry(domainId: ConciergeDomainId): string {
  switch (domainId) {
    case "construction":
      return "construction";
    case "legal":
      return "professional";
    case "manufacturing":
      return "manufacturing";
    case "services":
      return "retail";
    case "distribution":
      return "logistics_wholesale";
    case "staffing":
      return "staffing";
    case "food_service":
      return "food_service";
    case "food_wholesale":
      return "food_wholesale";
    case "other":
    default:
      return "other";
  }
}

function domainLabel(domainId: ConciergeDomainId): string {
  return (
    CONCIERGE_DOMAIN_OPTIONS.find((o) => o.id === domainId)?.label ?? domainId
  );
}

/** 「業種」回答行（industryDisplayLine） */
export function buildIndustryDisplayLine(bundle: ConciergeIndustryBundle): string {
  const parts: string[] = [domainLabel(bundle.domainId)];
  const detail = getConciergeDomainDetailLabel(
    bundle.domainId,
    bundle.domainDetailId
  );
  if (detail) parts.push(detail);
  let line = parts.join(" — ");
  const note = bundle.note?.trim();
  if (note) line += `（補足: ${note}）`;
  return line;
}

/** handoff の industryBundle をフォーム初期値に反映 */
export function applyConciergeIndustryBundleToFormDraft(
  bundle: ConciergeIndustryBundle
): Pick<EstimateFormDraft, "industry" | "industryDisplayLine"> {
  return {
    industry: conciergeDomainToFormIndustry(bundle.domainId),
    industryDisplayLine: buildIndustryDisplayLine(bundle),
  };
}
