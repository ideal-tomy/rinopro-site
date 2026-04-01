import type { DealCard, DealStageId } from "./types";
import { DEAL_STAGE_LABEL, DEAL_STAGE_ORDER } from "./mock-deals";
import { DEMO_TODAY } from "./demo-today";

function cmpDate(a: string, b: string): number {
  return a.localeCompare(b, "en");
}

/** 月曜始まりの簡易「今週末」: 今日から7日以内 */
export function isDueThisWeek(nextActionDate: string): boolean {
  return cmpDate(nextActionDate, DEMO_TODAY) >= 0 && cmpDate(nextActionDate, weekEndDate()) <= 0;
}

function weekEndDate(): string {
  const d = new Date(`${DEMO_TODAY}T12:00:00`);
  d.setDate(d.getDate() + 7);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isOverdueActive(d: DealCard): boolean {
  if (d.stage === "closed_lost") return false;
  return cmpDate(d.nextActionDate, DEMO_TODAY) < 0;
}

export function activeDeals(deals: DealCard[]): DealCard[] {
  return deals.filter((d) => d.stage !== "closed_lost");
}

export function stageCounts(deals: DealCard[]): Record<DealStageId, number> {
  const init = Object.fromEntries(
    DEAL_STAGE_ORDER.map((s) => [s, 0])
  ) as Record<DealStageId, number>;
  for (const d of deals) {
    init[d.stage] += 1;
  }
  return init;
}

export function dealsDueThisWeek(deals: DealCard[]): DealCard[] {
  return activeDeals(deals)
    .filter((d) => isDueThisWeek(d.nextActionDate))
    .sort((a, b) => cmpDate(a.nextActionDate, b.nextActionDate));
}

export function overdueDeals(deals: DealCard[]): DealCard[] {
  return deals.filter(isOverdueActive).sort((a, b) => cmpDate(a.nextActionDate, b.nextActionDate));
}

export { DEAL_STAGE_LABEL };
