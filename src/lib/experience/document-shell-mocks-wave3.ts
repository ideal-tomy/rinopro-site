import type {
  DocumentShellPresetDefinition,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import { splitLines } from "@/lib/experience/document-shell-signals";

export const contractAmendmentPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "party",
      title: "相手方の立場に近いものは？",
      options: [
        { id: "vendor", label: "ベンダー" },
        { id: "cust", label: "顧客" },
        { id: "partner", label: "パートナー" },
      ],
    },
    {
      id: "riskApp",
      title: "リスクの見え方は？",
      options: [
        { id: "low", label: "軽微な修正" },
        { id: "high", label: "重要条項に関わる" },
      ],
    },
  ],
  samples: [
    "第7条 秘密保持期間を終了後3年→5年に\n通知方法をメール追加",
    "SLAの稼働率 99.5→99.9 違約金条項を新設",
    "準拠法は据え置き 管轄のみ変更",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const lines = splitLines(input.rawText);
    const high = input.selections.riskApp === "high";
    const party =
      input.selections.party === "cust"
        ? "顧客"
        : input.selections.party === "partner"
          ? "パートナー"
          : "ベンダー";

    return {
      documentTitle: "契約修正提案ドラフト（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `想定交渉相手: ${party}／変更の性質: ${high ? "重要条項" : "軽微な修正"}（選択・デモ）`,
        },
        {
          type: "table",
          headers: ["条項・項目", "現行の要旨", "修正案の要旨"],
          rows:
            lines.length > 0
              ? lines.slice(0, 3).map((l) => [l.slice(0, 24), "（現行テキスト要約・デモ）", "（修正方針・デモ）"])
              : [
                  ["（例）秘密保持", "終了後3年", "終了後5年"],
                  ["（例）通知", "書面のみ", "書面＋記録付きメール"],
                ],
        },
        {
          type: "bullets",
          items: high
            ? ["法務・コンプラのレビューを必須化（デモ）", "既存契約との整合（関連契約番号の確認）（デモ）"]
            : ["標準テンプレとの差分のみ法務確認（デモ）", "施行日の明確化（デモ）"],
        },
        {
          type: "paragraph",
          text: "相手方への一言（デモ）: 本変更は双方にメリットがある旨、背景を簡潔に共有してください。",
        },
      ],
    };
  },
  leftPanelTitle: "変更したい点のメモ",
  rightPanelTitle: "修正ドラフト（体裁イメージ）",
};

export const releaseNotePreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "audOut",
      title: "外向けのトーンは？",
      options: [
        { id: "soft", label: "ソフト（改善のご案内）" },
        { id: "neutral", label: "ニュートラル" },
      ],
    },
  ],
  samples: [
    "v2.4.0 検索速度改善 バグ修正3件\n破壊的変更なし",
    "決済SDK更新 PCI対応\n既存連携は設定変更が必要",
    "実験機能フラグ追加 デフォルトOFF",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const items = splitLines(input.rawText);
    const soft = input.selections.audOut === "soft";

    return {
      documentTitle: "リリースノート草案（体験用）",
      blocks: [
        { type: "heading", text: "ユーザー向け" },
        {
          type: "bullets",
          items:
            items.length > 0
              ? items.map((l) => (soft ? `✨ ${l}` : `・${l}`))
              : [
                  soft
                    ? "いつもご利用ありがとうございます。今回のアップデートで体験がさらに快適になります（デモ）。"
                    : "機能改善と不具合修正を行いました（デモ）。",
                ],
        },
        { type: "heading", text: "社内メモ" },
        {
          type: "bullets",
          items: [
            "リリース承認者・ロールバック手順（デモ）",
            "カスタマーサクセス向けFAQ更新要否（デモ）",
            "既知の制限事項: メモに無い場合は「なし（デモ）」で運用確認",
          ],
        },
        {
          type: "paragraph",
          text: "外向けトーン: " + (soft ? "ソフト（選択）" : "ニュートラル（選択）"),
        },
      ],
    };
  },
  leftPanelTitle: "リリース項目・メモ",
  rightPanelTitle: "リリースノート（体裁イメージ）",
};

export const jobOfferPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "type",
      title: "通知の種類に近いものは？",
      options: [
        { id: "full", label: "内定通知（正式）" },
        { id: "cond", label: "条件付き内定" },
      ],
    },
  ],
  samples: [
    "年収600万 固定14ヶ月 勤務地東京\n入社4/1 試用3ヶ月",
    "リモート週3 残業見込み月20h",
    "ストックオプション別紙 詳細は説明会",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const cond = input.selections.type === "cond";

    return {
      documentTitle: "内定通知・文面骨子（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: cond
            ? "条件付き内定として、承諾後に条件充足を確認する旨を明記（デモ）。"
            : "正式内定の通知として、条件の概要を明確に記載（デモ）。",
        },
        {
          type: "paragraph",
          text: "〇〇様\n\nこのたびは採用内定のご連絡を申し上げます（デモ文面）。\n以下の条件案にてご承諾をお願いしております。",
        },
        {
          type: "table",
          headers: ["項目", "内容（メモ要約）"],
          rows: [
            ["役職・職種", "（メモから要約・デモ）"],
            ["勤務地・就業形態", "（メモから要約・デモ）"],
            ["報酬", "（メモから要約・デモ）"],
            ["入社日・試用", "（メモから要約・デモ）"],
          ],
        },
        {
          type: "bullets",
          items: [
            "法務・人事による最終文言確認（デモ）",
            "個人情報・給与の取り扱い説明（デモ）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "条件・メモ",
  centerButtonLabel: "通知骨子を生成",
  rightPanelTitle: "内定通知（体裁イメージ）",
};

export const privacyNoticePreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "scope",
      title: "改定の主因に近いものは？",
      options: [
        { id: "law", label: "法令対応" },
        { id: "svc", label: "サービス変更" },
        { id: "sec", label: "セキュリティ強化" },
      ],
    },
  ],
  samples: [
    "第三者提供の目的を具体化\n海外移転のSafeguards明記",
    "Cookieカテゴリの説明追加 オプトアウト導線",
    "保有期間の表を新設",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const why =
      input.selections.scope === "svc"
        ? "サービス内容の変更"
        : input.selections.scope === "sec"
          ? "セキュリティ体制の強化"
          : "法令・ガイドラインの改正への対応";
    const lines = splitLines(input.rawText);

    return {
      documentTitle: "プライバシー通知 改定骨子（体験用）",
      blocks: [
        {
          type: "bullets",
          items: lines.length
            ? lines.slice(0, 5).map((l) => `改定の要点（案）: ${l}`)
            : ["取得する個人情報の範囲の明確化（デモ）", "利用目的の列挙・特定（デモ）"],
        },
        {
          type: "paragraph",
          text: `【条文風ドラフト・デモ】当社は、${why}に伴い、個人情報の取扱いを以下のとおり変更する予定です。変更後の内容は施行日から適用されます。`,
        },
        {
          type: "bullets",
          items: [
            "法務・DPOレビュー（デモ）",
            "既存ユーザーへの通知方法（アプリ内・メール）（デモ）",
            "英語版との整合（デモ）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "改定ポイントメモ",
  rightPanelTitle: "通知改定（体裁イメージ）",
};
