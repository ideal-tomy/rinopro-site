/** 士業向けパイプライン（営業ではなく相談〜受任の語彙） */
export type DealStageId =
  | "first_meeting"
  | "proposal"
  | "negotiation"
  | "likely_retainer"
  | "closed_lost";

export interface ContactRow {
  id: string;
  organization: string;
  contactName: string;
  referrer: string;
  matterType: string;
  lastTouch: string;
}

export interface DealCard {
  id: string;
  title: string;
  organization: string;
  nextAction: string;
  nextActionDate: string;
  stage: DealStageId;
  note: string;
}
