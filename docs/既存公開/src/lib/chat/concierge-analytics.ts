/**
 * コンシェルジュの軽量KPI（カスタムイベント）。
 * 外部アナリティクス未接続時も window で捕捉可能（GTM 等で後から購読可）。
 */
import { recordVisitorJourneyKpi } from "@/lib/journey/visitor-journey-storage";

export type ConciergeKpiEventName =
  | "answer_complete"
  | "cta_visible"
  | "cta_click"
  | "followup_message"
  | "wizard_reset"
  | "fab_nudge_visible"
  | "fab_nudge_dismiss";

export type ConciergeKpiDetail = {
  name: ConciergeKpiEventName;
  pathname?: string;
  mode?: string;
  messageId?: string;
  textLength?: number;
  delayMs?: number;
  href?: string;
  ctaKind?: string;
  turn?: number;
  /** 右下FAB吹き出し用（`getConciergeFabNudgePageId` の値） */
  nudgePageId?: string;
};

const EVENT_NAME = "concierge-kpi";

export function emitConciergeKpi(detail: ConciergeKpiDetail): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  } catch {
    /* ignore */
  }
  recordVisitorJourneyKpi(detail);
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[concierge-kpi]", detail);
  }
}
