# 体験5本：インタラクティブ化ロードマップ（作業メモ）

既存の画面体験は [`experience-prototypes-spec.md`](experience-prototypes-spec.md) と実装 [`src/components/experience/ExperiencePrototypeRunner.tsx`](../src/components/experience/ExperiencePrototypeRunner.tsx)（＋ [`src/lib/experience/prototype-registry.ts`](../src/lib/experience/prototype-registry.ts)、社内ナレッジBOTは [`src/lib/experience/internal-knowledge/`](../src/lib/experience/internal-knowledge/)）を前提とする。

現状は「実行（モック結果）」で固定テンプレが出る段階。**本ドキュメントは、1本ずつインタラクションを足していく順序と、都度の進め方（PLAN → 実行 → 調整）を固定するためのメモ**。

---

## 都度の進め方（繰り返し）

各バッチ（下記 Phase 1〜5）ごとに、次を **1サイクル** とする。

1. **PLAN 作成**  
   - 対象 slug・スコープ（今回やる / やらない）・受け入れ条件・触るファイルを短く書く。  
   - （Cursor 等なら）その PLAN を添えてエージェントに依頼。
2. **エージェント実行**  
   - 実装・分離コンポーネント化はエージェントに任せ、**1 Phase = 1 ブランチ or 1 PR 相当**が扱いやすい。
3. **調整**  
   - 実機で `/experience/[slug]` を確認。`prefers-reduced-motion`・キーボード操作・モバイル幅を必要なら確認。
4. **完了**  
   - 下のチェックリストを更新。次の Phase の PLAN に進む。

**原則**: その Phase では **1 slug に集中**（横展開は「共通部品が固まった後」に限定）。

---

## 推奨順序（体感の伸びと依存の少なさ）

画像が主役の体験から手を付けると「ボタン1発モック」との差が出やすい。あわせて③のクレームは編集・承認の型が独立している。

| 順 | Phase ID | slug | 狙い（このイテレーションで目指す体験） |
|---:|----------|------|----------------------------------------|
| 1 | `xp-int-01` | `property-exterior-photo-memo` | 中央ドロップゾーン・プレビュー主役化。任意でピン＋タグ → 出力と対応付け。 |
| 2 | `xp-int-02` | `service-claim-reply-assist` | 3案の横並び比較、インライン編集、承認ステップのクリック進行。スライダー等は任意。 |
| 3 | `xp-int-03` | `receipt-photo-expense-memo` | 画像と抽出フィールドの対応（ハイライト or クリック連動）。チェックリスト連動。 |
| 4 | `xp-int-04` | `driver-voice-incident-draft` | 波形 or タイムラインの見せ、レーン振り分け（ドラッグ）で報告書ブロックが埋まる。 |
| 5 | `xp-int-05` | `legal-memory-secretary` | タグ絞り込み、ヒット行クリックでスニペット展開、「根拠」ハイライトの連動。 |

**後続（任意・別 PLAN）**: 各 slug ごとに **実AI接続**（Vision / RAG / STT 等）は、上記インタラクションが固まってから切ると差分が伝わりやすい。

---

## Phase ごとのメモ欄（コピー用テンプレ）

### xp-int-01 — `property-exterior-photo-memo`

- **やること（例）**: ドラッグ＆ドロップ、画像プレビュー、ピン＋ラベル（出力箇条書きと対応）。
- **やらない（例）**: 実 Vision API、複数枚の本格管理（必要なら次イテレーション）。
- **主な変更候補**: `ExperiencePrototypeRunner.tsx` 分離、`components/experience/prototypes/` 新規 など。
- **受け入れ条件（例）**: 画像なしでは「分析」導線が分かる警告 or プレースホルダ。画像ありでタグ／メモがピンと一貫。

**進捗**: [x] PLAN 確定 [x] 実装 [x] 調整 [x] 完了

---

### xp-int-02 — `service-claim-reply-assist`

- **やること（例）**: 3案カード並び、選択、本文のインライン編集、承認フローのステップ操作。
- **やらない（例）**: 実 LLM による文面生成（`/demo` 側で別途）。
- **受け入れ条件（例）**: 編集内容が「承認対象」表示に反映。別タブで開く導線は維持。

**進捗**: [ ] PLAN 確定 [ ] 実装 [ ] 調整 [ ] 完了

---

### xp-int-03 — `receipt-photo-expense-memo`

- **やること（例）**: フィールドクリックで画像上の擬似ハイライト（固定座標でも可）、チェックとメッセージ連動。
- **やらない（例）**: 本番 OCR。
- **受け入れ条件（例）**: 画像未設定時と設定時で UI が破綻しない。

**進捗**: [ ] PLAN 確定 [ ] 実装 [ ] 調整 [ ] 完了

---

### xp-int-04 — `driver-voice-incident-draft`

- **やること（例）**: サンプル波形 or タイムライン UI、センテンスのレーン DnD で左ペインの見出しが埋まる。
- **やらない（例）**: 実マイク・実 STT（テキスト貼り付けはフォールバックで可）。
- **受け入れ条件（例）**: レーンが空のときと埋まったときで荷主メモが一貫して更新される（モックで可）。

**進捗**: [ ] PLAN 確定 [ ] 実装 [ ] 調整 [ ] 完了

---

### xp-int-05 — `legal-memory-secretary`

- **やること（例）**: メタデータタグで「検索対象」表示、ヒットカード展開、要約と引用の視覚的対応。
- **やらない（例）**: 実ベクトル検索。
- **受け入れ条件（例）**: タグ変更で UI 上の「対象」が変わる（ダミーでもよい）。

**進捗**: [ ] PLAN 確定 [ ] 実装 [ ] 調整 [ ] 完了

---

## 関連ドキュメント

- 体験の前提仕様: [experience-prototypes-spec.md](experience-prototypes-spec.md)
- 新規デモ（文章側）手順: [新規デモ追加手順.md](新規デモ追加手順.md)
- 品質ゲート: [demo-mock-quality-gate.md](demo-mock-quality-gate.md)

---

## 変更履歴（手書きメモ用）

| 日付 | Phase | メモ |
|------|-------|------|
| 2026-03-22 | xp-int-01 | DnD・プレビュー・ピン・モック分析を `PropertyExteriorPhotoExperience` に実装 |
