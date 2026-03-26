import type {
  DocumentShellPresetDefinition,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import { pickIndustryFromText, splitLines } from "@/lib/experience/document-shell-signals";

export const subsidyChecklistPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "scale",
      title: "事業規模のイメージは？",
      options: [
        { id: "micro", label: "小規模・個人" },
        { id: "sme", label: "中小法人" },
      ],
    },
    {
      id: "track",
      title: "申請の成熟度（デモ）",
      options: [
        { id: "first", label: "初めて申請" },
        { id: "retry", label: "再申請・追加審査" },
      ],
    },
  ],
  samples: [
    "地域活性化事業 店舗改装 従業員3名\n補助率2/3イメージ",
    "IT導入補助 ソフトとコンサルセット\n見積は2社取った",
    "創業支援 事業計画はあるがCF表が未整備",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const ind = pickIndustryFromText(input.rawText);
    const first = input.selections.track !== "retry";

    return {
      documentTitle: "補助金申請 論点チェック（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `事業イメージ: ${ind}／規模: ${input.selections.scale === "sme" ? "中小法人" : "小規模"}（選択・デモ）`,
        },
        {
          type: "checklist",
          items: [
            { label: "事業計画書（目的・効果・スケジュール）", done: first },
            { label: "経理・資金繰り表（補助対象外の明確化）", done: false, note: "要確認" },
            { label: "見積・発注先の妥当性（競争入札の要否）", done: false },
            { label: "実績報告・監査に備えた証憑ルール", done: false },
          ],
        },
        {
          type: "table",
          caption: "ギャップ・リスク（デモ）",
          headers: ["論点", "状態", "次アクション"],
          rows: [
            ["要件との適合", "要確認", "公募要領のチェックリストと突合"],
            ["経費区分", "未整理", "内訳表のたたき台作成"],
          ],
        },
        {
          type: "bullets",
          items: [
            first
              ? "初回申請向け: 様式の最新版・提出窓口の確認を最優先（デモ）"
              : "再申請向け: 前回の指摘事項の反映表を添付（デモ）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "事業概要・申請メモ",
  rightPanelTitle: "チェックリスト（体裁イメージ）",
};

export const onboardingChecklistPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "role",
      title: "近い役割は？",
      options: [
        { id: "dev", label: "開発" },
        { id: "sales", label: "営業" },
        { id: "corp", label: "コーポレート" },
      ],
    },
    {
      id: "loc",
      title: "勤務形態に近いものは？",
      options: [
        { id: "office", label: "オフィス常駐" },
        { id: "hybrid", label: "ハイブリッド" },
        { id: "remote", label: "リモート中心" },
      ],
    },
  ],
  samples: [
    "エンジニア 東京本社 4/1入社\n機貸与 Mac希望",
    "営業 名古屋拠点 車両手配要否不明",
    "総務 リモート週3 契約社員",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const role =
      input.selections.role === "sales"
        ? "営業"
        : input.selections.role === "corp"
          ? "コーポレート"
          : "開発";
    const loc =
      input.selections.loc === "remote"
        ? "リモート中心"
        : input.selections.loc === "hybrid"
          ? "ハイブリッド"
          : "オフィス常駐";
    const lines = splitLines(input.rawText);

    return {
      documentTitle: "入社手続きチェックリスト（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `ロール: ${role}／勤務: ${loc}（選択・デモ） メモ要約: ${lines[0]?.slice(0, 80) ?? "—"}`,
        },
        {
          type: "checklist",
          items: [
            { label: "雇用契約・誓約書", done: true },
            { label: "アカウント発行（メール・SSO）", done: false },
            { label: loc.includes("リモート") ? "在宅勤務規程・機器配送" : "座席・入館証", done: false },
            { label: "給与・社保手続き", done: false },
            { label: role === "開発" ? "開発環境・リポジトリ権限" : "業務ツールライセンス", done: false },
          ],
        },
        {
          type: "table",
          headers: ["手続き", "担当", "期限目安"],
          rows: [
            ["キックオリエンテーション", "人事", "Day1"],
            ["ITセットアップ", "情シス", "Day1-3"],
            ["部門オンボーディング", "直属上長", "Week1"],
          ],
        },
      ],
    };
  },
  leftPanelTitle: "役割・勤務地メモ",
  rightPanelTitle: "オンボーディング（体裁イメージ）",
};
