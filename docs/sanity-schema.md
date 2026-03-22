# Sanity スキーマ

CMS未設定時は空配列を返します。以下はSanity Studioで使用するスキーマ例です。

## caseStudy（体験一覧用・Sanity 型名は従来どおり）

サイト上は「体験」として掲載。実績・導入事例の列挙は行わない。

- title: string
- slug: slug (source: title)
- industry: string
- description: text
- image: image

## demoItem（Demo）

- title: string
- slug: slug (source: title)
- description: text
- image: image

## aiDemo（AI Demo・量産用）

**必須項目**: title, slug, industry, inputType, systemPrompt

- title: string（必須）
- slug: slug (source: title)（必須）
- industry: string（必須）construction / legal / manufacturing
- inputType: string（必須）text_only / audio_text / image_text
- inputPlaceholder: string
- writingTone: string（任意）default / real_estate / legal / care / b2b_ops / cs_support — モック口調と実AIの文体指示に使用
- systemPrompt: text（必須）
- outputStructure: text
- sampleData: string[]（ワンクリック投入用）
- ctaTitle: string
- ctaButtonText: string
- description, image, functionTags, industryTags, moduleTags, oneLiner, storyLead（一覧・互換用）
- **ポートフォリオ（任意）** — 運用は [demo-portfolio-governance.md](demo-portfolio-governance.md) 参照
  - primaryPortfolioTrack: catalog_text / experience / product / hold
  - experienceUrl: url（②③用）
  - holdRank: A / B / C / D（主に④）
  - holdReasonTags: string[]（候補は Studio 定義）
  - listedOnCatalog: boolean（`false` で `/demo` 一覧クエリから除外、既定 true）

## teamMember（チームメンバー）

- name: string
- role: string
- bio: text
- image: image
- order: number
