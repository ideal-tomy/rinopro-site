import type { ContactRow } from "./types";

export const MOCK_CONTACTS: ContactRow[] = [
  {
    id: "c1",
    organization: "株式会社サンプル物流",
    contactName: "経理部 企画課 山田",
    referrer: "顧問税理士 紹介",
    matterType: "労務顧問（見込）",
    lastTouch: "2026-03-28",
  },
  {
    id: "c2",
    organization: "合同会社リバー開発",
    contactName: "代表 佐藤",
    referrer: "既存顧客（不動産）",
    matterType: "許認可・届出支援",
    lastTouch: "2026-03-30",
  },
  {
    id: "c3",
    organization: "NPO法人グリーン手帳",
    contactName: "事務局 鈴木",
    referrer: "Web問い合わせ",
    matterType: "定款変更・役員改選",
    lastTouch: "2026-03-25",
  },
  {
    id: "c4",
    organization: "個人（相続案件）",
    contactName: "仮名: 田島様",
    referrer: "司法書士連携",
    matterType: "遺言・遺産分割の相談",
    lastTouch: "2026-04-01",
  },
];
