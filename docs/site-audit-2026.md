# サイト全体監査レポート（フェーズA）
作成日: 2026-05-06
対象: src/app/ 配下の全ページ、src/components/ 一覧

> このレポートはコードを一切変更せず、調査のみで作成しています。
> 推測した部分は「推測:」、不確実な箇所は「要確認:」と明記しています。

---

## 1. ページ一覧表

| URL | ファイルパス | 主要セクション数(推測) | 旧コンセプト関連 |
|-----|------------|-------------------|----------------|
| / | src/app/page.tsx | 推測: 複数（HeroSection内に複数セクション） | なし（page.tsxレベルでは）|
| /about | src/app/about/page.tsx | 推測: 3（values / approach / domains） | なし |
| /contact | src/app/contact/page.tsx | 推測: 5（タイトル・CTA・フロー・フォーム・保証） | なし |
| /flow | src/app/flow/page.tsx | 推測: 複数（タブ切り替え式タイムライン） | なし |
| /services | src/app/services/page.tsx | 推測: 3（カード2枚 + タブ詳細パネル） | あり（「AIコンシェルジュへの相談は」） |
| /services/consulting | src/app/services/consulting/page.tsx | — | なし（/consulting へ永続リダイレクト） |
| /services/development | src/app/services/development/page.tsx | — | なし（/flow へ永続リダイレクト） |
| /experience | src/app/experience/page.tsx | — | なし（/demo へリダイレクト） |
| /experience/[slug] | src/app/experience/[slug]/page.tsx | 推測: 3（パンくず・ヘッダー・プロトタイプ本体） | なし（page.tsxレベルでは）|
| /demo | src/app/demo/page.tsx | 推測: 4（Featured・TypeExperience・PurposePick・カタログCTA） | あり（体験ラボ表現・demoHubCopy参照） |
| /demo/list | src/app/demo/list/page.tsx | 推測: 3（ヘッダー・コンシェルジュ同期・一覧） | あり（「コンシェルジュで絞り込む」） |
| /demo/[slug] | src/app/demo/[slug]/page.tsx | 推測: 複数（タグ・本体・説明・CTA） | なし（page.tsxレベルでは）|
| /consulting | src/app/consulting/page.tsx | 推測: 3以上（セクション配列ループ） | なし |
| /estimate-detailed | src/app/estimate-detailed/page.tsx | 推測: 1（フォームウィザード） | なし |
| /estimate-detailed/amount | src/app/estimate-detailed/amount/page.tsx | 推測: 1（金額表示） | なし |
| /estimate-detailed/processing | src/app/estimate-detailed/processing/page.tsx | 推測: 1（処理中表示） | なし |
| /estimate-detailed/result | src/app/estimate-detailed/result/page.tsx | 推測: 1（結果表示） | なし |
| /solutions/[slug] | src/app/solutions/[slug]/page.tsx | 推測: 複数（業種別ハブ） | なし |

---

## 2. 各ページ詳細

### / (トップページ)
- **役割**: サイト最初の接点。問い合わせ獲得に向けた主要CVページ
- **主要コンテンツ**: `HeroSection` コンポーネント1本がすべてのセクションを内包している。推測: 内部はFirstView・メッセージ・サービス紹介・CTA等の複数セクションで構成
- **使用コンポーネント**: `PageShell`, `HeroSection`
- **主要見出し・タイトル**: 「経営課題の言語化から動くシステムまで。コンサル・開発の一気通貫 | AXEON」（メタタイトル）
- **旧コンセプト残骸**: page.tsx 自体にはなし（HeroSection内は要別途確認）

### /about (会社紹介)
- **役割**: チームの姿勢・価値観・専門領域の紹介
- **主要コンテンツ**: 3カラムグリッドで values / approach / domains を表示。コピーは `aboutCopy` に集約。メンバーデータはSanityから取得するが `void members` で現在未使用
- **使用コンポーネント**: `PageShell`, `AboutPageContent`, `PageSectionWithScroll`
- **主要見出し・タイトル**: `aboutCopy.title`（site-copy.ts から参照）
- **旧コンセプト残骸**: なし

### /contact (問い合わせ)
- **役割**: 問い合わせフォームページ。送信前に要件整理を促す構成
- **主要コンテンツ**: ① 見出し・目的説明 → ② 詳細見積ショートカットCTA → ③ `ContactFlowSteps`（フロー説明） → ④ `ContactForm` → ⑤ 保証事項リスト
- **使用コンポーネント**: `PageShell`, `ContactPageContent`, `ContactFlowSteps`, `ContactForm`
- **主要見出し・タイトル**: `contactCopy.title`（site-copy.ts から参照）
- **旧コンセプト残骸**: なし

### /flow (開発の流れ)
- **役割**: 開発プロセスの透明化・ステップ説明ページ
- **主要コンテンツ**: タブ切り替え式タイムライン（推測: Webサイト制作・アプリ開発・業務ダッシュボードの3タブ）
- **使用コンポーネント**: `PageShell`, `FlowTimelinePageContent`
- **主要見出し・タイトル**: 「開発の流れ | AXEON」
- **旧コンセプト残骸**: なし

### /services (サービス一覧)
- **役割**: サービス全体の入口。開発・コンサルの2軸を紹介し、詳細をタブで見せる
- **主要コンテンツ**: ① 「AIコンシェルジュへの相談は〜」のリード文 → ② 開発カード・コンサルカード（クリックでコンシェルジュ起動） → ③ タブ詳細（開発の流れ / コンサルティング内容）
- **使用コンポーネント**: `PageShell`, `ServicesPageContent`, `FlowTimelinePageContent`（埋め込み）, `ConsultingDetailPageContent`（埋め込み）
- **主要見出し・タイトル**: `servicesCopy.title`（site-copy.ts から参照）
- **旧コンセプト残骸**: **あり** — `ServicesPageContent.tsx:52` に「AIコンシェルジュへの相談は、『チャットで相談する』から。」という文言が表示文として存在

### /services/consulting (旧コンサルページ)
- **役割**: 永続リダイレクト（301）で `/consulting` に転送するだけのシム
- **主要コンテンツ**: コンテンツなし（リダイレクトのみ）
- **使用コンポーネント**: なし
- **旧コンセプト残骸**: なし

### /services/development (旧開発ページ)
- **役割**: 永続リダイレクト（301）で `/flow` に転送するだけのシム
- **主要コンテンツ**: コンテンツなし（リダイレクトのみ）
- **使用コンポーネント**: なし
- **旧コンセプト残骸**: なし

### /experience (体験インデックス)
- **役割**: `/demo` へのリダイレクト（302）。コメントに「体験ハブは `/demo` に統合」と明記
- **主要コンテンツ**: コンテンツなし（リダイレクトのみ）
- **使用コンポーネント**: なし
- **旧コンセプト残骸**: なし（ただしこのルート自体が旧構造の残留パスである可能性あり）

### /experience/[slug] (体験プロトタイプ個別)
- **役割**: インタラクティブなプロトタイプ体験ページ。体験ハブ・デモ詳細からの動線
- **主要コンテンツ**: パンくずナビ → ティアバッジ → タイトル + 説明 → `ExperiencePrototypeRunner`（体験本体） → `DemoExploreStickyRail`（スティッキーナビ）
- **使用コンポーネント**: `PageShell`, `ExperiencePrototypeRunner`, `DemoExploreStickyRail`
- **主要見出し・タイトル**: `meta.title | 体験 | AXEON`（プロトタイプレジストリから動的取得）
- **旧コンセプト残骸**: なし（page.tsxレベルでは）

### /demo (体験ハブ)
- **役割**: demoと体験の集約入口。Featured体験・形式別・目的別・一覧CTAの4セクション
- **主要コンテンツ**: ① ヘッダー（タイトル・intro・guide・コンシェルジュCTAボタン） → ② FeaturedExperience（注目インタラクティブ体験） → ③ TypeExperienceSection → ④ PurposePickSection → ⑤ カタログCTA（/demo/listへ）
- **使用コンポーネント**: `PageShell`, `DemoPageContent`, `FeaturedExperienceVideoCardWithReturn`, `TypeExperienceSection`, `PurposePickSection`, `DemoConciergeCtaButton`
- **主要見出し・タイトル**: 「DXの種が見つかる、体験ラボ」（`demoHubCopy.title`）
- **旧コンセプト残骸**: **あり** — `src/app/demo/page.tsx:9` のメタdescriptionに「DXの種が見つかる体験ラボ。demo で課題の気づきと解決のヒントをつかみ」という体験・demo主役的な文言。`demoHubCopy` の `guide` にも「体験demoによって、漠然とした課題への気づきが得られます」が存在（`src/lib/content/site-copy.ts:208`）

### /demo/list (demo一覧・比較)
- **役割**: 全demoをカテゴリ別・形式別に横断比較できる一覧ページ
- **主要コンテンツ**: ① ヘッダー（「demo一覧・比較」見出し + コンシェルジュ説明文） → ② `DemoListConciergeUrlSync`（URLクエリ→コンシェルジュ自動起動） → ③ `DemoListContent`（カテゴリ別水平スクロールレール）
- **使用コンポーネント**: `PageShell`, `DemoListContent`, `DemoListConciergeUrlSync`
- **主要見出し・タイトル**: 「demo一覧・比較」
- **旧コンセプト残骸**: **あり** — `src/app/demo/list/page.tsx:13` のメタdescriptionに「迷う場合はコンシェルジュで絞り込めます」、`page.tsx:27` の本文に「迷う場合だけコンシェルジュで絞り込んでください」

### /demo/[slug] (demo詳細)
- **役割**: 個別demoの詳細ページ。Sanityから動的取得。実AIデモ・モックデモの両対応
- **主要コンテンツ**: タグ・タイトル → 体験版リンク（あれば）→ プロトタイプRunner（あれば）→ DemoRuntimePanel → 動画/画像 → 説明・できること・おすすめ → CTA → `DemoExploreStickyRail`
- **使用コンポーネント**: `PageShell`, `DemoDetailContent`, `DemoExploreStickyRail`, `ExperiencePrototypeRunner`（条件付き）
- **主要見出し・タイトル**: `demo.title | AXEON`（Sanityから動的取得）
- **旧コンセプト残骸**: なし（page.tsxレベルでは）

### /consulting (コンサルティング詳細)
- **役割**: コンサルティングサービスの詳細説明ページ
- **主要コンテンツ**: セクション配列のループ表示（kicker → heading → body）+ フッターCTA。`consultingDetailPageCopy` のセクション数だけセクション存在（要確認:何セクションか）
- **使用コンポーネント**: `PageShell`, `ConsultingDetailPageContent`, `ServiceCrossLinks`
- **主要見出し・タイトル**: `consultingDetailPageCopy.title`（site-copy.ts から参照）
- **旧コンセプト残骸**: なし

### /estimate-detailed (詳細見積もり・フォーム)
- **役割**: 詳細見積もりの入口フォーム。AIによる仮要件整理・概算レンジ提示
- **主要コンテンツ**: `EstimateDetailedFormContent`（ウィザード形式フォーム）
- **使用コンポーネント**: `PageShell`, `EstimateDetailedFormContent`
- **主要見出し・タイトル**: 「詳細見積もり（初期検討） | AXEON」
- **旧コンセプト残骸**: なし（page.tsxレベルでは）。ただしメタdescriptionに「AIが整理します」という記述あり

### /estimate-detailed/amount (見積もり金額)
- **役割**: 詳細見積もりフローの金額提示ステップ（noindex設定）
- **主要コンテンツ**: `EstimateDetailedAmountContent`
- **使用コンポーネント**: `PageShell`, `EstimateDetailedAmountContent`
- **主要見出し・タイトル**: 「金額の目安 | 詳細見積もり | AXEON」
- **旧コンセプト残骸**: なし

### /estimate-detailed/processing (見積もり処理中)
- **役割**: 詳細見積もりフローの処理中ステップ（noindex設定）
- **主要コンテンツ**: `EstimateDetailedProcessingContent`
- **使用コンポーネント**: `PageShell`, `EstimateDetailedProcessingContent`
- **主要見出し・タイトル**: 「内容を整理しています | 詳細見積もり | AXEON」
- **旧コンセプト残骸**: なし

### /estimate-detailed/result (見積もり結果)
- **役割**: 詳細見積もりフローの結果表示ステップ（noindex設定）。メタタイトルに「自動」という言葉あり
- **主要コンテンツ**: `EstimateDetailedResultContent`
- **使用コンポーネント**: `PageShell`, `EstimateDetailedResultContent`
- **主要見出し・タイトル**: 「内容の整理（自動） | 詳細見積もり | AXEON」
- **旧コンセプト残骸**: **要確認**: メタタイトルに「（自動）」という表記。これが旧「自動見積もり」コンセプトの残骸かどうかは戦略との照合が必要

### /solutions/[slug] (業種別ソリューションハブ)
- **役割**: 業種別の改善ヒント・関連デモの紹介ページ
- **主要コンテンツ**: `IndustryHubContent`（業種別コンテンツ）
- **使用コンポーネント**: `PageShell`, `IndustryHubContent`
- **主要見出し・タイトル**: `${item.label}向けの改善ヒント | AXEON`（動的）
- **旧コンセプト残骸**: なし（page.tsxレベルでは）

---

## 3. 旧コンセプト関連箇所

### 「コンシェルジュ」系キーワード（ユーザー表示文として含まれるもの）

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/components/services/ServicesPageContent.tsx` | 52 | `AIコンシェルジュへの相談は、『チャットで相談する』から。`（画面表示文） |
| `src/components/chat/ChatContainer.tsx` | 103 | `title: "AIコンシェルジュ"`（チャットパネルのタイトル） |
| `src/components/chat/ChatContainer.tsx` | 704 | `aria-label="相談・ガイド（AIコンシェルジュ）を開く"`（FABのaria-label） |
| `src/components/chat/ChatContainerLazy.tsx` | 58 | `aria-label="相談・ガイド（AIコンシェルジュ）を開く"`（FABのaria-label） |
| `src/app/demo/list/page.tsx` | 13 | メタdescription: `迷う場合はコンシェルジュで絞り込めます` |
| `src/app/demo/list/page.tsx` | 27 | 本文: `迷う場合だけコンシェルジュで絞り込んでください` |
| `src/components/demo/DemoListContent.tsx` | 358 | `迷う場合だけ、コンシェルジュで条件を選ぶと近い demo を絞り込めます。`（UI表示） |
| `src/lib/content/site-copy.ts` | 47 | `regionAriaLabel: "AIコンシェルジュからの案内"`（homeページ分） |
| `src/lib/content/site-copy.ts` | 111 | `regionAriaLabel: "AIコンシェルジュからの案内"`（otherページ分） |
| `src/lib/content/site-copy.ts` | 1047 | `"AIコンシェルジュと業務改善の体験を、相談から実装までつなげます。"` |
| `src/lib/ai/concierge-prompts.ts` | 159 | AIシステムプロンプト: `あなたはAXEONのAIコンシェルジュ（サイト全体・トップ相当）です。` |
| `src/lib/chat/estimate-handoff.ts` | 453 | 内部ラベル: `"【AIコンシェルジュからの引き継ぎ】"` |

コメント・内部識別子として含まれるもの（ユーザー非表示）:
- `src/hooks/use-concierge-container-effects.ts:53,156`
- `src/sanity/schemaTypes/aiDemo.ts:189,202,222,234,316`
- `src/components/chat/assistant-markdown.tsx:16`
- `src/components/demo/DemoListContent.tsx:74,298`
- `src/components/demo/TypeExperienceSection.tsx:64`
- `src/components/chat/ChatContainer.tsx:4`
- `src/components/demo/DemoListConciergeUrlSync.tsx:9`
- `src/components/chat/HomeConciergeFlow.tsx:512`（内部ログ用）
- `src/lib/sanity/types.ts:92,94,96,98,110`
- `src/lib/content/site-copy.ts:654`
- `src/lib/chat/concierge-chat-error-message.ts:2`
- `src/lib/chat/chat-auto-open.ts:7,8`
- `src/lib/chat/concierge-analytics.ts:2`
- `src/lib/chat/assistant-internal-path.ts:2`
- `src/lib/chat/uimessage-text.ts:3`
- `src/lib/chat/estimate-handoff.ts:37,73,80,244`
- `src/lib/estimate/apply-concierge-industry-to-form.ts:9`
- `src/lib/chat/concierge-session-id.ts:2`
- `src/lib/estimate/concierge-path-to-estimate-draft.ts:61`
- `src/lib/chat/concierge-flow-definitions.ts:2`
- `src/lib/chat/concierge-routing.ts:2`
- `src/lib/demo/demo-hub-sections.ts:59`
- `src/lib/estimate/estimate-detailed-session.ts:20`
- `src/lib/estimate/estimate-industry-risk-adjustment.ts:23`
- `src/lib/estimate/estimate-output-philosophy.ts:6`

### 「AIに相談」「AI相談」系

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/components/chat/ChatContainer.tsx` | 708 | FABボタンのラベル: `AIに相談`（画面表示文） |
| `src/components/chat/ChatContainerLazy.tsx` | 75 | FABボタンのラベル: `AIに相談`（画面表示文） |
| `src/components/chat/ConciergeFabNudge.tsx` | 65 | コンポーネントコメント: `右下「AIに相談」FABの直上。`（コメントのみ） |
| `src/lib/content/site-copy.ts` | 14 | コメント: `右下FAB「AIに相談」付近の先回り吹き出し`（コメントのみ） |
| `src/lib/experience/professional-mini-sfa/demo-copy.ts` | 40 | `label: "AI相談要約"`（ラベル文字列・要確認: 表示されるかどうか） |

### 「チャットボット」「ボット」系

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/components/chat/ConciergeDemoRecommendOverlay.tsx` | 99,107 | デフォルトラベル: `"demo検索ボットに戻る"`（UI表示文） |
| `src/components/chat/DemoListConciergeFlow.tsx` | 57 | コメント: `「demo検索ボットに戻る」でウィザードをリセットしたとき` |
| `src/lib/freeform/extract-freeform-facts.ts` | 43 | 正規表現内: `チャットボット`（内部キーワード解析用・ユーザー非表示） |
| `src/lib/freeform/extract-freeform-facts.ts` | 60 | 正規表現内: `社内チャットボット|チャットボット|faqボット`（内部解析用） |
| `src/lib/experience/internal-knowledge/resolver.ts` | 69 | AIシステムプロンプト内: `社内ナレッジ案内ボットです`（AI指示文） |

### 「自動見積もり」系

- 検索結果: **マッチなし**
- 要確認: `/estimate-detailed/result/page.tsx` のメタタイトル「内容の整理（自動）」が旧「自動見積もり」の名残かどうかは文脈確認が必要

### その他（demoや体験を主役にした文言）

| ファイル | 行 | 内容 |
|---------|-----|------|
| `src/app/demo/page.tsx` | 9 | メタdescription: `DXの種が見つかる体験ラボ。demo で課題の気づきと解決のヒントをつかみ` |
| `src/lib/content/site-copy.ts` | 205 | `title: "DXの種が見つかる、体験ラボ"`（`demoHubCopy.title`・/demo のh1） |
| `src/lib/content/site-copy.ts` | 206 | `intro: "漠然としたDX化のイメージを膨らませる場所です。"` |
| `src/lib/content/site-copy.ts` | 208 | `guide: "体験demoによって、漠然とした課題への気づきが得られます。また、解決策へのヒントにも役立ちます。"` |
| `src/lib/content/site-copy.ts` | 157 | `{ href: "/demo", label: "体験デモ" }`（topCopy `homeSelfServeRowCopy` 内） |
| `src/lib/content/site-copy.ts` | 174 | `title: "実例から、可能性を掴む。"`（homeQuickStartCopy.experience） |
| `src/lib/content/site-copy.ts` | 175-176 | `体験` / `「何ができるか」を直感的に理解しましょう。`（homeQuickStartCopy内） |
| `src/lib/content/site-copy.ts` | 7-10 | `topCopy.tagline: "「話す」だけで、次が見えてくる。"` — 旧AIチャット中心コンセプトの可能性あり（要確認） |

---

## 4. コンポーネント一覧（分類はフェーズBで実施）

src/components/ 配下の全ファイル一覧:

### about/
- `AboutPageContent.tsx`
- `TeamMember.tsx`

### chat/
- `assistant-markdown.tsx`
- `ChatBubble.tsx`
- `ChatContainer.tsx`
- `ChatContainerLazy.tsx`
- `ChatInput.tsx`
- `ChatMessages.tsx`
- `ChatPopup.tsx`
- `ChatSheet.tsx`
- `concierge-chat-context.tsx`
- `ConciergeChoiceButton.tsx`
- `ConciergeDemoRecommendOverlay.tsx`
- `ConciergeEmptyPanel.tsx`
- `ConciergeEntryPicker.tsx`
- `ConciergeFabNudge.tsx`
- `ConciergeIndustryStep.tsx`
- `ConciergeThinkingIndicator.tsx`
- `DemoListConciergeFlow.tsx`
- `HomeConciergeFlow.tsx`
- `ServiceCardConciergeStartFlow.tsx`
- `ServicesConciergeFlow.tsx`
- `VoiceToggle.tsx`

### contact/
- `ContactAnsweredSnapshotSummary.tsx`
- `ContactFlowSteps.tsx`
- `ContactForm.tsx`
- `ContactIntakeHearingBlock.tsx`
- `ContactPageContent.tsx`

### demo/
- `DemoCard.tsx`
- `DemoConciergeCtaButton.tsx`
- `DemoDetailContent.tsx`
- `DemoListConciergeUrlSync.tsx`
- `DemoListContent.tsx`
- `DemoListRecommendationPopup.tsx`
- `DemoPageContent.tsx`
- `DemoRuntimePanel.tsx`
- `DemoStoryScroll.tsx`
- `MockStyleExperienceCard.tsx`
- `PurposePickSection.tsx`
- `TypeExperienceSection.tsx`

### estimate/
- `EstimateDetailedAmountContent.tsx`
- `EstimateDetailedContent.tsx`
- `EstimateDetailedFormContent.tsx`
- `EstimateDetailedHearingWizard.tsx`
- `EstimateDetailedInquiryPreparation.tsx`
- `EstimateDetailedMobileShell.tsx`
- `EstimateDetailedPhilosophyFootnote.tsx`
- `EstimateDetailedProcessingContent.tsx`
- `EstimateDetailedResultBody.tsx`
- `EstimateDetailedResultContent.tsx`
- `EstimateDetailedResumeQuestionsButton.tsx`
- `EstimateDetailedRoughEstimateAccordion.tsx`
- `EstimateDetailedRoughEstimateBody.tsx`
- `EstimateDetailedRoughEstimateFab.tsx`
- `EstimateRequirementDocMarkdown.tsx`

### experience/
- `DemoExploreStickyRail.tsx`
- `ExperienceCard.tsx`
- `ExperiencePageContent.tsx`
- `ExperiencePrototypeRunner.tsx`
- `FeaturedExperienceVideoCard.tsx`
- `FeaturedExperienceVideoCardWithReturn.tsx`

#### experience/prototypes/
- `DocumentShellPresetExperience.tsx`
- `DriverVoiceIncidentExperience.tsx`
- `InquiryIntakeTriageExperience.tsx`
- `InternalKnowledgeBotExperience.tsx`
- `LegalMemorySecretaryExperience.tsx`
- `LiveSyncTranslationExperience.tsx`
- `OpsReportMetricsExperience.tsx`
- `ProfessionalMiniSfaExperience.tsx`
- `PropertyExteriorPhotoExperience.tsx`
- `ReceiptPhotoExpenseExperience.tsx`
- `RestaurantOpsDashboardExperience.tsx`
- `ServiceClaimReplyExperience.tsx`
- `WorkflowApprovalLiteExperience.tsx`

#### experience/prototypes/professional-mini-sfa/
- `MiniSfaBoardTab.tsx`
- `MiniSfaContactsTab.tsx`
- `MiniSfaCreateDealDialog.tsx`
- `MiniSfaDashboardTab.tsx`
- `MiniSfaDealDetail.tsx`
- `MiniSfaIntegrationPreview.tsx`

#### experience/prototypes/restaurant-dashboard/
- `AppShell.tsx`
- `DashboardHomeGrid.tsx`
- `DemoIntroOverlay.tsx`
- `DemoTelopFullSlide.tsx`
- `DemoTelopOverlay.tsx`
- `EventLog.tsx`
- `ReplayControls.tsx`
- `SpotlightRing.tsx`

#### experience/prototypes/restaurant-dashboard/chapters/
- `ExpensesChapter.tsx`
- `PayrollChapter.tsx`
- `ReceiptsChapter.tsx`
- `ShiftChapter.tsx`
- `TrafficChapter.tsx`

#### experience/prototypes/wizard/
- `FreeformChatPanel.tsx`
- `GuidedStepPanel.tsx`
- `IndustryPicker.tsx`
- `KnowledgeAnswerCard.tsx`
- `LoadingPanel.tsx`
- `WizardOverlay.tsx`

#### experience/shells/
- `BeforeAfterDocumentShell.tsx`
- `DocumentShellChoiceFields.tsx`
- `DocumentShellChoiceWizard.tsx`

### home/
- `HeroSection.tsx`
- `HomeAcquisitionIntro.tsx`
- `HomeBelowFold.tsx`
- `HomeBelowFoldDeferred.tsx`
- `HomeClosingCta.tsx`
- `HomeCompanyTeaser.tsx`
- `HomeConsultCtaButton.tsx`
- `HomeDemoEvidenceSection.tsx`
- `HomeEmpathyCards.tsx`
- `HomeFaqSection.tsx`
- `HomeFirstView.tsx`
- `HomeFirstViewActions.tsx`
- `HomeHeroIntro.tsx`
- `HomeHorizontalDots.tsx`
- `HomeIndustryTabs.tsx`
- `HomeLandingSectionHeading.tsx`
- `HomeQuickStartCards.tsx`
- `HomeSectionShell.tsx`
- `HomeSectionStickyNav.tsx`
- `HomeSeoEntrySection.tsx`
- `HomeServiceFlowRow.tsx`
- `HomeWhyPillars.tsx`
- `IndustryShowcaseCard.tsx`
- `IndustryShowcaseSection.tsx`
- `PatternCaseGrid.tsx`

### journey/
- `VisitorJourneyTracker.tsx`

### layout/
- `CrossServiceNav.tsx`
- `Footer.tsx`
- `Header.tsx`
- `MobileNav.tsx`
- `PageSectionDivider.tsx`
- `PageSectionWithScroll.tsx`
- `PageShell.tsx`

### motion/
- `FadeIn.tsx`
- `MotionDiv.tsx`
- `PageContent.tsx`
- `PageTransition.tsx`
- `PulseScale.tsx`
- `ScrollSequence.tsx`
- `StaggerChildren.tsx`

### navigation/
- `ScrollRestoreOnRoute.tsx`
- `ScrollSavingLink.tsx`

### services/
- `ConsultingDetailPageContent.tsx`
- `FlowTimelinePageContent.tsx`
- `ServicesPageContent.tsx`

### solutions/
- `IndustryHubContent.tsx`

### three/
- `ParticleBackground.tsx`
- `ParticleField.tsx`

### ui/
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `sheet.tsx`
- `skeleton.tsx`
- `textarea.tsx`

---

## 5. フェーズA 数値サマリー
- 総ページ数（リダイレクトページ含む、/studio除く）: 18
  - うち実コンテンツページ: 14
  - うちリダイレクトのみ: 3（/services/consulting, /services/development, /experience）
  - うち動的ページ（[slug]）: 3（/experience/[slug], /demo/[slug], /solutions/[slug]）
  - うちnoindex設定ページ: 3（/estimate-detailed/amount, /estimate-detailed/processing, /estimate-detailed/result）
- 旧コンセプト関連（ユーザー表示文あり）ファイル数: 6
  - `src/components/services/ServicesPageContent.tsx`
  - `src/components/chat/ChatContainer.tsx`
  - `src/components/chat/ChatContainerLazy.tsx`
  - `src/app/demo/list/page.tsx`
  - `src/components/demo/DemoListContent.tsx`
  - `src/lib/content/site-copy.ts`（`demoHubCopy` 周辺）
- 旧コンセプト関連箇所数（ユーザー表示文・主要なもの）: 約12行
- コンポーネントファイル総数（.tsx）: 148ファイル

---

## 6. 注記（フェーズA）

### 推測した内容
- 各ページの「主要セクション数」は、page.tsx と主要コンポーネントのJSX構造から推測。ネストされたサブコンポーネント内のセクション数は含まない
- `HeroSection`（トップページ）の内部セクション数は読み込み対象外のため不明。`home/` 配下に24個のコンポーネントが存在することから、多数のセクションが存在すると推測
- `/consulting` の `consultingDetailPageCopy.sections` の配列数はsite-copy.tsの該当部分を確認していないため不明

### 要確認事項
- `/estimate-detailed/result` のメタタイトル「内容の整理（自動）」が旧「自動見積もり」コンセプトの残骸かどうか
- `src/lib/content/site-copy.ts` の `topCopy.tagline: "「話す」だけで、次が見えてくる。"` および `topCopy.subline` が現在も使用されているか（HeroSectionの読み込み調査が必要）
- `src/components/about/AboutPageContent.tsx` にて `void members` が実装されており、Sanityから取得したチームメンバーデータが表示に使われていない状態。これが意図的かどうか
- `src/lib/experience/professional-mini-sfa/demo-copy.ts:40` の `label: "AI相談要約"` がUI上で表示されるかどうか
- `InternalKnowledgeBotExperience.tsx` という「ボット」を含むコンポーネント名が、戦略上問題ないかどうか

### フェーズBで実施予定
- 戦略（docs/strategy.md）との整合性チェック
- コンポーネントの詳細分類（使用中/未使用、旧概念依存/独立）
- `HeroSection` および `home/` 配下の全コンポーネントの内容精査
- `site-copy.ts` の全体精査（topCopy等の使用状況確認）
- 旧コンセプト残骸の優先削除・修正リスト作成

---

# フェーズB: 戦略との整合性チェック + コンポーネント分類
追記日: 2026-05-06

---

## 7. 戦略との整合性チェック

### 参照した戦略ドキュメント
- `docs/strategy.md`: サイトの本来の役割は「営業・人脈紹介後の信頼補強装置」。「Big4出身」表記禁止・推奨表記・トーン方針・チャット機能の位置づけ（メインではなくサブ機能）を定義。
- `docs/redesign-2026.md`: ターゲットを中小から中堅（200〜3000名）以上に変更。ファーストビュー・CTAコピー・課題共感カードの新版を定義。2026年の段階的実装計画（ステップ1〜5）と第3次改修方針を含む。

### 7-1. ターゲット整合性（「中堅企業以上のDX推進担当者・経営層」）

- `/about`: **矛盾あり** — `aboutCopy.title` が「現場の困りごとを整理し、実装まで進めるチームです。」、`aboutCopy.purpose` が「東京都目黒区に拠点を置くスタートアップ企業です。業務の流れを一緒に整理し、小さく試しながら形にします。」。いずれも中小・スタートアップ向けのトーンで、中堅企業DX推進担当者が期待するプロフェッショナル感に欠ける。`aboutCopy.domains.items` にも「建設業・士業など」という小規模事業者向けの記述が残存。
- `/services`: **矛盾あり** — `ServicesPageContent.tsx:52` に「AIコンシェルジュへの相談は、『チャットで相談する』から。」という文言が表示されており、AIチャット体験主役の旧コンセプトに紐づく表現。中堅企業の経営層・DX推進担当者への訴求として不釣り合い。
- `/demo`: **軽度の矛盾** — `demoHubCopy.title` が「DXの種が見つかる、体験ラボ」、`demoHubCopy.intro` が「漠然としたDX化のイメージを膨らませる場所です。」。「漠然とした」という表現は既にDX課題を認識している中堅企業の担当者には語りかけとして弱い。
- `/estimate-detailed`: ヒアリング設問の業種選択肢（`site-copy.ts:846-858`）に「建設・土木・現場系」「士業・コンサル・事務所」「飲食・外食」など小規模事業者比率の高い業種が多く、中堅企業ターゲットとやや乖離。ただし「製造・ものづくり」「医療・福祉」なども含まれ、完全な矛盾ではない。
- `/consulting`, `/flow`, `/contact`: 矛盾なし。コピーはBtoB・プロフェッショナルトーンを維持。

### 7-2. トーン整合性（「プロフェッショナル、BtoB信頼感重視」）

フレンドリー過ぎる・カジュアル過ぎる表現:

- `src/lib/content/site-copy.ts:51` — `"うまく言えなくても大丈夫。質問に答えるだけで輪郭が見えてきます。"` — FABナッジのhomeページ向け文言。`conciergeFabNudgeByPageId.home.lines[2]`。「大丈夫」という口語的な安心付けは消費者向けトーンで、中堅企業経営層への語りかけとしてはカジュアル過ぎる。
- `src/lib/content/site-copy.ts:169` — `homeQuickStartCopy.consult.body`: 「AIの問いに答えるだけで、頭の中の「漠然とした悩み」が構造化されます。まずは短いメモを送る感覚で、整理を始めてください。」 — チャットボット主役かつ消費者向けトーン。ただし後述の通りこの定数はトップページの現行レイアウトでは使用されていない可能性あり（要確認）。
- `src/lib/content/site-copy.ts:170` — `homeQuickStartCopy.consult.ctaLabel: "悩みを1行で送る"` — 同上、カジュアル過ぎる。
- `src/lib/content/site-copy.ts:7-11` — `topCopy.tagline/subline`（「話す」だけで、次が見えてくる。/AIとの対話を通じて、あなたの頭の中にある「漠然とした悩み」を最短ルートで構造化します…）— 後述の通り現行トップページでは**未使用**だが、定数として残存している。
- `src/lib/content/site-copy.ts:1047` — `footerCopy.subline: "AIコンシェルジュと業務改善の体験を、相談から実装までつなげます。"` — フッターに全ページで表示。「AIコンシェルジュ」を前面に出した旧コンセプト表現で、BtoB信頼感重視の方針と不整合。`Footer.tsx:19` で実際に表示されている。
- `src/lib/content/home-acquisition.ts:7` — `homeAcquisitionHeroCopy.tagline: "話すだけで、次が見えてくる。"` — ただし `HomeAcquisitionIntro.tsx` コンポーネント自体が現行の `HeroSection` チェーンには含まれていないため、推測: 現在は未使用の可能性が高い（要確認）。

### 7-3. 「Big4出身」表記の有無

- 検索結果: **なし**
- 該当箇所: `src/` ディレクトリ全体を検索した結果、「Big4」「Big 4」「big4」「ビッグ4」いずれのキーワードもヒットしなかった。`docs/strategy.md` の方針（「Big4出身」表記は使わない）は現時点でコードに反映済みと判断。

### 7-4. 旧フレンドリートーンの残骸

| ファイル | 行 | 該当文言 | 問題点 |
|---------|-----|---------|--------|
| `src/lib/content/site-copy.ts` | 8 | `tagline: "「話す」だけで、次が見えてくる。"` | AIチャット主役・消費者向けトーン（現行トップでは未使用だが定数として残存） |
| `src/lib/content/site-copy.ts` | 9-11 | `subline: "AXEONは、ただ情報を載せるだけのサイトではありません。AIとの対話を通じて〜"` | 同上 |
| `src/lib/content/site-copy.ts` | 51 | `"うまく言えなくても大丈夫。質問に答えるだけで輪郭が見えてきます。"` | FABナッジのhome向け文言。カジュアル・消費者向け |
| `src/lib/content/site-copy.ts` | 169-170 | `homeQuickStartCopy.consult.body/ctaLabel` | 「漠然とした悩み」「悩みを1行で送る」はBtoB経営層向けとして弱い |
| `src/lib/content/site-copy.ts` | 1047 | `footerCopy.subline: "AIコンシェルジュと業務改善の体験を、相談から実装までつなげます。"` | フッターで全ページに表示。「AIコンシェルジュ」が前面に出ている |
| `src/lib/content/home-acquisition.ts` | 7 | `homeAcquisitionHeroCopy.tagline: "話すだけで、次が見えてくる。"` | 推測: 現行では未使用の可能性あり |
| `src/components/about/AboutPageContent.tsx` | 41-44 | `aboutCopy.title/purpose` | 「現場の困りごと」「スタートアップ」「小さく試しながら」—中堅企業向けプロ訴求として弱い |

### 7-5. その他の矛盾・気になる点

- **`homeQuickStartCopy` が現行トップページで使用されているかどうか不明**: `HomeQuickStartCards.tsx` が参照しているが、`HomeQuickStartCards.tsx` をインポートしているのは `HomeHeroIntro.tsx` と `HomeAcquisitionIntro.tsx` のみ。いずれも現行 `HeroSection` チェーン（`HomeFirstView` → `HomeBelowFold`）に含まれていないため、推測: 実際には未表示の可能性が高い（要確認）。
- **`estimateDetailedCopy.sectionResult: "内容の整理（自動）"` がメタタイトルに使われている**: `site-copy.ts:661` の定数値が `/estimate-detailed/result/page.tsx:6` のメタタイトルに反映されている。「（自動）」の文言は後述のフェーズA要確認項目で触れた通り。
- **`homeLandingCopy.faq` に「初回相談(無料)」の記述あり**: `src/lib/content/home-landing.ts:138` に「まずは初回相談(無料)で」という文言。`redesign-2026.md` では「無料を強調しすぎると中堅以上の決裁者には逆に安っぽく見える」と明記されており、「初回(無料)」への変更が推奨されている。

### 7-6. フェーズA「要確認」項目の回答

**topCopy.tagline「話す」だけで〜:**
- 使用状況: `site-copy.ts:8` に定義されており、`HomeHeroIntro.tsx:11` からインポートされている。しかし `HomeHeroIntro.tsx` は現行の `HeroSection`（`HomeFirstView` → `HomeBelowFold`）チェーンにインポートされていない。定義ファイルが存在するのみで、現行トップページには**表示されていない**と判断。
- 評価: 定数自体は旧AIチャット主役コンセプトの残骸。現行では未使用なので即時のユーザー影響はないが、コードベースの混乱要因として整理対象。

**estimate-detailed/result「（自動）」:**
- 評価: `estimateDetailedCopy.sectionResult: "内容の整理（自動）"` (`site-copy.ts:661`) と、同じ文字列を使ったメタタイトル (`result/page.tsx:6`) が存在する。これは「AIが内容を自動整理するフロー」という現行機能の説明として使われているものであり、旧「自動見積もり」コンセプトの残骸とは異なる。ただし `estimate-handoff.ts:427` にも「--- 開発に向けた内容の整理（自動） ---」という区切り文字列として使われており、文言として一貫している。旧概念の直接的な残骸ではなく、現機能の説明文言。ただしnoindexページのメタタイトルに「（自動）」という表現を使う必要があるかは再検討の余地あり。

**aboutページ void members:**
- 評価: `AboutPageContent.tsx:38` に `void members;` がある。これはTypeScriptの「変数を使ったことにする（lint警告回避）」パターン。Sanityからデータを取得しているが、現段階ではUIに表示しない設計になっている。`docs/strategy.md` の「顔出しなし（代表意向）」方針と整合しており、**意図的な実装**と判断。ただしSanityからのデータ取得処理は残ったまま（サーバー処理が走る）なので、パフォーマンス面から不要なら取得自体を除去する価値はある。

---

## 8. コンポーネント分類

### 8-1. 共通コンポーネント（全ページで使用）

- **layout/** (7ファイル): `PageShell.tsx`（全ページのラッパー）, `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `CrossServiceNav.tsx`, `PageSectionDivider.tsx`, `PageSectionWithScroll.tsx`
- **motion/** (7ファイル): `FadeIn.tsx`, `MotionDiv.tsx`, `PageContent.tsx`, `PageTransition.tsx`, `PulseScale.tsx`, `ScrollSequence.tsx`, `StaggerChildren.tsx` — アニメーション基盤として全体で共有
- **navigation/** (2ファイル): `ScrollRestoreOnRoute.tsx`, `ScrollSavingLink.tsx` — ルーティング全体で共有
- **ui/** (6ファイル): `button.tsx`, `card.tsx`, `input.tsx`, `sheet.tsx`, `skeleton.tsx`, `textarea.tsx` — shadcn/ui ベースの汎用UIプリミティブ
- **journey/** (1ファイル): `VisitorJourneyTracker.tsx` — 訪問者ジャーニー追跡（推測: 全ページで動作）
- **three/** (2ファイル): `ParticleBackground.tsx`, `ParticleField.tsx` — 推測: `ParticleBackground.tsx` はトップページの `HeroSection` 専用。`ParticleField.tsx` の使用箇所は別途要確認

### 8-2. トップページ専用コンポーネント

`home/` 配下（24ファイル）:

**現行HeroSectionチェーンで確実に使用中のもの:**
- `HeroSection.tsx` — トップページのルートコンポーネント
- `HomeFirstView.tsx` — ファーストビュー（見出し・CTA）
- `HomeFirstViewActions.tsx` — ファーストビューのCTAボタン群
- `HomeSectionStickyNav.tsx` — スクロール時スティッキーナビ
- `HomeSectionShell.tsx` — セクションラッパー（tone対応）
- `HomeEmpathyCards.tsx` — 「こんな課題に、お応えします」4カード
- `HomeWhyPillars.tsx` — 「なぜAXEONか」3カード
- `HomeServiceFlowRow.tsx` — サービスの流れ
- `HomeBelowFoldDeferred.tsx` — 遅延ローディングラッパー
- `HomeBelowFold.tsx` — 折り返し以降のセクション群
- `HomeDemoEvidenceSection.tsx` — 実績・デモセクション
- `HomeSeoEntrySection.tsx` — 業種別・業務別入口
- `HomeFaqSection.tsx` — FAQ
- `HomeCompanyTeaser.tsx` — 会社情報ティーザー
- `HomeClosingCta.tsx` — クロージングCTA
- `HomeLandingSectionHeading.tsx` — セクション見出しパターン
- `HomeHorizontalDots.tsx` — 推測: 装飾要素（上記チェーン内で使用の可能性）
- `IndustryShowcaseSection.tsx` — 業種別セクション（HomeSeoEntrySectionから参照の可能性）
- `IndustryShowcaseCard.tsx` — 業種カード

**推測: 現行では未使用（旧コンセプト残骸または未実装）:**
- `HomeHeroIntro.tsx` — `topCopy.tagline/subline` を使う旧ファーストビュー。現行HeroSectionチェーンから参照なし
- `HomeAcquisitionIntro.tsx` — 集客LP向けの旧ファーストビュー亜種。現行チェーンから参照なし
- `HomeQuickStartCards.tsx` — `homeQuickStartCopy` 使用。`HomeHeroIntro` と `HomeAcquisitionIntro` からのみ参照されており、どちらも現行チェーン外
- `PatternCaseGrid.tsx` — 業務パターングリッド。`HomeAcquisitionIntro` と `HomeSeoEntrySection` から参照。`HomeSeoEntrySection` が現行チェーンに含まれるため一部は使用中
- `HomeConsultCtaButton.tsx` — 推測: `HomeQuickStartCards.tsx` から参照。現行では未使用の可能性

### 8-3. 下層ページ専用コンポーネント

**/about 専用 (2ファイル):**
- `about/AboutPageContent.tsx`
- `about/TeamMember.tsx` — 推測: `AboutPageContent.tsx` の `void members` により現在は未表示だが定義は存在

**/contact 専用 (5ファイル):**
- `contact/ContactPageContent.tsx`
- `contact/ContactFlowSteps.tsx`
- `contact/ContactForm.tsx`
- `contact/ContactAnsweredSnapshotSummary.tsx`
- `contact/ContactIntakeHearingBlock.tsx`

**/services 専用 (3ファイル):**
- `services/ServicesPageContent.tsx`
- `services/FlowTimelinePageContent.tsx` — `/flow` ページおよび `/services` 内タブでも使用
- `services/ConsultingDetailPageContent.tsx` — `/consulting` ページおよび `/services` 内タブでも使用

**注記: `FlowTimelinePageContent.tsx` は `/flow` と `/services` 両ページで共有、`ConsultingDetailPageContent.tsx` は `/consulting` と `/services` 両ページで共有**

**/demo 関連 (12ファイル):**
- `demo/DemoPageContent.tsx` — `/demo` 専用
- `demo/DemoListContent.tsx` — `/demo/list` 専用
- `demo/DemoDetailContent.tsx` — `/demo/[slug]` 専用
- `demo/DemoCard.tsx` — デモカード共通
- `demo/DemoConciergeCtaButton.tsx` — コンシェルジュ起動ボタン（旧コンセプト関連）
- `demo/DemoListConciergeUrlSync.tsx` — URLクエリ→コンシェルジュ同期（旧コンセプト関連）
- `demo/DemoListRecommendationPopup.tsx` — 推測: コンシェルジュ結果ポップアップ（旧コンセプト関連）
- `demo/DemoRuntimePanel.tsx` — デモ実行パネル
- `demo/DemoStoryScroll.tsx` — 推測: ストーリースクロール演出
- `demo/MockStyleExperienceCard.tsx` — モック体験カード
- `demo/PurposePickSection.tsx` — 目的別セクション
- `demo/TypeExperienceSection.tsx` — 形式別セクション

**/experience 関連 (計27ファイル):**
- `experience/DemoExploreStickyRail.tsx` — `/experience/[slug]` および `/demo/[slug]` で使用
- `experience/ExperienceCard.tsx`
- `experience/ExperiencePageContent.tsx` — 推測: 旧 `/experience` ページ用（現在は `/demo` にリダイレクト）
- `experience/ExperiencePrototypeRunner.tsx` — プロトタイプ実行エンジン
- `experience/FeaturedExperienceVideoCard.tsx`
- `experience/FeaturedExperienceVideoCardWithReturn.tsx` — `/demo` の Featured セクションで使用
- `experience/prototypes/` (13ファイル) — 各プロトタイプ体験コンポーネント
- `experience/prototypes/professional-mini-sfa/` (6ファイル) — SFA体験専用
- `experience/prototypes/restaurant-dashboard/` (8ファイル + chapters/5ファイル) — 飲食ダッシュボード体験専用
- `experience/prototypes/wizard/` (6ファイル) — ウィザード形式体験専用
- `experience/shells/` (3ファイル) — 文書シェルプリセット用

**/estimate-detailed 関連 (15ファイル):**
- `estimate/EstimateDetailedFormContent.tsx` — フォーム入口
- `estimate/EstimateDetailedContent.tsx`
- `estimate/EstimateDetailedHearingWizard.tsx`
- `estimate/EstimateDetailedMobileShell.tsx`
- `estimate/EstimateDetailedPhilosophyFootnote.tsx`
- `estimate/EstimateDetailedProcessingContent.tsx`
- `estimate/EstimateDetailedResultBody.tsx`
- `estimate/EstimateDetailedResultContent.tsx`
- `estimate/EstimateDetailedAmountContent.tsx`
- `estimate/EstimateDetailedInquiryPreparation.tsx`
- `estimate/EstimateDetailedResumeQuestionsButton.tsx`
- `estimate/EstimateDetailedRoughEstimateAccordion.tsx`
- `estimate/EstimateDetailedRoughEstimateBody.tsx`
- `estimate/EstimateDetailedRoughEstimateFab.tsx`
- `estimate/EstimateRequirementDocMarkdown.tsx`

**/consulting 専用:**
- `services/ConsultingDetailPageContent.tsx`（上記 /services との共有）

**/solutions 専用 (1ファイル):**
- `solutions/IndustryHubContent.tsx`

### 8-4. 旧コンセプト関連（廃止検討候補）

**chat/ (21ファイル) — コンシェルジュ・AIチャット機能の全体:**
- `assistant-markdown.tsx` — AIマークダウン表示
- `ChatBubble.tsx` — チャット吹き出し
- `ChatContainer.tsx` — メインのチャットコンテナ（FABラベル「AIに相談」、タイトル「AIコンシェルジュ」を表示）
- `ChatContainerLazy.tsx` — 遅延ロードラッパー（FABラベル「AIに相談」を表示）
- `ChatInput.tsx` — チャット入力欄
- `ChatMessages.tsx` — メッセージ一覧
- `ChatPopup.tsx` — チャットポップアップ
- `ChatSheet.tsx` — チャットシートUI
- `concierge-chat-context.tsx` — チャットコンテキスト（全体状態管理）
- `ConciergeChoiceButton.tsx` — コンシェルジュ選択肢ボタン
- `ConciergeDemoRecommendOverlay.tsx` — デモ推薦オーバーレイ（「demo検索ボットに戻る」を表示）
- `ConciergeEmptyPanel.tsx` — 空パネル
- `ConciergeEntryPicker.tsx` — エントリーポイント選択
- `ConciergeFabNudge.tsx` — FABナッジ吹き出し
- `ConciergeIndustryStep.tsx` — 業種選択ステップ
- `ConciergeThinkingIndicator.tsx` — 思考中インジケーター
- `DemoListConciergeFlow.tsx` — デモ一覧用コンシェルジュフロー
- `HomeConciergeFlow.tsx` — ホーム用コンシェルジュフロー
- `ServiceCardConciergeStartFlow.tsx` — サービスカードからのコンシェルジュ起動
- `ServicesConciergeFlow.tsx` — サービスページ用コンシェルジュフロー
- `VoiceToggle.tsx` — 音声入力トグル

廃止する場合の影響:
- `ServicesPageContent.tsx`（サービスカードのクリックでコンシェルジュ起動）
- `DemoPageContent.tsx`（`DemoConciergeCtaButton`）
- `DemoListContent.tsx`（コンシェルジュ絞り込みボタン）
- `concierge-chat-context.tsx` を使う全コンポーネントが影響を受ける

**旧コンセプト関連・その他:**
- `demo/DemoConciergeCtaButton.tsx` — コンシェルジュ起動ボタン（廃止時は単純なリンクに置換可能）
- `demo/DemoListConciergeUrlSync.tsx` — URLクエリ→コンシェルジュ自動起動（廃止時は削除）
- `demo/DemoListRecommendationPopup.tsx` — 推測: コンシェルジュ推薦結果のポップアップ
- `home/HomeHeroIntro.tsx` — 旧ファーストビュー（`topCopy.tagline` 使用）、現行チェーン外
- `home/HomeAcquisitionIntro.tsx` — 旧集客LP向けファーストビュー、現行チェーン外
- `home/HomeQuickStartCards.tsx` — `homeQuickStartCopy` 使用（旧AI相談カード含む）、現行チェーンから実質未使用
- `experience/ExperiencePageContent.tsx` — 旧 `/experience` ページ用。`/experience` は現在 `/demo` へリダイレクトされているため実質未使用の可能性

### 8-5. 用途不明・要調査

- `home/HomeHorizontalDots.tsx` — ファイル名から水平ドット装飾要素と推測。現行チェーンでの使用箇所未確認
- `home/HomeConsultCtaButton.tsx` — `HomeQuickStartCards.tsx` からのみ参照の可能性（推測: 現行では未使用）
- `home/PatternCaseGrid.tsx` — `HomeSeoEntrySection` から参照されるため一部使用中だが、`HomeAcquisitionIntro` 経由の経路は現行未使用（二重参照の整理が必要）
- `experience/ExperienceCard.tsx` — 使用箇所未確認（推測: 旧 `/experience` ページまたはデモ一覧で使用）
- `experience/FeaturedExperienceVideoCard.tsx` — `FeaturedExperienceVideoCardWithReturn.tsx` と似た名前。後者は確実に使用中だが前者の使用箇所は未確認
- `experience/prototypes/wizard/` 6ファイル — ウィザード形式体験の内部コンポーネント。AIコンシェルジュのフリーフォームチャット関連の可能性あり（推測）

---

## 9. フェーズB 数値サマリー
- 戦略との矛盾箇所数: 7箇所（明確な矛盾4 + 軽度2 + 要注意1）
- 「Big4出身」表記: **なし**（`src/` 全体検索でヒットなし、strategy.md の方針が反映済み）
- コンポーネント分類結果:
  - 共通: 25ファイル（layout/7 + motion/7 + navigation/2 + ui/6 + journey/1 + three/2）
  - トップ専用: 24ファイル（home/ 全体）
  - 下層専用: 推測: 65ファイル（about/2 + contact/5 + services/3 + demo/12 + experience/27 + estimate/15 + solutions/1）
  - 旧コンセプト関連: 28ファイル（chat/21 + demo/旧コンセプト関連3 + home/未使用3 + experience/1）
  - 用途不明: 推測: 6ファイル（上記8-5参照）

---

## 10. 全体を通じた注記（フェーズB）

### 推測した内容
- `HomeHeroIntro.tsx`・`HomeAcquisitionIntro.tsx`・`HomeQuickStartCards.tsx` が現行トップページで未使用であることは、インポートチェーンを追った結果の推測。ビルド時の tree-shaking や動的インポートで実際に使われていないか、Next.js の静的解析で確認することを推奨する。
- `PatternCaseGrid.tsx` が `HomeSeoEntrySection.tsx` 経由で部分的に使用されているかどうかは `HomeSeoEntrySection.tsx` の内容を確認していないため推測。
- `three/ParticleField.tsx` の使用箇所は確認できず、`ParticleBackground.tsx` はトップページ専用と推測。
- `experience/` 内のプロトタイプコンポーネント群（prototypes/ 配下）は `/experience/[slug]` でプロトタイプレジストリ経由で動的に呼び出されるため全ファイルが使用中と推測。

### 要確認事項
- `homeQuickStartCopy`（`site-copy.ts`）と `homeLandingCopy.firstView` （`home-landing.ts`）の双方にファーストビュー相当のコピーが存在する。現行トップページは `home-landing.ts` を使用しているため、`site-copy.ts` の `homeQuickStartCopy` 等は未使用の可能性が高い。使用箇所を最終確認して不要なら整理対象。
- `footerCopy.subline`（「AIコンシェルジュと業務改善の体験を、相談から実装までつなげます。」）がフッターで全ページに表示されており、戦略との整合性上、更新が必要かどうかの判断が必要。
- FAQの「初回相談(無料)」表記（`home-landing.ts:138`）が `redesign-2026.md` 推奨の「初回(無料)」表記と一致していない点を確認・修正要否を判断すること。

### 優先的に対処を推奨する箇所
1. **最優先**: `footerCopy.subline`（`site-copy.ts:1047`）— 全ページのフッターに表示される「AIコンシェルジュ」文言の更新（影響大・変更コスト低）
2. **高優先**: `aboutCopy`（`site-copy.ts:612-638`）— `/about` ページのタイトル・目的文・ドメイン記述を中堅企業向けに更新
3. **高優先**: `ServicesPageContent.tsx:52` の「AIコンシェルジュへの相談は〜」文言の削除または更新
4. **中優先**: `conciergeFabNudgeByPageId.home.lines`（`site-copy.ts:48-52`）の「うまく言えなくても大丈夫」等のカジュアル表現見直し
5. **低優先（整理）**: `topCopy`（`site-copy.ts:7-11`）、`HomeHeroIntro.tsx`、`HomeAcquisitionIntro.tsx` の使用有無最終確認と未使用なら削除
