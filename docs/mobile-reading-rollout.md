# モバイル閲覧・タイポグラフィ横展開ガイド

サービス詳細で導入した基準を、他ページへ展開する際の参照用です。

## 共通トークン（実装）

- [src/lib/ui/service-reading-styles.ts](src/lib/ui/service-reading-styles.ts)
  - `serviceReading.body` / `bodyCenter` / `leadMuted`
  - `serviceShellInset.embeddedX` / `embeddedY`（横 16px 台からの段階的拡張）

## 監査の推奨順

1. **サービス系**（`/services`、埋め込み詳細）
2. **長文ページ**（`/about`、`/contact`）
3. **デモ**（一覧・詳細の説明文・カード内余白）
4. **体験**（`/experience` 系のストーリー本文）

## チェック観点（各ページ）

| 観点 | 見ること |
|------|----------|
| 横余白 | モバイルで本文が画面端に張り付いていないか（最低 16px 前後） |
| 行長 | `max-w-prose` 相当で読みやすい幅に収まっているか |
| 本文サイズ | `15–16px` 前後で行間 `1.75–1.9` 前後になっているか（`text-base` は使わない） |
| 見出し | 本文より過大で改行・スクロールが増えすぎていないか |
| PC / モバイル差 | PC だけ極小・モバイルだけ極大になっていないか |
| 装飾 vs 可読 | タイムライン等の装飾が本文幅を奪っていないか |

## 実装メモ

- モバイル専用レイアウトは `md:hidden` / `hidden md:block` で段切りし、**読み幅優先のブロック**を別定義する。
- 埋め込みコンテナでは外側 `px-0` を避け、`serviceShellInset` で揃える。
