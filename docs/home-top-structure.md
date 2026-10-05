# 現行トップページの構成

確認日: 2026-10-05。コードの参照関係に基づく構成資料です。見た目の品質評価や実機確認の完了報告ではありません。

## 入口と責任

src/app/page.tsx はトップのメタデータと PageShell を担当し、HomeLandingPage を呼び出します。HomeLandingPage はセクションの順序と背景ラッパを組み立てます。

src/app/layout.tsx は全ページの Header / Footer、フォント、スクロール復元、訪問履歴などを管理します。PageShell は main 領域、HomeSectionShell はトップの背景色だけを担当します。

## 現行セクション（表示順）

| 順序 | 部品 | アンカー | 内容・主な依存先 |
| --- | --- | --- | --- |
| 1 | HomeFirstView | hero | 第一画面。HomeHeroSlider、home-landing.ts |
| 2 | HomeBrandStorySection | about | AXEONの名前と理念。本文・画像指定は部品内 |
| 3 | HomeDemoFirstShowcase | demos | 代表デモ。TopFeaturedDemoShowcase、top-featured-demos.ts |
| 4 | HomeIndustryShowcaseSection | industry | 実装例。ImplementationShowcaseCard、implementation-showcase.ts |
| 5 | HomeValuesSection | values | 選ばれる理由。reason/の図解、home-landing.ts |
| 6 | HomeCeoMessageSection | ceo | 代表メッセージ。共通見出し、home-landing.ts |
| 7 | HomeFaqSection | faq | FAQ。共通見出し、home-landing.ts |
| 8 | HomeClosingCta | cta | 問い合わせ・概算への導線。文章は部品内 |

HeroSection は HomeLandingPage に、HomeEmpathyCards は HomeBrandStorySection に改名しました。DOM、CSSクラス、画像、リンク、表示順、アンカー、aria-labelledbyと見出しIDは維持しています。home-empathy-heading は既存DOMのIDとして残しています。

## 表示ルールと影響範囲

- src/app/globals.css: 全体の色・フォント・共通スタイル。home-landing-copy の p / li の折り返しは現行トップ内に適用。
- HomeLandingSectionHeading: 現行トップでは実装例、代表メッセージ、FAQから利用。ほかに旧構成候補からの参照もあります。
- HomeSectionShell: 背景色を担当。内側の幅・余白は各セクションが担当。
- src/lib/content/home-landing.ts: トップの主要文言。全項目が現行トップで使われているとは限りません。
- src/lib/ui/landing-cta-styles.ts: サービス詳細・prototype-showroom・トップで共用するCTAの寸法。LANDING_CTA_BUTTON_CLASSを使用。色・リンク・配置は各部品が担当。旧src/lib/content/home-landing-styles.tsは互換exportのみ。
- demo-showcase/: デモの枠、再生処理、表示領域検知。TopFeaturedDemoShowcase 内にデモ種類別の表示部品があります。
- src/lib/site-features.ts: SITE_CONCIERGE_ENABLED は現在 false。チャット部品の存在と画面上の有効化は別です。

トップの幅・余白・文字・CTAの既存指定は src/components/home/home-presentation.ts でセクション別に管理します。数値を統一せず、既存の違いを保持しています。文言、構造、カード内部、図解、デモ再生処理は各部品とコンテンツファイルが担当します。

## 現行ルートから到達しないトップ関連の候補

src/app 配下を入口として、src 内の相対パスと @/ パスの静的import、文字列リテラルのdynamic importを追跡しました。以下24ファイルには入口からの経路がありませんでした。

これは旧実装または保留実装の候補という分類です。将来の採用予定や履歴上の意図はコードの参照だけでは断定できません。削除は行っていません。スクリプト・設定・文字列からの動的参照は削除検討時に別途確認が必要です。

| グループ | ファイル（src/components/home/からの相対パス） | 確認した関係 |
| --- | --- | --- |
| 旧下部構成候補 | HomeSectionStickyNav.tsx、HomeBelowFoldDeferred.tsx、HomeBelowFold.tsx | StickyNavが事前読込イベントを参照、DeferredがBelowFoldを読み込む。現行の組立部品からは呼ばれない |
| 旧下部の内容候補 | HomeCompanyTeaser.tsx、HomeDemoEvidenceSection.tsx、HomeSeoEntrySection.tsx | HomeBelowFoldから呼ばれる |
| 旧導入構成候補 | HomeAcquisitionIntro.tsx、HomeHeroIntro.tsx、HomeQuickStartCards.tsx、HomeConsultCtaButton.tsx | Intro群がQuickStartCards、QuickStartCardsがConsultCtaButtonを利用 |
| 旧業種・パターン表示候補 | IndustryShowcaseSection.tsx、HomeIndustryTabs.tsx、IndustryShowcaseCard.tsx、PatternCaseGrid.tsx | AcquisitionIntro / SeoEntryから業種・パターンへ、業種部品からTabs、TabsからCardへ |
| 別の実装例表示候補 | HomeImplementationShowcaseSection.tsx、HomeHorizontalDots.tsx | ImplementationShowcaseSectionとDemoEvidenceSectionがDotsを利用 |
| 独立セクション候補 | HomeFirstViewActions.tsx、HomeMissionSection.tsx、HomeServiceFlowRow.tsx、HomeSolutionsSection.tsx、HomeWhyPillars.tsx | src内に呼び出し元を確認できない |
| 記事目次候補 | articles/HomeArticleToc.tsx、articles/ArticleTocDirectory.tsx、articles/ArticleTocIcon.tsx | HomeArticleToc → Directory → Icon。HomeArticleTocの呼び出し元は確認できない |

HomeBelowFold が現行のFAQやCTAを参照していても、HomeBelowFold自体が現行ページから呼ばれていることにはなりません。似た名前の IndustryShowcaseSection と現行の HomeIndustryShowcaseSection も別の部品です。

## 次の工程

1. 現行の表示を記録する。
2. トップのコンテナ幅・左右余白・見出し・本文・CTAの責任範囲を整理する。
3. 表示を維持した整理を検証する。
4. 日本語の改行、本文、空白、配置を順次改善する。

旧候補の削除、全サイトの命名統一、チャットや見積もりの大規模分割は、この工程の完了条件に含めません。

## 変更基盤の管理範囲（2026-10-05）

| 管理対象 | 変更する場所 | 影響範囲 |
| --- | --- | --- |
| セクション順序 | HomeLandingPage.tsx | 現行トップ |
| 各セクションの幅・余白・文字・主要CTA | home-presentation.ts の該当セクションの定数 | 対応するトップ部品。旧トップから同じ部品を呼ぶ場合も適用 |
| 共通見出しの幅・文字・リード | HOME_SECTION_HEADING_STYLES / HomeLandingSectionHeading | 現行トップと旧トップの共通見出し利用部品 |
| 背景ラッパ | HomeSectionShell | トップ、サービス詳細など。トップ専用ではない |
| CTAの共用寸法 | lib/ui/landing-cta-styles.ts | トップ、サービス詳細、ショールーム、旧トップ候補 |
| 本文の折り返し | globals.css の home-landing-copy p / li | クラスを付けた領域。サービス詳細にも利用があるため、トップだけを直す際はルート範囲を確認 |
| 色・フォント・共通ボタン | globals.css、layout.tsx、ui/button.tsx | サイト全体 |
| 動きを減らす設定 | hooks/use-reduced-motion.ts | Hero、チャット、見積もり、体験デモ等の利用部品 |

今回はスタイル文字列とDOMを維持して責任の所在を明確化しました。新しい汎用セクション部品、強制的な余白・文字サイズの統一は導入していません。共用CTAの旧exportは互換性のため残していますが、src内の利用元は新しいimportへ移行済みです。

useReducedMotionはuseSyncExternalStoreでブラウザの設定を購読する方式へ変更しました。サーバーおよび初回hydrationの値は従来と同じfalseで、設定変更の購読と解除を維持します。

[整理前後の表示・操作検証](ui-foundation-2026-10-05/verification.md) を参照してください。

## UI・UX変更（2026-10-06）

現行トップに home-top クラスを追加し、本文の自然な折り返しは globals.css の .home-top p / li で管理します。home-landing-copy を使う下層ページへは適用しません。幅・文字・余白の現在値と検証結果は [UI・UX改善報告](uiux-2026-10-06/verification.md) を参照してください。

