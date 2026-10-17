# 04 — `/services`

実装: [`ServicesPageContent.tsx`](../../../src/components/services/ServicesPageContent.tsx) / [`ServicesFlipCards.tsx`](../../../src/components/services/ServicesFlipCards.tsx) / [`ServicesMenu.tsx`](../../../src/components/services/ServicesMenu.tsx) / [`services-page.module.css`](../../../src/components/services/services-page.module.css)

## 構成表

| 順 | セクション | 読者の疑問 | 伝える要点 | 型 | 次へのつながり |
|----|------------|------------|------------|----|----------------|
| 1 | Hero | 何を頼めるか | 整理から定着まで同じチーム | A | 2つの入り口 |
| 2 | サービスカード | どちらから入るか | コンサルティング / 半内製化（FDE） | E | 各サービス詳細 |
| 3 | SERVICE MENU | 具体的に何を作るか | 4つの支援内容 | E | 進め方 |
| 4 | PROCESS | どう進むか | 課題抽出〜運用・保守の5段階 | C | お問い合わせ |

## 今回の変更（文言変更なし）

| 箇所 | 変更 |
|------|------|
| SERVICE MENU 見出し | 句単位に（SP「選／べます。」を解消） |
| SERVICE MENU カード本文 | 1文を句単位に（行末の1語落ちを防ぐ） |
| サービスカード（FDE） | 改行位置を「作って終わらせず、／社内で改善できる…」に（「社内で／改善」の分断を解消） |
| PROCESS 見出し・ステップ名 | SP で太さ未指定（400）だった → 750 / 700 |
| PROCESS ステップ本文 | 句単位に。SP 14px → 15px・行間 1.7。PC は列幅 13 字に合わせて句を細かく |
| PROCESS ステップ（SP） | 1行本文のとき見出しと本文の間が開く → `align-content: center` |

## 確認

| 幅 | 結果 |
|----|------|
| 390 | 両カード（回転後含む）・メニュー4枚・PROCESS で語の分断なし。横はみ出しなし |
| 1280 | メニュー見出し1行、PROCESS 5列で「す。」落ちなし |
