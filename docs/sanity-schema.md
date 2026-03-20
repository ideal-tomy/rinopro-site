# Sanity スキーマ

CMS未設定時は空配列を返します。以下はSanity Studioで使用するスキーマ例です。

## caseStudy（事例）

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
- systemPrompt: text（必須）
- outputStructure: text
- sampleData: string[]（ワンクリック投入用）
- ctaTitle: string
- ctaButtonText: string
- description, image, functionTags, industryTags, moduleTags, oneLiner, storyLead（一覧・互換用）

## teamMember（チームメンバー）

- name: string
- role: string
- bio: text
- image: image
- order: number
