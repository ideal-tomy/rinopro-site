export interface MiniSfaIntegrationPreviewItem {
  id: string;
  label: string;
  statusLabel: string;
  description: string;
}

export const DEMO_BADGES = [
  "デモモード",
  "架空データ",
  "一部連携はイメージ表示",
] as const;

export const DEMO_INTRO =
  "相談から受任までの進み具合を、架空データで体験できるデモです。新規相談の追加、次アクション更新、ステージ変更をお試しください。";

export const DEMO_RESET_HINT =
  "操作内容はブラウザ内に保存されます。商談の前後で `初期状態に戻す` を押すと、同じ流れから再開できます。";

export const DEMO_MODE_NOTE =
  "LINE連携、フォーム起票、AI要約、顧客DB連携などは今回の本実装対象ではなく、将来拡張のイメージ表示です。";

export const MINI_SFA_INTEGRATION_PREVIEW_ITEMS: MiniSfaIntegrationPreviewItem[] = [
  {
    id: "line-intake",
    label: "LINE相談取込",
    statusLabel: "連携イメージ",
    description:
      "LINE公式アカウントから相談内容を受け取り、相談受付として自動起票する拡張を想定しています。",
  },
  {
    id: "web-form",
    label: "問い合わせフォーム自動起票",
    statusLabel: "対応可能",
    description:
      "既存Webフォームから顧客名、流入経路、相談概要を取り込み、初期ステージで登録する想定です。",
  },
  {
    id: "ai-summary",
    label: "AI相談要約",
    statusLabel: "オプション想定",
    description:
      "面談メモや問い合わせ文から相談概要と次アクション候補を整える拡張を将来追加できます。",
  },
  {
    id: "crm-sync",
    label: "顧客DB連携",
    statusLabel: "将来拡張",
    description:
      "既存の顧客管理や案件台帳と同期し、重複登録の抑制や参照だけ先に行う構成も検討できます。",
  },
];
