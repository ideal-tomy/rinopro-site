# ご支援内容：ヒーローと紹介カードの調整

確認日：2026-10-07。ローカルプレビュー：http://127.0.0.1:3103/services

## 変更内容

- `src/components/services/ServicesPageContent.tsx`：ヒーロー内の共通コンテナを追加。画像専用の切り出し素材を使用し、縮小表示でも元の見本のヘッダーやカードが混入しないようにした。説明文は意味の区切りで2行。
- `src/components/services/services-page.module.css`：PCは背景を含むヒーロー全体を最大1200pxに収め、下の2枚のカードの外側端と揃えた。内部は文章45％／画像55％、上下中央揃え。カードと左右端を揃えた。画像は縦横比を維持して全体表示。スマホは右側の補助画像として幅225px、透明度0.48、白いグラデーションを重ねた。
- `public/images/services/approved/hero.png`：既存見本からヒーロー画像部分のみを切り出した素材。新しい画像生成は行っていない。
- `scripts/verify-services-hero.cjs`：実際のブラウザー上で幅、配置、画像の収まり、余白、文章の2行表示を計測する確認スクリプト。

セクション間の間隔はヒーローの `margin-bottom` で一括管理（PC・タブレット28px、スマホ18px）。カードの上marginは0。PCのヒーロー下paddingも0。スマホの既存内部paddingは維持し、追加の間隔は重ねていない。

SERVICE MENUはリンクなしの紹介を維持。固定高さを解除し、本文下は22pxに統一。項目の文章量に応じて高さが決まる。

## 修正後の画面

- [PC 1440px全体](after-1440-full.png)
- [PC 1122px全体](after-1122-full.png)
- [タブレット768px全体](after-768-full.png)
- [スマホ390px全体](after-390-full.png)
- [スマホ390px上部](after-sp-top.png)
- [スマホ390px裏面](after-sp-back.png)

## 確認結果

320／375／390／430／768／1023／1024／1122／1280／1440pxの10幅で確認。ページ全体の横スクロールなし、画像はヒーロー内、カードとの重なりなし。PCの共通コンテナ端・45：55・上下中央、セクション間28／18px、紹介カード本文下22pxを実測して確認。説明文は全幅で2行。タブレットで孤立していた「で、」は本文を16pxに調整して解消した。

PC・スマホの修正後スクリーンショットを開き、画像の収まり、左右位置、カードとの間隔、紹介カード下部の余白を目視確認。ブラウザーのコンソールエラーは0。詳細は [verification.json](verification.json)。

`npm run build`、TypeScript、変更TSXのESLint、`git diff --check`が通過。カード操作・リンク・メニューの既存確認結果は `docs/services-approved-2026-10-06/` に記録。今回カード回転やリンク先の実装は変更していない。

確認はWindowsのChromeによる画面幅変更。iPhone Safari実機は**未確認**。本番反映・mainへのマージ・リモートpushは行っていない。

