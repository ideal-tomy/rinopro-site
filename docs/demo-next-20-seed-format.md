# 次の20本 シード追加フォーマット

`scripts/seed-ai-demos.ts` に追加する際のテンプレート。`scripts/next-20-demos-data.ts` の `nextMockDemos` 配列にオブジェクトを追加する。

## キー順（統一）

```
title, slug, industry, inputType, runMode, inputPlaceholder,
mockOutputPrimary, mockOutputSecondary, systemPrompt, outputStructure,
sampleData, ctaTitle, ctaButtonText, description,
industryTags, functionTags, moduleTags, oneLiner
```

## そのまま貼れるテンプレ

```ts
{
  _type: "aiDemo" as const,
  title: "デモ名",
  slug: { _type: "slug" as const, current: "kebab-case-slug" },
  industry: "construction" | "legal" | "manufacturing",
  inputType: "text_only" | "audio_text" | "image_text",
  runMode: "mock_preview" as const,
  inputPlaceholder: "入力欄のヒント",
  mockOutputPrimary: `## 1. メイン成果物\n\n- 項目1\n- 項目2`,
  mockOutputSecondary: `## 2. 補助成果物\n\n- メモ1\n- メモ2`,
  systemPrompt: "あなたは〇〇をするアシスタントです。",
  outputStructure: "メインと補助の2セクションで出力すること。",
  sampleData: [
    "サンプル入力1",
    "サンプル入力2",
    "サンプル入力3",
  ],
  ctaTitle: "あなたのフォーマットに合わせた試作を3営業日で提出します。",
  ctaButtonText: "3営業日で試作デモを受け取る",
  description: "〇〇から〇〇を即生成。〇〇を効率化します。",
  industryTags: ["建設", "製造"],
  functionTags: ["機能1", "機能2"],
  moduleTags: ["LLM"],
  oneLiner: "一言説明（15〜24文字）",
},
```

## 注意

- `industry` はスキーマで `construction` / `legal` / `manufacturing` のみ
- 新規業種は `industryTags` で表現（例: 小売、不動産、医療）
- 重複チェック: `docs/demo-mock-inventory.md` を必ず確認
