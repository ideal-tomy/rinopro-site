# 問い合わせ導線シンプル化リファクタ PLAN（v3 提案）

作成日: 2026-05-14
状態: **提案（未承認）**
前提資料: `docs/redesign-v2-strategy.md`, `docs/site-audit-2026.md`, `docs/concierge-chat-scopes.md`, `CLAUDE.md`

> このドキュメントは **提案のみ** です。実装は、PLAN を読んだうえで「進めて」と承認いただいてから着手します。

---

## 0. なぜいま、この PLAN を書くか

現状の問い合わせまわりは、**「自動見積もり」「自動要件定義」「整理してから送信」**の三役を一つの導線に詰め込みすぎていて、結果として次のような状態になっています。

- 送信ボタンが押せない（`evaluateInquiryGate` を通さないと押せない）
- 「次へ」「送信」のコントラストが弱く、どこを押せばよいかが分からない
- チャット → 問い合わせの引き継ぎが構造化スナップショット前提なので、軽い相談者は事実上たどり着けない
- 「整理ブロック → AI 整形 → 要点更新 → 追加質問」と段が多く、本気の人も疲れる

短期的に色や文言を直しても、**入口を絞りすぎている構造そのもの**は改善できません。
そこで、**問い合わせは「通常の問い合わせフォーム」に格下げ**し、深い整理機能（見積もり・要件整理）は **「任意の補助」** に明確に位置を下げる方向で、サイト全体のリファクタを行います。

これは `redesign-v2-strategy.md` 13 章「機能として残すが控えめに」と 14 章「/estimate-detailed 系は必要性を再判断」の方針の続編にあたります。

---

## 1. 目的（このリファクタで達成したいこと）

1. **「相談したい」と思った人が、迷わず 1 分で問い合わせ送信できる**状態にする。
2. **冷やかしを排除しようとして本気の人まで落とす設計**をやめる。
3. **チャットからでも、すぐに問い合わせ送信に到達できる**ようにする（チャット内容は単に本文に注入するだけ）。
4. **詳細見積・要件整理は「希望者だけの任意導線」**として残し、メイン導線からは外す。
5. **コンシェルジュ CTA・問い合わせフォームの視認性**を、コンポーネント単位で確実に直せる構造にする。

---

## 2. やらないこと（スコープ外）

- 詳細見積（`/estimate-detailed`）一式の **完全削除はしない**（任意の補助として温存）。
- AI コンシェルジュ機能の **削除はしない**（テキスト本文への注入役にスリム化）。
- `redesign-v2-strategy.md` の LP 型構成・ライトモード方針の **変更はしない**。
- 既存の `/experience`, `/services`, `/about`, `/solutions/[slug]` の **構造は維持**（リンク先のみ整理）。

---

## 3. 大方針（一文で）

> **問い合わせは「名前・メール・本文・任意の体験デモ選択」だけで送信できる、ごく普通のフォームに格下げする。深い整理機能はメイン導線から外し、希望者だけの任意ルートに移す。**

---

## 4. リファクタの全体像

### 4-1. 問い合わせフォームの構造（Before / After）

**Before（現状）**

```
/contact
  ├─ 見出し
  ├─ 「詳細見積もりへ」ショートカット CTA  ← まずここで分岐させる
  ├─ ContactFlowSteps（相談の流れ説明）
  ├─ ContactForm
  │    ├─ ContactIntakeHearingBlock（事前ヒアリング必須）
  │    │     └─ 完了 → fetchInquiryBriefWithRetry（AI 整形）
  │    ├─ 送信内容の確認（AI 整形結果）
  │    ├─ 追加質問への回答（必須あり）
  │    ├─ 「この回答で要点を更新する」ボタン
  │    ├─ 連絡先（name, email, triedExperience）
  │    ├─ 補足（任意）
  │    └─ 送信ボタン（evaluateInquiryGate が通れば押せる）
  └─ 保証事項
```

**After（提案）**

```
/contact
  ├─ 見出し（軽いコピー）
  ├─ ContactForm（シンプル版）
  │    ├─ お名前（必須）
  │    ├─ メールアドレス（必須）
  │    ├─ ご相談内容（必須・自由記述）
  │    ├─ 会社名（任意）
  │    ├─ 体験デモを試した方は教えてください（任意・セレクト）
  │    ├─ 同意チェック（任意・あるなら）
  │    └─ 送信ボタン（必須が埋まっていれば常時押せる）
  ├─ 「もう少し整理してから送りたい方はこちら」
  │   └─ /estimate-detailed（任意ルート・控えめなテキストリンク）
  └─ 保証事項（短く）
```

ポイントは、**送信前に AI 処理を挟まない**ことと、**整理機能はテキストリンクで存在を示すだけ**にすることです。

### 4-2. チャットから問い合わせへのハンドオフ

**Before（現状）**

- `decodeChatHandoff`／`consumeHandoffPayloadFromSession` で **構造化スナップショット**（`EstimateSnapshot`, `inquiryBrief`, `followUpQuestions` ...）を受け渡す。
- 受け取った `ContactForm` 側はそれを元に問題サマリ・対象業務・タイムラインなどを **複数の state に展開**して、ゲートを満たすかどうかを判定する。

**After（提案）**

- ハンドオフは **「相談内容を表すテキスト 1 本」+「任意の引き継ぎ識別子」** に縮める。
- `ContactForm` は受け取ったテキストを **「ご相談内容」のテキストエリアに初期値として入れる**だけ。
- 構造化スナップショットを送りたい場合は、**問い合わせ送信後にバックエンド側で復元**するか、もしくは旧来通り **`/estimate-detailed` を経由した人のみ**フォームに添付（任意チェックボックス）。

### 4-3. 詳細見積（任意ルート）の扱い

- `/estimate-detailed`, `/estimate-detailed/processing`, `/estimate-detailed/amount`, `/estimate-detailed/result` は **当面そのまま残す**。
- ただし **ヘッダー・フッター・トップページからの主要動線からは外す**（既に外れていれば現状維持）。
- 終端の「問い合わせに進む」CTA は、**`/contact?handoff=...` ではなく、相談内容をテキストとして prefill した状態で `/contact` に飛ぶ**だけにする。

### 4-4. AI コンシェルジュ CTA の視認性

- `ConciergeCtaButton` の primary が `text-white` × `bg-action/25` で **明るい背景で読みにくい問題** がある（`src/components/chat/ConciergeChoiceButton.tsx`）。
- **コンポーネント単位で、サイト本体の `Button` の default（solid）相当**に寄せる方針。
- これは「テキストの色やボタンの色は改善されない」と感じさせていた直接の原因なので、**格下げと同時に必ず手当する**。

---

## 5. 変更の対象と分類

### 5-1. シンプル化（中身を大幅に減らす）

| ファイル | 変更概要 | リスク |
|---|---|---|
| `src/components/contact/ContactForm.tsx` | 4 段ヒアリング・AI 整形・ゲート・追加質問 UI を撤去。`name`/`email`/`message`/任意の `company`/`triedExperience` だけのフォームにする | 中（一番大きな変更） |
| `src/components/contact/ContactPageContent.tsx` | 詳細見積ショートカットを **下部の小さなテキストリンク**に格下げ。`ContactFlowSteps` は撤去または最小化 | 低 |
| `src/lib/validation/contact-schema.ts` | 必須を `name`, `email`, `message` に縮約。残りは optional | 中（API も合わせる） |
| `src/app/api/contact/route.ts` | 縮約スキーマに合わせて入力受領を簡素化。`inquiryBrief`／`estimateSnapshot` は **任意** | 中 |
| `src/lib/contact/mail-templates.ts` | シンプル版テンプレに変更。estimateSnapshot がない前提でも完結する書式に | 低 |

### 5-2. 任意ルートとして温存（呼び口を弱める）

| 対象 | 扱い |
|---|---|
| `/estimate-detailed/*` ページ群 | 当面残す。ただしナビ・トップ・主要 CTA からは参照しない |
| `EstimateDetailed*` コンポーネント | 残す。ただし `ContactForm` への構造化ハンドオフは廃止 |
| `src/lib/inquiry/inquiry-brief.ts`（`evaluateInquiryGate` 等） | 残すが **`ContactForm` からは使わない**。`/estimate-detailed` 内部だけで使う |
| `src/lib/contact/contact-intake-*`, `parse-estimate-answers-to-form-draft`, `build-contact-synthetic-snapshot` | 当面残す（削除は後続スプリント） |

### 5-3. ハンドオフの仕様変更

| 対象 | 変更概要 |
|---|---|
| `src/lib/chat/estimate-handoff.ts` | 「テキスト 1 本」を運ぶ最小版に縮約。v1/v2 ペイロードは **テキスト化してから渡す**ヘルパに集約 |
| `ChatContainer.tsx` / `ConciergeChoiceButton.tsx` の primary CTA | サイト共通の solid Button に寄せて視認性確保 |

### 5-4. ドキュメント更新

| 対象 | 変更概要 |
|---|---|
| `docs/redesign-v2-strategy.md` | 14 章「下層ページの方針」に「`/contact` はシンプル版で運用」を追記 |
| `docs/concierge-chat-scopes.md` | チャット→問い合わせの境界が「テキスト注入」になることを明記 |
| `docs/demo-mock-inventory.md` | demo 関連の影響なし（参照のみ） |

### 5-5. **削除候補は本 PLAN ではゼロ**

PLAN の趣旨は「**まず壊さずに格下げ**」です。
削除や `/estimate-detailed` 自体の廃止は、シンプル化が運用で問題なく回ることを確認したあと、**後続スプリント**で別 PLAN を立てて判断します。

---

## 6. Phase 分解（推奨順）

各 Phase は独立コミットで進められる粒度にしています。**ファイル数 3 つ以上**になる Phase は、事前に承認を求めて分割実行します（CLAUDE.md 黄ルール）。

### Phase C-0: 棚卸し・凍結（30 分）

- 未コミットの 11 ファイルを **「色合わせ」コミット**としていったん main に固める。
- 作業ブランチ `refactor/contact-simplification` を作成。
- 影響範囲メモを残す。

**触るファイル**: なし（git 操作のみ）
**リスク**: 低
**ロールバック**: 不要

### Phase C-1: フォームと検証スキーマのシンプル化（90 分）

- `contactSchema` を `name` / `email` / `message`（旧 `problemStatement`）/ 任意項目に縮約。
- `ContactForm` を **AI 整形ブロックなし版**に作り変える（旧版は別ファイルに退避して残す）。
- `ContactPageContent` から `ContactFlowSteps` 呼び出しと「詳細見積へ」ショートカットを撤去または下部に移動。
- `/api/contact/route.ts` を縮約スキーマに合わせる（旧フィールドは optional で当面受領）。

**触るファイル**:

- `src/lib/validation/contact-schema.ts`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactPageContent.tsx`
- `src/app/api/contact/route.ts`

**触らないファイル**:

- `/estimate-detailed/*` 配下すべて
- `src/lib/inquiry/*`, `src/lib/estimate-core/*`

**リスク**: 中（送信フォームを置き換えるため、メール本文の見え方が変わる）
**ロールバック**: `git revert` 1 コマンドで戻る粒度に保つ。

### Phase C-2: メールテンプレと管理側の表記整理（45 分）

- `buildAdminContactEmail` / `buildCustomerContactEmail` を **シンプル版相談内容前提**に書き換える。
- 旧フィールド（`inquiryBrief`, `estimateSnapshot`, `targetSummary` ほか）は **存在すれば併記する** 後方互換動作にする。

**触るファイル**:

- `src/lib/contact/mail-templates.ts

**リスク**: 低
**ロールバック**: 同上。

### Phase C-3: チャット→問い合わせのハンドオフをテキスト化（60 分）

- `src/lib/chat/estimate-handoff.ts` に **「テキスト 1 本に変換するヘルパ」** を追加。
- チャット側の「問い合わせに進む」CTA は、**テキスト化結果を `?prefill=...`（または sessionStorage）で渡す**経路に切り替える。
- `ContactForm` 側は受け取ったテキストを `message` の初期値に挿入するだけ。

**触るファイル**:

- `src/lib/chat/estimate-handoff.ts`
- `src/components/chat/ChatContainer.tsx`（CTA リンクの組み立て部）
- `src/components/contact/ContactForm.tsx`（prefill 受領処理）

**リスク**: 中（複数ファイル）
**ロールバック**: 旧 `decodeChatHandoff` は **削除せず残す**。CTA 側の差し替えだけなので元に戻せる。

### Phase C-4: コンシェルジュ CTA の視認性手当（45 分）

- `ConciergeCtaButton` primary を **共通 `Button` の solid と同等のコントラスト**に揃える。
- `bg-action/25` × `text-white` の運用をやめ、トークンベースで管理する。
- 影響は **チャット内 CTA のみ**。サイト本体の `Button` には触らない。

**触るファイル**:

- `src/components/chat/ConciergeChoiceButton.tsx`

**リスク**: 低
**ロールバック**: 1 ファイル単位で戻せる。

### Phase C-5: 任意ルート（`/estimate-detailed`）の終端 CTA をテキスト化に追従（30 分）

- `EstimateDetailedAmountContent.tsx` 等の終端「問い合わせに進む」を、**テキスト化ハンドオフ経路**に揃える。
- 旧フィールド注入は廃止。残るのは「相談内容に AI 要約を貼った状態でフォームを開く」だけ。

**触るファイル**:

- `src/components/estimate/EstimateDetailedAmountContent.tsx`
- `src/components/estimate/EstimateDetailedResultContent.tsx`（必要に応じて）

**リスク**: 低
**ロールバック**: CTA リンクの差し戻しで完結。

### Phase C-6: ドキュメント反映・最終確認（30 分）

- `docs/redesign-v2-strategy.md` に「Contact シンプル化（v3）」の追記。
- `docs/concierge-chat-scopes.md` の境界記述を更新。
- 404/リンク監査チェックリストを実施（v2 ドキュメント 19 章のフローに沿う）。

**触るファイル**: docs のみ

---

## 7. 影響範囲とリスク評価

| 観点 | 影響 | 対策 |
|---|---|---|
| ビルドが壊れる可能性 | 中（型変更が複数ファイルにまたがるため） | Phase 単位でビルドを通す。`tsc --noEmit` と `npm run build` を Phase 末に必ず実行 |
| 既存機能への影響 | 中（フォームの中身が大きく変わる） | 旧 `ContactForm` は **別ファイルに退避**して残す。問題があればすぐ戻す |
| メール文面の変化 | 中（管理側の運用に影響） | テンプレを後方互換にしてから差し替え |
| SEO/メタへの影響 | 低 | URL は維持。メタ description のみ調整 |
| アクセシビリティ | プラス方向（送信ボタンが常時押せる、コントラスト改善） | 各 Phase で `prefers-reduced-motion` と最小フォントサイズを再確認 |
| パフォーマンス（LCP/INP） | プラス方向（AI フェッチが減るため） | Phase C-1 後に Lighthouse 比較 |

---

## 8. 切り戻し（ロールバック）方針

- **各 Phase = 1 コミット** を厳守する。
- 旧 `ContactForm` は `ContactForm.legacy.tsx` のように **別名で温存**してから差し替える（CLAUDE.md の「削除は要確認」ルール準拠）。
- 万一問題が出た場合は `git revert <該当コミット>` で 1 Phase 単位で戻す。
- main への push は、PLAN 承認後でも **必ずユーザーが手動で実施**（CLAUDE.md 必須事項）。

---

## 9. 完了の定義

### Phase C-1 完了条件

- [ ] `/contact` で **AI 処理を挟まず**送信できる
- [ ] `name`, `email`, `message` だけ埋めれば送信ボタンが押せる
- [ ] PC・モバイル両方で破綻なし
- [ ] `npm run build` が通る

### Phase C-2 完了条件

- [ ] 管理者宛メールが、シンプル版相談内容で過不足なく届く
- [ ] 旧フィールドが残っている場合でも壊れない

### Phase C-3 完了条件

- [ ] チャットから「問い合わせに進む」を押すと、相談内容が `message` に入った状態で `/contact` が開く
- [ ] 構造化スナップショットを使わない経路で送信成功する

### Phase C-4 完了条件

- [ ] コンシェルジュの主要 CTA が、明るい背景でもコントラスト AA を満たす
- [ ] フォーカスリングと hover の挙動が他の `Button` と一貫している

### Phase C-5 完了条件

- [ ] `/estimate-detailed` から `/contact` に飛んでも、フォームがシンプル版で開く
- [ ] 任意で「整理結果を添付」できる場合は、明示チェックボックスで制御できている

### 最終完了条件

- [ ] 主要導線（`/`, `/services`, `/about`, `/contact`, `/experience`）で 404 なし
- [ ] `/estimate-detailed` は任意ルートとして到達できるが、メイン導線からは見えにくい
- [ ] 代表（あなた）が PC・モバイルで 1 周触って違和感がない
- [ ] `docs/redesign-v2-strategy.md` の関連記述が最新化されている

---

## 10. 補足: 今回 PLAN に含めない判断について

以下は **意図的に PLAN 外**にしています。判断が必要な段階で別 PLAN を立てます。

- **`/estimate-detailed/*` の完全削除**: シンプル化後 1〜2 週間の運用を見て判断。
- **コンシェルジュ FAB のさらなる縮小**: `redesign-v2-strategy.md` Phase G-6 と重複するため、そちらの追補で扱う。
- **会社情報・特商法・プライバシーポリシー等の整備**: 問い合わせフォームのシンプル化と独立。必要であれば別途。
- **問い合わせ後のスレッド管理／CRM 連携**: Resend/SendGrid の導入も含めて、本 PLAN 外。

---

## 11. 次のアクション

この PLAN について、以下のいずれかで返答ください。

- **A. このまま進めて** ── Phase C-0 から順に着手します。
- **B. Phase C-1 だけ先にやって、運用しながら判断したい** ── 最小差分から始めます。
- **C. 内容を修正してから進めたい** ── 修正したい箇所を指摘ください。
- **D. いったん保留** ── PLAN だけ残し、実装はしません。

私からの推奨は **B（Phase C-1 だけ先にやる）** です。
理由は、ContactForm のシンプル化だけで「送信できない」「読めない」の主因はほぼ消えるためです。残りの Phase は、運用で問題がなければ後追いで進められます。
