# ご相談例カード：改行ルールと「右側の余白」調査レポート

**対象**: `/services/consulting` の「例えば、こんなご相談から。」（899px 以下を主に）  
**作成日**: 2026-10-16  
**関連**: `consulting-typography-mobile-analysis.md`、`ConsultingInteractions.tsx`、`consulting-page.module.css`

---

## 1. ユーザーが見ている現象（要約）

- ラベル「ご相談」「何を検討するか」の下に、**短い行が縦に並んだ太字**が続き、**同じ行間で羅列**に見える。
- カードや列の**右側に、文字がないのに空いた帯**があり、ダサく見える。
- 左右で「問題」と「検討」が比較されているつもりが、**行数・行長が揃わず**、レイアウトが崩れた印象になる。

これは **コピーの誤りではなく、マークアップ＋CSS レイアウトの組み合わせ**でほぼ説明できる。

---

## 2. 改行が決まるルール（3層が重なる）

### 2.1 データ層（React）— 意図した改行

`ConsultingInteractions.tsx` では `problem` / `focus` を **文字列の配列**で持ち、各要素を `<span>` で出力する。

```tsx
problem: ["同じ情報を、", "何度も入力している。"],
focus: ["入力を減らすには、", "どこを変えるべきか。"],
```

- 配列の **1要素 = 1つの `<span>`**。
- `problem` のみ `|` を `<wbr />` に変換（例: `どの業務に使えばよいか|わからない。`）。

**意図**: 読点や意味の切れ目で改行したい（プロジェクトの日本語折り返しルールに沿う）。

### 2.2 スタイル層 — 強制ブロック改行

`consulting-page.module.css`:

```css
.exampleProblem span {
  display: block;
}
```

899px 以下ではさらに:

```css
.exampleFocus span {
  display: block;
}
```

**効果**: 配列の各要素は **必ず別行**になる。  
「同じ情報を、」と「何度も入力している。」は **CSS 幅に関係なく 2 行**。

### 2.3 ブラウザ折り返し層 — 狭い列での自動改行

```css
.exampleProblem span,
.exampleFocus span {
  word-break: keep-all;
  overflow-wrap: anywhere;
}
```

| 指定 | 挙動 |
|------|------|
| `word-break: keep-all` | 日本語は単語の途中で切りたくない → 列が狭いと **1〜3 文字の行**が出やすい |
| `overflow-wrap: anywhere` | 必要なら **どこでも**改行可 → keep-all と組み合わさり、折り返し位置が **読みにくく不規則**になりうる |

**結果**: データの `display: block` 改行 **＋** 列幅による自動改行が **二重に**乗る。

### 2.4 行間が「羅列」に見える理由

- カード内の太字（問題・検討）は SP で `line-height: 1.45` 前後（本文は `--line-height-body` 1.5 など）。
- ラベル（12px）と太字の間は `margin-top: 4px` と **極端に詰まっている**。
- 左右 **2 列とも同じ構造**（小ラベル → 太字の短い行の積み上げ）なので、**視覚的な階層が「見出し＋本文」ではなく「ラベルと文言のリスト」**に見える。

---

## 3. 「右側の意味不明な余白」の原因

### 3.1 主因：3 列グリッドで列幅を半分に割っている

899px 以下の `.exampleTop`:

```css
.exampleTop {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
  column-gap: 6px;
  align-items: center;
}
```

- カード内幅を **左テキスト列 | 矢印 | 右テキスト列** に分割。
- `1fr` と `1fr` は **常に同じ幅**（約 50% − 矢印 − gap）。

**右列のテキストが短い行で終わる場合**、行の右端から列の右端まで **空白が残る**。  
これは margin のバグではなく、**グリッド列が固定比率**であることによる **未使用のセル領域**。

左列も同様だが、左は **アイコン列が追加**されるためさらに狭い（次項）。

### 3.2 左列だけさらに狭い：アイコン用の第 2 グリッド

```css
.exampleProblemCol {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  column-gap: 8px;
}
```

左の `1fr`（exampleTop 全体の半分）の中で、さら **34px + 8px** をアイコンに使う。

**概算（幅 375px、container 約 88% 幅、カード padding 28px）**

| 段階 | おおよその幅 |
|------|----------------|
| カード内側 | ~300px |
| 左 exampleTop 列 | ~135px |
| そのうちテキスト列 | **~93px** |

93px で 15〜17px 太字 + `keep-all` → **「同じ情報を」「何度も入力している。」が細切れ**。

右列はアイコンがないので **~135px** だが、同じ `display: block` + 短いフレーズでも **行末に余白**が残る。

### 3.3 `align-items: center` の副作用

`.exampleTop` は `align-items: center`。

- 左右の **行数が違う**とき、ブロック全体が **縦方向中央揃え**になる。
- ラベル「ご相談」と「何を検訇するか」の **上端が揃わない**ことがあり、さらに **バラけた・余白が目立つ**印象になる。

### 3.4 右余白に見えるが「余白」ではないもの

- **右列全体が 1fr で確保されている**のに、テキストは左寄せ（`text-align` 既定）→ 右半分に **無地の帯**。
- モックの「横並び比較」は **1 行あたりの文字数が少ないデザイン用コピー**前提に見える。実コピー＋50/50 分割では **物理的に右側が空く**。

---

## 4. 構造図（SP・1 カード上段）

```
┌─────────────────────────────────────────────┐
│ ┌─左 1fr────────────┐ │ ┌─右 1fr──────────┐ │
│ │[icon][ご相談       ]│→│ [何を検討するか   ]│ │
│ │      [同じ情報を、  ]│ │ [入力を減らすには、]│ │
│ │      [何度も入力…  ]│ │ [どこを変えるべき]│ │
│ │      ←狭い→ 空白→ │ │ ←行末以降 空白→  │ │
│ └────────────────────┘ │ └──────────────────┘ │
├─────────────────────────────────────────────┤
│ 説明文（全幅）                               │
└─────────────────────────────────────────────┘
```

---

## 5. サイト全体の改行ルールとの関係

| ルール | 場所 | ご相談例への影響 |
|--------|------|------------------|
| 見出し `word-break: keep-all` | `service-landing-shared` `.heading` 等 | セクション h2 は別問題。カード内は `.exampleProblem span` に同様の指定 |
| 意味の切れ目で `<br>` / 行配列 | `ConsultingInteractions` | 配列＋`display:block` で **常に複数行** |
| `max-width: 14em` 禁止 | workspace `lp-japanese-wrap` | 直接は使っていないが、**狭い grid 列**が似た効果を生む |
| 本文 `--line-height-body` | `globals.css` | 1.5 に統一済み。太字 1.45 とは **まだ差**あり |

---

## 6. 「一定の行間で羅列」に見える条件チェックリスト

- [ ] `exampleTop` が **2×1fr** のまま（899px 以下）
- [ ] `exampleProblem span` が **display: block**
- [ ] `focus` も SP で **span block**
- [ ] 列幅 **~100px 前後**（アイコン＋2 列分割）
- [ ] ラベルと太字の **margin 4px**
- [ ] 左右 **同じフォントウェイト700** で色だけ違う（黒 vs 青）

5つ揃うと、ユーザー報告どおりの見え方になる。

---

## 7. 改善の方向（文言変更なし・レイアウトのみ）

**優先度 A（右余白・細切れに直結）**

1. **899px 以下は縦ストーリー**  
   ご相談（全幅）→ 矢印下 → 検討（全幅）→ 説明。`grid-template-columns: 1fr` のみ。
2. **アイコンを上段中央 or 全幅行**に移し、`exampleProblemCol` の 2 列ネストをやめる。

**優先度 B（改行品質）**

3. SP では `exampleFocus span` の `display: block` を **維持するか再検討**（配列 1 要素 1 行はデータで既に保証されている場合、block は冗長）。
4. カード太字から `overflow-wrap: anywhere` を外す（`normal` または `break-word`）。
5. 太字の `line-height` を本文と同じ `--line-height-body` に揃える。

**優先度 C（視覚階層）**

6. ラベル → 太字の間を **8px** 程度に。
7. 左右比較をやめる場合、矢印は **ブロック間**に 1 つだけ。

---

## 8. デプロイエラー（Sanity / npm）との関係

Vercel ログの `ERESOLVE` / `@sanity/client` の peer 不一致は **UI とは無関係**だが、修正しないと本番に反映されない。

**対応（`package.json`）**:

- `@sanity/client` を **dependencies** に移動（`^7.13.2`）
- `overrides` で `@sanity/client` を **^7.13.2** に固定

ローカルで `npm install` がキャッシュ破損（`EINTEGRITY`）で失敗する場合は、Vercel 側はクリーンインストールのため通ることが多い。ローカルは `npm cache clean --force` 後に再 install。

---

## 9. 参照ファイル

| ファイル | 内容 |
|----------|------|
| `src/components/services/ConsultingInteractions.tsx` | 配列改行・`|` → `<wbr />` |
| `src/components/services/consulting-page.module.css` | `.exampleTop` グリッド、span block、keep-all |
| `src/app/globals.css` | `--line-height-body: 1.5` |
| `src/components/services/service-landing-shared.module.css` | セクション見出し keep-all |

---

## 10. 結論

- **改行**: 配列の `display: block` ＋ 狭い `1fr` 列 ＋ `keep-all` / `anywhere` の **三重掛け**。
- **右余白**: バグではなく **50/50 グリッド列の未使用領域**（右列・各行の行末）。左は **アイコン分でさらに細切れ**。
- **羅列感**: 同じパターン（小ラベル＋太字複数行）が左右に **2 セット**並ぶ構造と、**詰まった margin**。

行間を 1.5 に上げても、**列分割と強制改行**が残る限り、根本の見え方はあまり変わらない。レイアウト型の変更（縦積み）が効く。
