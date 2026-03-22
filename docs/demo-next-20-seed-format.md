# 次の20本 シード追加フォーマット

`scripts/seed-ai-demos.ts` に追加する際のテンプレート。モック配列は [`scripts/demo-batches/`](../scripts/demo-batches/) 内のバッチファイル（例: `batch-01-next-mock.ts`）にオブジェクトを追加し、[`scripts/demo-batches/index.ts`](../scripts/demo-batches/index.ts) の `nextMockDemos` 結合に含める。既存インポート互換のため [`scripts/next-20-demos-data.ts`](../scripts/next-20-demos-data.ts) はバッチ群を re-export している。

全体の手順・重複防止・運用リズムは [`docs/新規デモ追加手順.md`](新規デモ追加手順.md) を参照。

## キー順（統一）

```
title, slug, industry, inputType, runMode, inputPlaceholder,
writingTone（任意）,
mockOutputPrimary, mockOutputSecondary, systemPrompt, outputStructure,
sampleData, ctaTitle, ctaButtonText, description,
industryTags, functionTags, moduleTags, oneLiner
```

### 文体プリセット `writingTone`（任意）

| 値 | 用途の目安 |
|----|------------|
| `default` | 標準（バランス） |
| `real_estate` | 接客・ホスピタリティ（不動産・小売・飲食など） |
| `legal` | 慎重・法務寄り（士業・契約） |
| `care` | やさしく配慮（介護・医療） |
| `b2b_ops` | 簡潔・業務（建設・製造・物流） |
| `cs_support` | 問い合わせ・クレーム対応 |

未指定の場合、`npm run seed:ai-demos` は `industry` / `industryTags` から推論して投入します。実AI（`ai_live`）では `systemPrompt` に続けて文体指示が自動追記されます。

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
  writingTone: "b2b_ops" as const, // 省略可（シードで industryTags から推論）
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
