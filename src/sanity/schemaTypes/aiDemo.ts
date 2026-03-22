import { defineType, defineField } from "sanity";

/** 入力タイプ: テキストのみ / 音声+テキスト / 画像+テキスト */
export const INPUT_TYPES = ["text_only", "audio_text", "image_text"] as const;
export type InputType = (typeof INPUT_TYPES)[number];

/** Intelligent Concierge 用: 想定読者・役割 */
export const AUDIENCE_ROLES = ["field", "management", "executive"] as const;
export type AudienceRole = (typeof AUDIENCE_ROLES)[number];

/** 課題軸（チップ・スコアリング用） */
export const ISSUE_TAG_VALUES = [
  "reporting",
  "search",
  "customer_response",
  "document_work",
  "coordination",
] as const;
export type IssueTagValue = (typeof ISSUE_TAG_VALUES)[number];

/** 望ましい自動化の深度 */
export const AUTOMATION_DEPTHS = ["full_auto", "semi_auto", "centralized"] as const;
export type AutomationDepth = (typeof AUTOMATION_DEPTHS)[number];

/** 内勤 / 現場 など作業スタイル（広い候補時の分散表示用） */
export const WORK_STYLES = ["desk", "onsite", "either"] as const;
export type WorkStyle = (typeof WORK_STYLES)[number];

export const aiDemoType = defineType({
  name: "aiDemo",
  title: "AI Demo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ（URL用）",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "industry",
      title: "業種",
      type: "string",
      options: {
        list: [
          { title: "建設", value: "construction" },
          { title: "士業", value: "legal" },
          { title: "製造", value: "manufacturing" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inputType",
      title: "入力タイプ",
      type: "string",
      options: {
        list: [
          { title: "テキストのみ", value: "text_only" },
          { title: "音声＋テキスト", value: "audio_text" },
          { title: "画像＋テキスト", value: "image_text" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inputPlaceholder",
      title: "入力欄プレースホルダー",
      type: "string",
      description: "ユーザー入力欄に表示するヒントテキスト",
    }),
    defineField({
      name: "runMode",
      title: "実行モード",
      type: "string",
      options: {
        list: [
          { title: "実AI（リアルタイム生成）", value: "ai_live" },
          { title: "モック演出（事前出力を表示）", value: "mock_preview" },
        ],
      },
      initialValue: "mock_preview",
      description: "ai_live=実際にAIが応答 / mock_preview=用意した出力を表示",
    }),
    defineField({
      name: "writingTone",
      title: "文体プリセット",
      type: "string",
      options: {
        list: [
          { title: "標準（バランス）", value: "default" },
          { title: "接客・ホスピタリティ（不動産・接客系）", value: "real_estate" },
          { title: "慎重・法務寄り（士業・契約）", value: "legal" },
          { title: "やさしく配慮（介護・医療・福祉）", value: "care" },
          { title: "簡潔・業務（建設・製造・物流）", value: "b2b_ops" },
          { title: "丁寧・感情配慮（問い合わせ・クレーム）", value: "cs_support" },
        ],
      },
      initialValue: "default",
      description:
        "モック返答の口調と、実AI（ai_live）時の system に追記する文体指示に使用。シード未指定時は industryTags から推論可能。",
    }),
    defineField({
      name: "mockOutputPrimary",
      title: "モック出力1（メイン成果物）",
      type: "text",
      description: "runMode=mock_preview 時に表示。メインの成果物テキスト",
    }),
    defineField({
      name: "mockOutputSecondary",
      title: "モック出力2（補助成果物）",
      type: "text",
      description: "runMode=mock_preview 時に表示。社内メモ・補助情報など",
    }),
    defineField({
      name: "systemPrompt",
      title: "システムプロンプト",
      type: "text",
      description: "LLMに渡すシステム指示。業種・用途に応じた振る舞いを定義",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "outputStructure",
      title: "出力構造指示",
      type: "text",
      description: "出力フォーマット（JSON、箇条書きなど）の指示",
    }),
    defineField({
      name: "sampleData",
      title: "サンプルデータ",
      type: "array",
      of: [{ type: "string" }],
      description: "ワンクリック投入用のサンプル入力。複数指定可",
    }),
    defineField({
      name: "ctaTitle",
      title: "CTA見出し",
      type: "string",
      description: "導線エリアの見出し（例: 導入相談はこちら）",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTAボタン文言",
      type: "string",
      description: "導線ボタンのラベル（例: 相談する）",
    }),
    // 一覧表示・互換用のオプションフィールド
    defineField({
      name: "description",
      title: "説明",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "画像",
      type: "image",
    }),
    defineField({
      name: "functionTags",
      title: "機能タグ",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "industryTags",
      title: "業種タグ",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "moduleTags",
      title: "モジュールタグ",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "audienceRole",
      title: "想定読者・役割（コンシェルジュ）",
      type: "string",
      options: {
        list: [
          { title: "現場・外勤寄り", value: "field" },
          { title: "管理職・内勤寄り", value: "management" },
          { title: "経営・意思決定寄り", value: "executive" },
        ],
      },
      description: "未設定の場合は既存タグからの推論のみでスコアされます。",
    }),
    defineField({
      name: "issueTags",
      title: "課題タグ（コンシェルジュ）",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "報告・記録", value: "reporting" },
              { title: "検索・要約", value: "search" },
              { title: "顧客対応・問い合わせ", value: "customer_response" },
              { title: "帳票・文書・契約", value: "document_work" },
              { title: "調整・オペ・品質・安全", value: "coordination" },
            ],
          },
        },
      ],
      description: "ユーザーの「課題」チップと照合します。未設定時は機能タグから推論します。",
    }),
    defineField({
      name: "automationDepth",
      title: "自動化の深度（コンシェルジュ）",
      type: "string",
      options: {
        list: [
          { title: "完全自動（生成まで任せる）", value: "full_auto" },
          { title: "半自動（下書き・支援）", value: "semi_auto" },
          { title: "一元化（整理・検索・ダッシュボード）", value: "centralized" },
        ],
      },
    }),
    defineField({
      name: "workStyle",
      title: "作業スタイル（コンシェルジュ）",
      type: "string",
      options: {
        list: [
          { title: "内勤・デスク中心", value: "desk" },
          { title: "現場・外勤中心", value: "onsite" },
          { title: "どちらでも / 未分類", value: "either" },
        ],
      },
      initialValue: "either",
      description: "候補が広いとき、内勤向けと現場向けを1本ずつ出し分けるのに使います。",
    }),
    defineField({
      name: "oneLiner",
      title: "一言説明",
      type: "string",
    }),
    defineField({
      name: "storyLead",
      title: "ストーリーリード",
      type: "text",
    }),
    defineField({
      name: "primaryPortfolioTrack",
      title: "ポートフォリオ主ラベル（1つ）",
      type: "string",
      options: {
        list: [
          { title: "① 文章カタログ（/demo）", value: "catalog_text" },
          { title: "② 体験（画面・操作）", value: "experience" },
          { title: "③ プロダクト（導入・見積）", value: "product" },
          { title: "④ 保留", value: "hold" },
        ],
      },
      description:
        "運用定義はリポジトリの docs/demo-portfolio-governance.md。未設定時はトリアージ表（demo-portfolio-triage.md）を正とする。",
    }),
    defineField({
      name: "experienceUrl",
      title: "体験用 URL（②③）",
      type: "url",
      description: "Flutter デモ・外部プロトタイプなど。②または③でリンク表示に使う。",
    }),
    defineField({
      name: "holdRank",
      title: "保留ランク（④のとき）",
      type: "string",
      options: {
        list: [
          { title: "A（①文章で救出可）", value: "A" },
          { title: "B（②体験で救出可）", value: "B" },
          { title: "C（③フローで救出可）", value: "C" },
          { title: "D（削除優先）", value: "D" },
        ],
      },
    }),
    defineField({
      name: "holdReasonTags",
      title: "保留理由タグ",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "需要不明", value: "需要不明" },
              { title: "成果物曖昧", value: "成果物曖昧" },
              { title: "規制・個人情報", value: "規制・個人情報" },
              { title: "入力が重い", value: "入力が重い" },
              { title: "タイトル説明UI不整合", value: "タイトル説明UI不整合" },
              { title: "モックが意図と無関係", value: "モックが意図と無関係" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "listedOnCatalog",
      title: "デモ一覧に表示",
      type: "boolean",
      initialValue: true,
      description:
        "オフにすると /demo 一覧とコンシェルジュの候補から除外。詳細 URL 直アクセスは可能。",
    }),
  ],
  preview: {
    select: { title: "title", industry: "industry" },
    prepare({ title, industry }) {
      return {
        title: title ?? "（無題）",
        subtitle: industry ? `業種: ${industry}` : undefined,
      };
    },
  },
});
