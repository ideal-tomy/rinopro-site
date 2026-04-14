import { DEAL_STAGE_ORDER, DEMO_TODAY } from "./constants";
import type {
  ContactRow,
  DealCard,
  DealStageId,
  MiniSfaDashboardStats,
} from "./types";

function compareDate(a: string, b: string): number {
  return a.localeCompare(b, "en");
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isClosedDeal(stage: DealStageId): boolean {
  return stage === "closed_lost" || stage === "retained";
}

function sortByNextActionDate(deals: DealCard[]): DealCard[] {
  return [...deals].sort((a, b) => compareDate(a.nextActionDate, b.nextActionDate));
}

function sortByLastContactAt(deals: DealCard[]): DealCard[] {
  return [...deals].sort((a, b) => compareDate(b.lastContactAt, a.lastContactAt));
}

export function getActiveDeals(deals: DealCard[]): DealCard[] {
  return deals.filter((deal) => !isClosedDeal(deal.stage));
}

export function getDealsDueThisWeek(
  deals: DealCard[],
  today = DEMO_TODAY
): DealCard[] {
  const weekEnd = addDays(today, 7);
  return sortByNextActionDate(
    getActiveDeals(deals).filter(
      (deal) =>
        compareDate(deal.nextActionDate, today) >= 0 &&
        compareDate(deal.nextActionDate, weekEnd) <= 0
    )
  );
}

export function getOverdueDeals(
  deals: DealCard[],
  today = DEMO_TODAY
): DealCard[] {
  return sortByNextActionDate(
    deals.filter(
      (deal) =>
        deal.stage !== "closed_lost" && compareDate(deal.nextActionDate, today) < 0
    )
  );
}

export function getRetainerLikelyDeals(deals: DealCard[]): DealCard[] {
  return sortByNextActionDate(
    deals.filter((deal) => deal.stage === "retainer_likely")
  );
}

export function getRetainedDeals(deals: DealCard[]): DealCard[] {
  return sortByLastContactAt(deals.filter((deal) => deal.stage === "retained"));
}

export function getStageCounts(deals: DealCard[]): Record<DealStageId, number> {
  const counts = Object.fromEntries(
    DEAL_STAGE_ORDER.map((stage) => [stage, 0])
  ) as Record<DealStageId, number>;

  for (const deal of deals) {
    counts[deal.stage] += 1;
  }

  return counts;
}

export function buildContactRows(deals: DealCard[]): ContactRow[] {
  return sortByLastContactAt(deals).map((deal) => ({
    id: deal.id,
    clientName: deal.clientName,
    contactName: deal.contactName,
    referrer: deal.referrer,
    practiceArea: deal.practiceArea,
    lastContactAt: deal.lastContactAt,
    stage: deal.stage,
    assignee: deal.assignee,
  }));
}

export function buildDashboardStats(
  deals: DealCard[],
  today = DEMO_TODAY
): MiniSfaDashboardStats {
  const weekRows = getDealsDueThisWeek(deals, today);
  const overdueRows = getOverdueDeals(deals, today);
  const retainerLikelyRows = getRetainerLikelyDeals(deals);
  const retainedRows = getRetainedDeals(deals);

  return {
    activeCount: getActiveDeals(deals).length,
    dueThisWeekCount: weekRows.length,
    overdueCount: overdueRows.length,
    retainerLikelyCount: retainerLikelyRows.length,
    retainedCount: retainedRows.length,
    weekRows,
    overdueRows,
    retainerLikelyRows,
    retainedRows,
    stageCounts: getStageCounts(deals),
  };
}
