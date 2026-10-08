# コンサルティング詳細ページの実装

対象：`/services/consulting`。プレビュー：http://127.0.0.1:3103/services/consulting

## 変更ファイル

- `src/app/services/consulting/page.tsx`：新しいページ専用部品へ切り替え。
- `src/components/services/ConsultingPage.tsx`：パンくず、ヒーロー、ページ内リンク、支援内容、進め方、成果物、ご相談、関連リンクを指定文言で実装。成果物は「見本」を明示したHTMLの業務フロー表・比較表・工程表。
- `src/components/services/ConsultingCardTrack.tsx`：スマホ用の手動横スクロールと3ドット。ネイティブスクロール、CSSスナップ、末尾余白。自動送りなし。
- `src/components/services/consulting-page.module.css`：ページ限定のレイアウト、文字、色、共通ヘッダーの表示調整。他ルートに適用されないbody:hasの指定。
- `public/images/services/consulting/{organize,prioritize,plan,process}.png`：添付の見本から文字を含まないイラスト部分のみ切り出した素材。
- `scripts/verify-consulting-design.cjs`：ブラウザーで表示・操作・枠の座標・演出を検証。

他ページで埋め込まれる `ConsultingDetailPageContent` と共通画像部品は変更していない。旧構成は新しい詳細ページに重複掲載していない。トップ、ご支援内容、半内製化、会社紹介のソース変更なし。

## ヒーロー画像と枠

元画像：`public/images/services01.jpg`、1672×941px。既存 `ServicesDetailIntroImage` をそのまま再利用。画像に枠は焼き込まれておらず、HTML/CSSの重ね表示。

①②の枠は左1.2％／20.8％、各幅18.4％、上14.2％、高さ61.8％。色は既存の `#ea580c`、背景透明度0.12を保持。画像のラッパーが座標基準なので幅に追従する。③～⑤と下部のAXEON帯まで全体表示。専用CSSで外側の装飾枠を外し、画像の切り取りなし、キャプション14pxを画像下に表示。

## 最終値

| 項目 | PC | スマホ |
| --- | --- | --- |
| コンテナ | `min(1200px, calc(100% - 54px))` | `calc(100% - 40px)` |
| ヒーロー | 2列等幅、gap32px、上下40px | 1列、gap24px、上下28px・内側左右20px |
| H1 | 58px／1.35（既存servicesに合わせた） | 34px／1.25 |
| H2 | 36px／1.3 | 28px／1.35 |
| 本文 | 16px／1.8 | 同じ |
| セクション上下余白 | 56px | 40px |
| 3カード | gap20px、内側24px | 幅コンテナの86％、gap12px、内側20px |

768～1023pxでは左右24px、カード3列・gap16px・内側16px、進め方1列・補助イラストなし、セクション上下48px。

演出は既存 `ScrollRevealController` の対象指定を再利用し、セクション全体で14px下から900ms。初回のみ。ヒーローの初期表示は妨げず、動きを減らす設定では実行なし。

## 確認用画像

- [PC 1440px全体](after-1440-full.png)
- [PC 1024px全体](after-1024-full.png)
- [タブレット768px全体](after-768-full.png)
- [スマホ390px全体](after-390-full.png)
- [スマホ上部](sp-top.png)
- [スマホ支援内容](sp-support.png)
- [スマホ成果物](sp-deliverables.png)
- [スマホ下部](sp-bottom.png)
- [見本（左）と実装（右）の比較](comparison.png)

## 見本との比較・残る差

見本の順番、青白のイラスト、支援内容の3枚、進め方の配置、成果物3枚、相談帯、関連リンクを比較。ヘッダーのPCメニュー表示をservicesと統一し、短文の末尾が孤立しにくい折り返しに調整した。

ヒーローは指示書の例外に従い、見本のイラストではなく元の工程図。文字量と画像全体表示によりヒーローの高さは見本と異なる。共通フッターは既存の会社説明・リンクを再利用し、見本のAXEONロゴへ置き換えていない。成果物の内部はHTMLの説明用見本であり、画像の細部の完全一致ではない。切り出したイラストは元見本の解像度に制限される。

`スクリーンショット 2026-10-07 012918.png` はdocs内に見つからなかった。オレンジ枠は既存コード・元画像から確認した。指定の縦長見本とservices01.jpgは実際に開いて確認済み。

確認結果は [verification.json](verification.json)。ビルド（TypeScript含む）、変更TSXのESLint、git diff --checkを実行。375／390／430／768／1023／1024／1280／1440pxを検証。実機iPhone Safariは**未確認**。確認はWindows Chromeの画面幅変更とタッチ入力。

初回の遷移確認で半内製化ページにReact hydrationエラー418が出たが、最終確認では再現せず全遷移先のエラーは0。発生の契機は未確定。変更範囲外のページの実装は変更していない。

本番反映、mainへのマージ、pushは行っていない。
