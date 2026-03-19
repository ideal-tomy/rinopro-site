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

## teamMember（チームメンバー）

- name: string
- role: string
- bio: text
- image: image
- order: number
