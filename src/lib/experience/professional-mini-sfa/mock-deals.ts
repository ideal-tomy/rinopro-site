import type { DealCard, DealStageId } from "./types";

export const DEAL_STAGE_ORDER: DealStageId[] = [
  "first_meeting",
  "proposal",
  "negotiation",
  "likely_retainer",
  "closed_lost",
];

export const DEAL_STAGE_LABEL: Record<DealStageId, string> = {
  first_meeting: "初回面談",
  proposal: "提案・見積",
  negotiation: "条件調整",
  likely_retainer: "受任見込",
  closed_lost: "見送り",
};

export const INITIAL_DEALS: DealCard[] = [
  {
    id: "d1",
    title: "労務顧問の体制整理",
    organization: "株式会社サンプル物流",
    nextAction: "労働保険の現状ヒアリング資料を送付",
    nextActionDate: "2026-04-03",
    stage: "first_meeting",
    note: "紹介元と方針は合意済み。次はスコープの線引き。",
  },
  {
    id: "d2",
    title: "開発許可関連の事前相談",
    organization: "合同会社リバー開発",
    nextAction: "必要書類リストのドラフト共有",
    nextActionDate: "2026-04-05",
    stage: "proposal",
    note: "行政との事前照会の有無を次回確定。",
  },
  {
    id: "d3",
    title: "定款変更・総会準備",
    organization: "NPO法人グリーン手帳",
    nextAction: "理事会議事録案の確認",
    nextActionDate: "2026-04-02",
    stage: "negotiation",
    note: "会員への周知文案は別紙で作成予定。",
  },
  {
    id: "d4",
    title: "相続に関する初回相談",
    organization: "個人（相続案件）",
    nextAction: "家族構成・財産目録のたたき台を依頼",
    nextActionDate: "2026-04-08",
    stage: "first_meeting",
    note: "秘密保持の説明済み。次回は論点の優先順位付け。",
  },
  {
    id: "d5",
    title: "顧問契約更新（見送り検討）",
    organization: "株式会社オールドリンク",
    nextAction: "見送り理由の社内メモ",
    nextActionDate: "2026-03-20",
    stage: "closed_lost",
    note: "予算凍結のため今期は見送り。来年再提案。",
  },
];
