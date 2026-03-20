import { defineType, defineField } from "sanity";

/** 入力タイプ: テキストのみ / 音声+テキスト / 画像+テキスト */
export const INPUT_TYPES = ["text_only", "audio_text", "image_text"] as const;
export type InputType = (typeof INPUT_TYPES)[number];

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
      name: "oneLiner",
      title: "一言説明",
      type: "string",
    }),
    defineField({
      name: "storyLead",
      title: "ストーリーリード",
      type: "text",
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
