import type { DealStageId, TabId, ConflictCheckStatus } from "./types";

export const DEMO_TODAY = "2026-04-02";
export const MINI_SFA_STORAGE_KEY = "professional-mini-sfa-demo:v1";
export const MINI_SFA_STORAGE_VERSION = 1;

export const TAB_ORDER: TabId[] = ["dashboard", "board", "contacts"];

export const DEAL_STAGE_ORDER: DealStageId[] = [
  "intake",
  "first_meeting",
  "conflict_check",
  "proposal",
  "retainer_likely",
  "retained",
  "closed_lost",
];

export const DEAL_STAGE_LABEL: Record<DealStageId, string> = {
  intake: "相談受付",
  first_meeting: "初回面談",
  conflict_check: "利益相反・資料待ち",
  proposal: "見積・委任契約案",
  retainer_likely: "受任見込",
  retained: "受任",
  closed_lost: "見送り",
};

export const CONFLICT_CHECK_STATUS_OPTIONS: ConflictCheckStatus[] = [
  "未着手",
  "確認中",
  "問題なし",
];
