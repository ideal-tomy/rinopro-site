export type TabId = "dashboard" | "board" | "contacts";

export type DealStageId =
  | "intake"
  | "first_meeting"
  | "conflict_check"
  | "proposal"
  | "retainer_likely"
  | "retained"
  | "closed_lost";

export type ConflictCheckStatus = "未着手" | "確認中" | "問題なし";

export interface DealCard {
  id: string;
  title: string;
  clientName: string;
  contactName: string;
  inquiryChannel: string;
  referrer: string;
  practiceArea: string;
  assignee: string;
  stage: DealStageId;
  nextAction: string;
  nextActionDate: string;
  lastContactAt: string;
  estimatedValueLabel?: string;
  conflictCheckStatus?: ConflictCheckStatus;
  summary: string;
  note?: string;
}

export interface ContactRow {
  id: string;
  clientName: string;
  contactName: string;
  referrer: string;
  practiceArea: string;
  lastContactAt: string;
  stage: DealStageId;
  assignee: string;
}

export interface CreateDealInput {
  title: string;
  clientName: string;
  contactName: string;
  inquiryChannel: string;
  referrer: string;
  practiceArea: string;
  assignee: string;
  nextAction: string;
  nextActionDate: string;
  summary: string;
  estimatedValueLabel?: string;
  conflictCheckStatus?: ConflictCheckStatus;
  note?: string;
}

export interface MiniSfaDashboardStats {
  activeCount: number;
  dueThisWeekCount: number;
  overdueCount: number;
  retainerLikelyCount: number;
  retainedCount: number;
  weekRows: DealCard[];
  overdueRows: DealCard[];
  retainerLikelyRows: DealCard[];
  retainedRows: DealCard[];
  stageCounts: Record<DealStageId, number>;
}

export interface MiniSfaStoragePayload {
  version: 1;
  deals: DealCard[];
}
