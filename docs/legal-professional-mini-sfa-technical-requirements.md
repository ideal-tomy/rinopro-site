# 士業向けミニSFA（相談〜受任の見える化） 技術要件

対象: `/experience/legal-professional-mini-sfa-demo`  
関連: [`docs/legal-professional-mini-sfa-requirements.md`](./legal-professional-mini-sfa-requirements.md)

---

## 1. 技術方針

- 今回は **実際に操作できるプロトタイプ** を目的とするため、サーバーAPIやDBよりも **ブラウザ内で成立する体験の完成度** を優先する。
- 初期実装は **クライアント完結 + 決定論的モックデータ + `localStorage` 永続化** とする。
- 将来の本実装へ移行しやすいよう、**型定義・初期データ・集計ロジック・UIコンポーネント** を分離する。

---

## 2. 実装対象

### 2.1 既存の主な関連ファイル

| 種別 | ファイル |
|------|------|
| 体験本体 | `src/components/experience/prototypes/ProfessionalMiniSfaExperience.tsx` |
| 型 | `src/lib/experience/professional-mini-sfa/types.ts` |
| 集計 | `src/lib/experience/professional-mini-sfa/dashboard-helpers.ts` |
| 初期案件 | `src/lib/experience/professional-mini-sfa/mock-deals.ts` |
| 初期顧客 | `src/lib/experience/professional-mini-sfa/mock-contacts.ts` |
| 概算レンジ文言 | `src/lib/experience/professional-mini-sfa/estimate-anchors.ts` |
| レジストリ | `src/lib/experience/prototype-registry.ts` |

### 2.2 今回追加・再編を推奨するファイル

| 種別 | 推奨ファイル |
|------|------|
| 画面本体 | `src/components/experience/prototypes/ProfessionalMiniSfaExperience.tsx` |
| タブ: ダッシュボード | `src/components/experience/prototypes/professional-mini-sfa/MiniSfaDashboardTab.tsx` |
| タブ: 相談ボード | `src/components/experience/prototypes/professional-mini-sfa/MiniSfaBoardTab.tsx` |
| タブ: 顧客一覧 | `src/components/experience/prototypes/professional-mini-sfa/MiniSfaContactsTab.tsx` |
| 詳細パネル | `src/components/experience/prototypes/professional-mini-sfa/MiniSfaDealDetail.tsx` |
| 新規相談登録 | `src/components/experience/prototypes/professional-mini-sfa/MiniSfaCreateDealDialog.tsx` |
| フック | `src/hooks/use-professional-mini-sfa-demo.ts` |
| 型再編 | `src/lib/experience/professional-mini-sfa/types.ts` |
| 初期データ | `src/lib/experience/professional-mini-sfa/mock-deals.ts` / `mock-contacts.ts` |
| 集計・セレクタ | `src/lib/experience/professional-mini-sfa/selectors.ts` |
| `localStorage` | `src/lib/experience/professional-mini-sfa/storage.ts` |
| 定数 | `src/lib/experience/professional-mini-sfa/constants.ts` |

---

## 3. アーキテクチャ

### 3.1 コンポーネント責務

- `ProfessionalMiniSfaExperience.tsx`
  - タブ切替
  - 全体レイアウト
  - デモ用フックの呼び出し
  - 各タブと詳細/作成ダイアログの接続
- `MiniSfaDashboardTab.tsx`
  - KPIカード
  - 今週フォロー一覧
  - 期限超過一覧
- `MiniSfaBoardTab.tsx`
  - ステージ列
  - 案件カード一覧
  - モバイル用ステージ切替
- `MiniSfaContactsTab.tsx`
  - 表形式の顧客・案件一覧
- `MiniSfaDealDetail.tsx`
  - 案件詳細表示
  - ステージ更新
  - 次アクション編集
- `MiniSfaCreateDealDialog.tsx`
  - 新規相談フォーム
  - バリデーション

### 3.2 ロジックの置き場

- 画面描画に必要な派生値は `selectors.ts` に寄せる。
- `localStorage` 入出力とバージョン管理は `storage.ts` に寄せる。
- 日付比較、集計、絞り込みなどの純粋関数は UI コンポーネントに書かない。

---

## 4. 状態管理

### 4.1 推奨フック

`use-professional-mini-sfa-demo.ts` を作成し、以下の責務を持たせる。

- `deals` の保持
- `selectedDealId` の保持
- `activeTab` の保持
- モバイル専用UI状態の保持
- 新規相談追加
- 案件更新
- ステージ更新
- `localStorage` への保存/読込
- デモリセット

### 4.2 フックが返す想定値

```ts
type UseProfessionalMiniSfaDemoResult = {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  deals: DealCard[];
  contacts: ContactRow[];
  selectedDeal: DealCard | null;
  selectedDealId: string | null;
  setSelectedDealId: (id: string) => void;
  createDeal: (input: CreateDealInput) => void;
  updateDeal: (id: string, patch: Partial<DealCard>) => void;
  moveDealStage: (id: string, stage: DealStageId) => void;
  resetDemo: () => void;
  stats: MiniSfaDashboardStats;
};
```

---

## 5. 型要件

### 5.1 `DealStageId`

```ts
type DealStageId =
  | "intake"
  | "first_meeting"
  | "conflict_check"
  | "proposal"
  | "retainer_likely"
  | "retained"
  | "closed_lost";
```

### 5.2 `DealCard`

```ts
interface DealCard {
  id: string;
  title: string;
  clientName: string;
  contactName: string;
  inquiryChannel: string;
  referrer: string;
  practiceArea: string;
  assignee: string;
  stage: DealStageId;
  nextAction: string;
  nextActionDate: string;
  lastContactAt: string;
  estimatedValueLabel?: string;
  conflictCheckStatus?: "未着手" | "確認中" | "問題なし";
  summary: string;
  note?: string;
}
```

### 5.3 `ContactRow`

`ContactRow` は `DealCard` のサマリビューとして扱い、別データにせず `deals` から派生生成してもよい。  
既存の `mock-contacts.ts` を残す場合でも、**情報の二重管理は避ける**。

推奨:

- 正本は `deals`
- 顧客一覧は `deals` から `map` で派生

---

## 6. データ戦略

### 6.1 初期データ

- `mock-deals.ts` に 6〜8 件の初期案件を持つ。
- 類型は以下を最低限含める。
  - 企業法務
  - 労務相談
  - 相続
  - 顧問契約
  - 許認可
- 状態分布は以下を含める。
  - 今週フォロー対象
  - 期限超過
  - 受任見込
  - 受任済み
  - 見送り

### 6.2 永続化

- `localStorage` キーは `professional-mini-sfa-demo:v1` とする。
- 保存対象は `deals` のみでよい。
- 初回表示時:
  - `localStorage` に有効データがあればそれを使う
  - なければ `mock-deals.ts` を初期値にする
- 将来の構造変更に備え、バージョン付き保存形式を使う。

例:

```ts
type MiniSfaStoragePayload = {
  version: 1;
  deals: DealCard[];
};
```

### 6.3 リセット

- デモ画面に「初期状態に戻す」を配置してよい。
- リセット時は `localStorage` を破棄し、初期モックデータへ戻す。

---

## 7. 集計・セレクタ要件

`selectors.ts` に以下の純粋関数を用意する。

- `getActiveDeals(deals)`
- `getDealsDueThisWeek(deals, today)`
- `getOverdueDeals(deals, today)`
- `getRetainerLikelyDeals(deals)`
- `getRetainedDeals(deals)`
- `getStageCounts(deals)`
- `buildContactRows(deals)`

### 7.1 日付判定ルール

- 日付文字列は `YYYY-MM-DD` を前提にする。
- 日付比較は locale 依存を避け、文字列比較または `Date` 正規化関数を用いる。
- デモ用基準日は定数 `DEMO_TODAY` に保持する。

---

## 8. UI実装方針

### 8.1 既存UIの活用

- `Button` などの既存 UI コンポーネントを流用する。
- 既存のタブ切替構造は維持してよいが、1ファイル肥大化は避ける。
- モバイル向けの折りたたみ/詳細表示は現行パターンを活かす。

### 8.2 追加UI

- 新規相談登録: `Dialog` もしくは既存構成で違和感がなければ `Sheet`
- 詳細表示: デスクトップは固定パネル、モバイルは開閉式詳細パネル
- 成功通知: 軽量なトーストまたは一時メッセージ

### 8.3 アニメーション

- 派手にしない
- 主要操作は 150〜250ms のフェード/色変化で十分
- `prefers-reduced-motion` では即時切替

---

## 9. バリデーション要件

### 9.1 新規相談登録

- 必須項目未入力では保存不可
- `nextActionDate` は `YYYY-MM-DD` 形式を前提とする
- `title` / `clientName` / `contactName` / `practiceArea` / `assignee` / `nextAction` / `nextActionDate` / `summary` を必須にする

### 9.2 編集

- ステージ変更は定義済み `DealStageId` のみ許可
- 次アクション日が空の場合は保存不可

---

## 10. 概算レンジ説明セクションの技術要件

- 文言管理は `estimate-anchors.ts` に寄せる。
- 現在の static text 構成は維持してよいが、今回のMVPに合わせて項目名を更新する。
- 少なくとも以下を見直す。
  - MVP一文
  - 含む項目
  - オプション例
  - 免責文

---

## 11. 実装タスク分解

### Task 1: 型と定数の再設計

- `DealStageId` を再定義
- `DealCard` を拡張
- ステージラベルと並び順を更新

### Task 2: 集計ロジックの分離

- 既存 `dashboard-helpers.ts` を `selectors.ts` へ整理または改名
- 新集計ルールに合わせて関数を更新

### Task 3: デモフック追加

- `use-professional-mini-sfa-demo.ts` を追加
- `localStorage` 読み書きを実装

### Task 4: UI分割

- 既存 `ProfessionalMiniSfaExperience.tsx` を分割
- ダッシュボード/ボード/一覧/詳細を別コンポーネントに切り出す

### Task 5: 新規相談登録

- フォームUI追加
- 保存時に `deals` を更新
- ダッシュボードへ反映

### Task 6: 詳細編集

- 次アクション編集
- ステージ更新
- 反映確認

### Task 7: 文言・概算説明更新

- `estimate-anchors.ts` を最新スコープに合わせる
- 免責と表現トーンを整える

---

## 12. テスト方針

### 12.1 追加推奨テスト

- `selectors.ts`
  - 期限超過抽出
  - 今週フォロー抽出
  - ステージ件数集計
- `storage.ts`
  - 読み込み失敗時の初期値フォールバック
  - バージョン違いの扱い

### 12.2 手動確認項目

1. 新規相談追加でボードと一覧に表示される
2. ステージ変更でダッシュボード件数が変わる
3. 期限超過案件を変更すると一覧から消える/残るが正しい
4. モバイルで詳細開閉ができる
5. リロード後も状態が保持される

---

## 13. 実装時の注意

- `text-base` は使わず、本文サイズは `text-[16px]` 相当を使う。
- 暗背景上では `text-white` / `text-white/90` / `text-text` を優先する。
- 相談管理の語彙を使い、営業SFAの匂いを強く出さない。
- 実在案件を想起させる名称・個人情報は使わない。

---

## 14. Cursor向け実装依頼テンプレ

以下をそのままPLAN依頼の材料に使える。

1. `ProfessionalMiniSfaExperience` を分割し、`dashboard` / `board` / `contacts` / `detail` / `create dialog` に責務を分ける。
2. `DealStageId` を7段階へ更新し、案件型を `clientName` `contactName` `practiceArea` `assignee` `summary` などを持つ形へ拡張する。
3. 純粋関数の集計ロジックを `selectors.ts` に寄せる。
4. `use-professional-mini-sfa-demo.ts` と `storage.ts` を追加し、`localStorage` でブラウザ内状態を保持する。
5. 新規相談追加、ステージ更新、次アクション編集が即時反映されるようにする。
6. 下部の概算レンジ説明も今回のMVPスコープに合わせて更新する。

---

## 15. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-04-12 | 初版作成 |
