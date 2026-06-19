# ケア記録DX 体験デモ 要件定義書

| 項目 | 内容 |
|------|------|
| ドキュメント版 | v1.0 |
| 作成日 | 2026-06-19 |
| 対象 | AXEON サイト内インタラクティブ体験デモ（mock_preview） |
| 参照LP | `/lp/kaigo-care-dx`（[kaigo_demo](https://github.com/ideal-tomy/kaigo_demo) 由来） |
| 想定 slug | `kaigo-care-dx`（体験） / `kaigo-care-dx`（ギャラリーカード） |

---

## 1. 目的

障害福祉・訪問看護・訪問診療向けの「ケア記録DX」提案LP（`/lp/kaigo-care-dx`）内にある**ロール切替インタラクティブデモ**を、本サイトの体験デモ基盤（`ExperiencePrototypeRunner` + ローカル mock）として**実際に操作できる形**で実装する。

商談・ヒアリング・PoC 提案の場で、以下を 3 分程度で体感してもらうことを目的とする。

- 現場スタッフが「入力するだけ」で報告が完結する UX
- 内勤管理者が全拠点を俯瞰し、未報告・要対応を自動で前に出すダッシュボード
- 外部医療者が限定ポータル経由で、許可された情報のみ閲覧する連携モデル
- 自由記述の報告から、看護・支援記録ドラフトが自動構造化される中核フロー

---

## 2. 非ゴール（スコープ外）

本ドキュメントは**体験デモ（モック）**の要件定義であり、以下は対象外とする。

- 本番プロダクトとしての DB 設計・認証基盤・API 実装
- LINE Works / 電子カルテ等の外部システムとの実接続
- LLM によるリアルタイム生成（`runMode: ai_live` は使わない）
- 個人情報・医療情報の実データ保存
- 監査ログ・暗号化・同意管理の本番運用実装

---

## 3. 対象ユーザー（ペルソナ）

| ペルソナ | 役割 | 体験で見せたい価値 |
|---------|------|-------------------|
| 現場スタッフ | 世話人・生活支援員・訪問看護師 | スマホ前提・大ボタン・選択式入力で報告が完結 |
| 内勤・管理者 | 事務・サービス管理責任者 | 全拠点俯瞰、未報告/要対応の自動ハイライト、承認キュー |
| 外部医療者 | 委託医師・委託看護師 | 社内システム非接触、限定ポータルで許可範囲のみ閲覧 |
| 提案先（経営層） | 法人管理者・DX 推進担当 | Before/After の業務時間削減イメージ、RBAC・セキュリティ前提 |

---

## 4. 体験フロー（ユーザーストーリー）

### 4.1 メインフロー（ロール切替デモ）

1. ユーザーが `/experience/kaigo-care-dx?mode=live`（または LP 内アンカー `#demo` から遷移）を開く
2. 画面上部に **3 ロールタブ** が表示される
   - 現場スタッフ
   - 内勤・管理者
   - 医療連携（外部）
3. タブ切替で、表示 UI・操作可能範囲・サンプルデータが切り替わる（LP 内デモと同等の体験）
4. 各ロールに 1 行の説明文（role-note）が表示される

### 4.2 サブフロー（報告書自動生成デモ）

LP とは別セクション、または同一体験内の「中核機能」タブとして提供する。

1. ユーザーが LINE Works 風の自由記述サンプル（または編集可能テキスト）を確認
2. 「構造化する」ボタンで mock 関数を実行
3. 看護・支援記録ドラフト（フィールド形式）が右ペインに表示される
4. 「ドラフトは承認後に確定」の注記を表示

---

## 5. 画面要件

### 5.1 共通

- サイトのデザインシステム（`text-text` / `text-text-sub`、明背景カード）に準拠
- `prefers-reduced-motion` 時はタブ切替アニメーションを省略
- モバイル（375px）〜 デスクトップ（1080px）で崩れないレスポンシブ
- LP の配色（primary: `#175E51`、accent: `#DE8E33`）を体験 UI のアクセントとして部分的に踏襲可

### 5.2 現場スタッフビュー（`view-field`）

| 要素 | 要件 |
|------|------|
| レイアウト | 左: スマホフレーム UI / 右: 説明テキスト（モバイルは縦積み） |
| ヘッダー | 挨拶・担当者名・拠点名（例: 佐藤さん｜さくらホーム） |
| 本日の訪問一覧 | 3 件のモック訪問（時刻・利用者名・対応内容） |
| 主 CTA | 「＋ 今すぐ報告する」ボタン（クリックでトースト or モーダル「デモ: 報告フォームへ」） |
| クイック入力 | バイタル入力 / 服薬チェック / 特記・ヒヤリ / 過去の報告（4 タップボタン） |
| 権限制限 | 他拠点・他利用者のデータは表示しない（説明文で明示） |

### 5.3 内勤・管理者ビュー（`view-office`）

| 要素 | 要件 |
|------|------|
| アプリフレーム | ブラウザ風 chrome（traffic lights + URL バー + ロールバッジ） |
| KPI カード（4 枚） | 本日の報告 18/20、未確認 2、要対応アラート 1、今月自動生成報告書 142 |
| 拠点ステータス一覧 | GH-03 / GH-07 / GH-11 / VN-01 等、ステータスバッジ（報告済 / 未報告 / 要対応） |
| 承認キュー | 2 件の待ちカード。「内容を確認」ボタン（クリックでドラフトプレビュー mock） |
| リアルタイム感 | 初回表示時に KPI 数字をカウントアップアニメ（reduced-motion 時は省略） |

### 5.4 医療連携ビュー（`view-medical`）

| 要素 | 要件 |
|------|------|
| 限定ポータル chrome | URL: `share.axeon-care.jp / 外部連携ポータル` |
| 共有範囲バナー | 利用者・項目単位の制御、監査ログ記録の注記 |
| 共有カレンダー | 週次 AM/PM グリッド、訪問看護・訪問診療・合同カンファの色分け |
| 許可記録一覧 | 指示書（有効/期限）、バイタル推移（閲覧可）、支援計画（非表示） |
| 非表示項目 | 「共有対象外」はグレーアウト + 非表示ラベル |

### 5.5 報告書自動生成（`buildCareRecordDraftMock`）

| 入力 | 出力フィールド |
|------|---------------|
| 自由記述テキスト（LINE Works 風） | 利用者、訪問時刻、バイタル、服薬、状態、特記 |

**抽出ルール（キーワードベース、LLM 不使用）:**

- 血圧パターン `\d{2,3}/\d{2,3}` → バイタル
- 体温 `\d{2}\.\d` → バイタル
- 「薬」「服薬」「飲め」→ 服薬確認済
- 「痛」「訴え」→ 特記（経過観察）
- 「良好」「食欲」→ 状態
- 利用者名はサンプル固定 or 入力内の「〇〇さん/様」を抽出

---

## 6. モックデータモデル

```typescript
/** 拠点 */
type Facility = {
  id: string;           // e.g. "GH-03"
  name: string;         // e.g. "さくらホーム"
  type: "gh" | "vn";    // グループホーム / 訪問看護
};

/** 利用者 */
type Client = {
  id: string;
  name: string;         // 表示名（例: 田中 様）
  facilityId: string;
};

/** 訪問予定（現場ビュー） */
type VisitSchedule = {
  time: string;         // "10:00"
  clientId: string;
  task: string;         // "服薬確認・バイタル"
};

/** 拠点ステータス（管理ビュー） */
type FacilityStatus = {
  facilityId: string;
  staffName: string;
  lastReportAt?: string;
  status: "done" | "wait" | "alert";
  statusLabel: string;
};

/** 承認キュー */
type ApprovalQueueItem = {
  id: string;
  title: string;
  source: string;       // "LINE Works ＞ 自動構造化 ＞ 報告書ドラフト"
  type: "draft" | "alert";
};

/** 共有カレンダーイベント */
type SharedCalendarEvent = {
  day: "mon" | "tue" | "wed" | "thu" | "fri";
  slot: "am" | "pm";
  label: string;
  assignee: string;
  kind: "nurse" | "doc" | "share";
};

/** 報告書ドラフト */
type CareRecordDraft = {
  clientName: string;
  visitTime: string;
  vitals: string;
  medication: string;
  condition: string;
  notes: string;
};
```

初期データは LP（`/lp/kaigo-care-dx.html`）のサンプル文言をそのまま使用する。

---

## 7. 権限設計（RBAC）— 体験デモでの表現

LP 内の権限マトリクスを体験 UI で「見える/触れる/触れない」として表現する。

| 機能 / データ | 現場スタッフ | 自社看護師 | 内勤・管理者 | 外部医療者 | 経営者 |
|--------------|------------|-----------|------------|----------|--------|
| 報告の入力 | ● | ● | ◐ | ◐ | − |
| 担当拠点の閲覧 | ◐ | ◐ | ● | − | ● |
| 全拠点の俯瞰 | − | − | ● | − | ● |
| 報告書の承認・確定 | − | ◐ | ● | − | − |
| 医療連携・予定共有 | − | ● | ● | ◐ | − |
| スタッフ・権限管理 | − | − | ● | − | ◐ |

凡例: ● 全範囲 / ◐ 限定 / − 不可

体験デモでは、ロールタブ切替により**表示される画面そのもの**が権限差を表現する（マトリクス表自体は LP 側で説明、体験側は操作で体感）。

---

## 8. セキュリティ前提（説明用コピー）

体験デモ内に以下をテキストまたは info パネルで表示する（本番実装ではない）。

- 要配慮個人情報（障害・病歴・診療情報）を扱う前提
- RBAC + 拠点データ分離
- 全操作の監査ログ
- 通信・保存の暗号化
- 同意・第三者提供の運用ルール

---

## 9. サイト内配置・実装方針

### 9.1 配置

| 用途 | URL / ファイル |
|------|---------------|
| 提案 LP（静的・そのまま） | `/lp/kaigo-care-dx` → `public/lp/kaigo-care-dx.html` |
| 体験ギャラリーカード | `/experience`（`implementation-showcase.ts` 登録済み） |
| インタラクティブ体験 | `/experience/kaigo-care-dx?mode=live`（新規実装） |
| 文章デモ（任意・将来） | `/demo/kaigo-care-dx`（Sanity `aiDemo` 登録時） |

### 9.2 実装パターン（既存資産との対応）

| 既存パターン | 本デモでの適用 |
|-------------|--------------|
| `ExperiencePrototypeRunner` + slug 分岐 | `KaigoCareDxExperience.tsx` を新規追加 |
| `lib/experience/*-mock.ts` | `kaigo-care-dx-mock.ts` にデータ + 構造化ロジック |
| `prototype-registry.ts` | `slug: "kaigo-care-dx"` を `EXPERIENCE_PROTOTYPES` に登録 |
| `ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS` | 公開時に `"kaigo-care-dx"` を追加 |
| `restaurant-ops-dashboard-demo` | ロール切替 + ダッシュボード UI の参考実装 |

### 9.3 新規ファイル（実装フェーズ）

```
src/components/experience/prototypes/KaigoCareDxExperience.tsx
src/lib/experience/kaigo-care-dx-mock.ts
src/lib/experience/prototype-registry.ts  （追記）
src/lib/content/experience-gallery.ts     （ALLOWED 追記）
```

### 9.4 runMode

- **体験デモ**: ローカル mock（API 不使用）
- **文章デモ（将来）**: `mock_preview`（`/api/demo/run` + Sanity `mockOutputPrimary`）

---

## 10. 受け入れ基準（Acceptance Criteria）

### 必須（MVP）

- [ ] `/experience/kaigo-care-dx?mode=live` で体験 UI が表示される
- [ ] 3 ロールタブの切替で、現場 / 管理 / 医療連携の UI が切り替わる
- [ ] 各ロールに LP と同等のサンプルデータが表示される
- [ ] 報告書自動生成: 入力テキストからドラフトが mock 生成される
- [ ] モバイル幅（375px）で主要 UI が崩れない
- [ ] `npm run build` が通る
- [ ] ESLint エラーなし

### 推奨（v1.1）

- [ ] LP（`/lp/kaigo-care-dx`）の `#demo` セクションから体験ページへリンク
- [ ] 管理ビューの「内容を確認」でドラフトプレビュー modal
- [ ] 現場ビューの「今すぐ報告する」で簡易入力フォーム → 構造化デモへ連携

### 任意

- [ ] `/demo/kaigo-care-dx` 文章デモ（チャット形式）の Sanity 登録
- [ ] LP 末尾 CTA を `/contact` に接続

---

## 11. デモインベントリ登録（要対応）

プロジェクトルール上、新規デモ追加時は `docs/demo-mock-inventory.md` への登録が必要だが、**当該ファイルは現リポジトリに未存在**（2026-06-19 時点）。

実装完了時に以下のメタ情報をインベントリ（または seed スクリプト）へ追記すること。

| 項目 | 値 |
|------|-----|
| slug | `kaigo-care-dx` |
| title | ケア記録DX（障害福祉・訪問看護・訪問診療） |
| industry | 医療・介護 |
| inputType | ロール切替 + 自由記述報告（構造化デモ） |
| runMode | `mock_preview` |
| experienceUrl | `/experience/kaigo-care-dx?mode=live` |
| lpUrl | `/lp/kaigo-care-dx` |
| 重複確認 | `handover-ai-charting`（申し送りAI）とは入力形式・成果物が異なるため新規扱い |

---

## 12. 参考リンク

- 提案 LP 原本: [ideal-tomy/kaigo_demo](https://github.com/ideal-tomy/kaigo_demo)
- サイト内 LP: `/lp/kaigo-care-dx`
- 類似実装: `restaurant-ops-dashboard-demo`（ダッシュボード体験）
- 類似 mock: `inquiry-intake-mock.ts`（キーワード分類 → 構造化出力）

---

## 13. 実装フェーズ分割（推奨）

| フェーズ | 内容 | 工数目安 |
|---------|------|---------|
| Phase 0 | LP 移植 + ギャラリーカード（**完了**） | — |
| Phase 1 | ロール切替 3 ビュー（静的 mock データ表示） | 1〜2 日 |
| Phase 2 | 報告書自動生成 mock + 承認キュー連携 | 0.5〜1 日 |
| Phase 3 | LP ↔ 体験ページ導線、ALLOWED 公開、インベントリ整備 | 0.5 日 |
