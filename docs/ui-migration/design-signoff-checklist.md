# デザイン判断チェックリスト（公開前）

**目的:** 技術ゲート（`npm run verify:ax-ui` / `npm run build`）を通したあと、**人の目**で「公開してよいか」を判断する。  
**正本（基準文）:** [`docs/最終改善/AXEON_UI共通ルール.md`](../最終改善/AXEON_UI共通ルール.md) §10.2  
**技術マトリクス:** [`acceptance-matrix.md`](acceptance-matrix.md)（列の意味は同じ。本書は**手順・観点・記録**を厚くする）  
**部品契約:** [`component-contracts.md`](component-contracts.md)

---

## 0. 進め方（推奨順）

| 段 | 内容 | 成果物 |
|----|------|--------|
| A | 環境起動・静的ゲート | ターミナルログ OK |
| B | **P0 トップ**（カード統一・改行・デモ枠） | 下記「記録シート」に URL 行 |
| C | **P0 LP**（kaigo / chuken） | 同上 |
| D | **P1 主要導線**（services / contact / about） | 同上 |
| E | **P2 残り**（業界 LP・記事・体験・見積） | 同上 |
| F | **導線・リンク一括** | 「導線マトリクス」全行 |
| G | **公開直前**（本番相当・noindex・問い合わせ） | サインオフ欄記入 |

各 URL は **375px（SP）と 1280px（PC）を必須**。余裕があれば 320 / 768 / 1440 を追加。

---

## 1. 事前準備（Cursor セッション開始時）

### 1.1 Git の状態（CLAUDE.md）

- ブランチ名・直近コミット・未コミット変更を確認する。
- 判断中にコードを直す場合は、**修正前にスクリーンショット or 記録シートの行**を残す。

### 1.2 表示するサーバー（どちらか一方で統一）

| 方式 | コマンド | 向き |
|------|----------|------|
| 開発 | `npm run dev` → 通常 `http://localhost:3000` | 素早い反復 |
| 本番相当 | `npm run build` → `npm run start`（別ポート可） | **公開直前はこちら推奨** |

### 1.3 静的ゲート（ブラウザの前に）

```bash
npm run verify:ax-ui
npm run build
```

失敗時はデザイン判断に入らず、先に技術修正。

---

## 2. Cursor ブラウザでの確認手順（共通）

MCP: **cursor-ide-browser**（Cursor 内蔵ブラウザ）。

### 2.1 基本フロー

1. **タブ確認** — `browser_tabs`（action: `list`）で既存タブを把握。
2. **遷移** — `browser_navigate` で対象 URL（例: `http://localhost:3000/`）。
3. **ロック** — 複数操作するとき `browser_lock`（action: `lock`）。終了時 `unlock`。
4. **構造** — `browser_snapshot` で見出し・リンク・タブの ref を取得。
5. **操作** — `browser_click` / `browser_scroll` / `browser_type`（フォーム確認時）。
6. **見た目** — 疑問箇所は `browser_take_screenshot`。
7. **幅の切り替え** — 下記「ビューポート」。

### 2.2 ビューポート（代表幅）

| 幅 | 用途 |
|----|------|
| **375** | SP 必須（iPhone 系） |
| **768** | タブレット縦・折り返し境界 |
| **1280** | PC 必須 |
| 320 | 極小 SP（はみ出し検知） |
| 1440 | ワイド（余白・行長） |

**方法 A（推奨）:** `browser_cdp` → `Emulation.setDeviceMetricsOverride`

```json
{
  "method": "Emulation.setDeviceMetricsOverride",
  "params": {
    "width": 375,
    "height": 812,
    "deviceScaleFactor": 2,
    "mobile": true
  }
}
```

PC に戻す例: `width: 1280`, `height: 800`, `deviceScaleFactor: 1`, `mobile: false`  
または `Emulation.clearDeviceMetricsOverride`。

**方法 B:** `browser_resize`（利用可能な場合）。

### 2.3 横スクロール（ページ全体）の自動チェック

`browser_cdp` → `Runtime.evaluate`（`returnByValue: true`）:

```javascript
(() => ({
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
  ok: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  path: location.pathname,
}))()
```

- `ok: false` → **不合格**（`overflow-x: hidden` で隠しているだけは不可）。
- 図解内の**意図した**横スクロールは、ラッパー内に閉じているか目視で区別する。

### 2.4 色・コントラスト（目視ルール）

プロジェクトルール（`.cursor/rules/project-rules.mdc`）:

- 明背景に **白文字・`text-base`（色トークン衝突）** がないか。
- 暗背景（kaigo デモ等）では白文字は可。

スナップショットで本文が「背景と同化」していないか、375 / 1280 両方で見る。

### 2.5 改行（日本語）

[`lp-japanese-wrap`](../../../.cursor/rules/lp-japanese-wrap.mdc) / UI 共通ルール:

- 見出しは **意味の切れ目**（配列 span / 適切な `<br>`）。1〜2 文字だけ次行、 artificial `max-width: 14em` 改行は NG。
- PC と SP で**改行位置が一致する必要はない**が、**どちらも不自然な短行がない**こと。

確認方法: 375 と 1280 で同じ見出しブロックをスクショ比較。気になるページは該当 TSX の行配列を [`component-contracts.md`](component-contracts.md) と照合。

---

## 3. 重点観点 — トップ `/`

参照: `home.demo-featured-article` / `home.implementation-showcase-card` / `home.demo-section-heading`

### 3.1 フィーチャーデモ 4 枚（`TopFeaturedDemoShowcase`）

| # | 観点 | 375 | 1280 | 確認方法 |
|---|------|:---:|:---:|----------|
| D1 | 右枠の**高さ**が左テキスト列と揃い、下に不自然な空白がない | ☐ | ☐ | 各 `#featured-*` までスクロール・スクショ |
| D2 | 4 種で**枠・padding・角丸**のトーンが揃っている | ☐ | ☐ | 連続スクショ比較 |
| D3 | SP: タイトル truncate / リード line-clamp が**読める範囲**で切れている | ☐ | — | スナップショットの見出し文言 |
| D4 | PC: 見出し・リードの**改行**が自然（Before/After 行） | — | ☐ | 行配列・目視 |
| D5 | デモ枠内のプレビューが**切れすぎ・潰れ**ていない | ☐ | ☐ | 建設・製造・承認・保育の各プレビュー |
| D6 | 「体験する」等 CTA が押せ、外部は新規タブ想定どおり | ☐ | ☐ | `browser_click` → URL 変化 |

### 3.2 業界別デモカード（`ImplementationShowcaseCard`）

| # | 観点 | 375 | 1280 | 確認方法 |
|---|------|:---:|:---:|----------|
| I1 | グリッド内カード**高さ揃え**（段差が意図的でない） | ☐ | ☐ | 6 枚並びをスクショ |
| I2 | catchCopy **line-clamp-3** で暴れない | ☐ | ☐ | 長文カードを目視 |
| I3 | LIVE DEMO 等ラベル・メタ情報の位置が揃う | ☐ | ☐ | カード間比較 |
| I4 | 各カード「体験」「詳細」リンクが有効 | ☐ | ☐ | 1 枚ずつクリック（戻る） |

### 3.3 トップ全体

| # | 観点 | 確認 |
|---|------|------|
| T1 | グローバルヘッダー・フッター導線（下記マトリクス） | ☐ |
| T2 | ファーストビュー CTA（初回コンサル等）到達 | ☐ |
| T3 | FAQ アコーディオン開閉 | ☐ |
| T4 | `prefers-reduced-motion` は必要なら OS 設定で軽減確認（任意） | ☐ |

---

## 4. URL 別チェック（デザイン目線）

`acceptance-matrix.md` の URL と同じ集合。各 URL で **§2 の共通手順** + 下表の「ページ固有」を行う。

| URL | ページ固有の見る場所 | 375 | 1280 | メモ |
|-----|---------------------|:---:|:---:|------|
| `/lp/kaigo-care-dx` | デモタブ 3 種・暗背景の文字色・見出しサイズ | ☐ | ☐ | `#demo` |
| `/lp/chuken-enterprise-v2` | SP メニュー・Cases カード・Team 図・ヘッダー hide | ☐ | ☐ | `#cases` `#team` |
| `/about` | 見出しサイズ・段落 gap・タイムライン | ☐ | ☐ | |
| `/contact` | フォーム・読み幅 | ☐ | ☐ | |
| `/services` | フリップカード・PROCESS ステップ高さ | ☐ | ☐ | |
| `/services/consulting` | 図解 SP 縦積み・事例ブロック | ☐ | ☐ | |
| `/services/insourcing-enablement` | stages / 図解 SP 余白 | ☐ | ☐ | |
| `/industries/construction` | theme-lp 色・ヒーロー改行 | ☐ | ☐ | |
| `/industries/manufacturing` | 同上 | ☐ | ☐ | |
| `/experience` | 一覧カード・フィルタ（あれば） | ☐ | ☐ | |
| `/experience/[slug]` | 代表 1 体験（compact・主説明 15px 以上） | ☐ | ☐ | URL は掲載中 slug |
| `/estimate-detailed` | ウィザード・compact 余白 | ☐ | ☐ | |
| `/articles/construction` | 読み物幅・見出し | ☐ | ☐ | |
| `/prototype-showroom` | 部品プレビュー（社内） | ☐ | ☐ | |

---

## 5. 導線・リンクマトリクス（公開前必須）

**方法:** 各リンクを 1 回クリック（外部は新規タブ想定を確認）。404・意図しない別ドメイン・ループに注意。

### 5.1 グローバル（全主要ページで共通のヘッダー/フッター）

| リンク文言（目安） | 期待パス | 確認 ☐ |
|--------------------|----------|:------:|
| トップ / AXEON ロゴ | `/` | |
| ご支援内容 | `/services` | |
| 会社紹介 | `/about` | |
| 問い合わせ | `/contact` | |
| 体験デモ | `/experience` | |

### 5.2 トップ → 主要 CTA

| 起点 | 期待 | 確認 ☐ |
|------|------|:------:|
| ヒーロー「初回コンサル…」 | `/contact` 等（実装どおり） | |
| フィーチャーデモ各「体験」 | `/experience/...` または外部デモ URL | |
| 業界カード「体験」「詳細」 | カード定義どおり | |
| 末尾 CTA | `/contact` / 見積導線 | |

### 5.3 LP 固有

| ページ | リンク | 期待 | 確認 ☐ |
|--------|--------|------|:------:|
| kaigo | PoC CTA | `#contact-kaigo` → フォーム or `/contact` | |
| chuken | 初回相談 | `/contact?from=lp-chuken-v2` | |
| chuken | アンカー（考え方・サービス・事例・体制・FAQ） | 同一ページ `#...` でスクロール | |

### 5.4 noindex・非公開

| URL | 期待 | 確認 ☐ |
|-----|------|:------:|
| `/lp/chuken-enterprise-v2` | 営業用・noindex 想定（メタ確認） | |
| `/prototype-showroom` | noindex・社内 | |

メタ確認（任意）: `browser_cdp` → `Runtime.evaluate` で `document.querySelector('meta[name=robots]')?.content`。

---

## 6. 公開直前チェック（デプロイ担当と共有）

| # | 項目 | 方法 | ☐ |
|---|------|------|:-:|
| R1 | `main` の意図したコミットがデプロイ対象 | git log / Vercel 画面 | |
| R2 | 環境変数（問い合わせ・Sanity 等）本番設定 | `.env.example` 対照（値は画面のみ） | |
| R3 | `/sitemap.xml` に公開 URL が含まれる | 本番 URL をブラウザで開く | |
| R4 | 旧 `public/lp/*.html` に依存しない（rewrite 済み） | 旧 URL 直アクセスが Next に寄る | |
| R5 | 問い合わせ送信の**テスト送信**（ステージング推奨） | 実際に 1 件 | |
| R6 | Lighthouse（Performance / A11y）主要 3 URL | 任意・記録のみ | |

---

## 7. 記録シート（セッションごとにコピー）

### 7.1 指摘テンプレート

| ID | URL | 幅 | 部品 ID / 箇所 | 現象 | 重要度 P0/P1/P2 | 対応方針 | 状態 |
|----|-----|-----|----------------|------|-----------------|----------|------|
| 1 | `/` | 375 | home.demo-featured-article | 例: 右枠下余白 | P1 | flex 調整 | open |

### 7.2 合格の記録

- 問題なし URL は [`acceptance-matrix.md`](acceptance-matrix.md) の該当列を維持。
- デザイン判断完了後、同ファイル末尾 **サインオフ** に氏名・日付。
- [`url-registry.md`](url-registry.md) の「検証」列を `F:デザイン確認 YYYY-MM-DD` に更新。

---

## 8. Cursor エージェントへの依頼文（コピペ用）

次セッションで本 MD に沿って確認するときのプロンプト例:

```
docs/ui-migration/design-signoff-checklist.md に従いデザイン判断を進めてください。
1) npm run build 済みで npm run start を localhost:3456 で起動
2) 段 B（トップ）から。375 と 1280 で §3 の表を埋める
3) 指摘は §7.1 の表形式でチャットに追記
4) 修正は P0 のみ先に。コミットは指示があるまでしない
```

---

## 9. 関連ファイル

| ファイル | 用途 |
|----------|------|
| `docs/ui-migration/acceptance-matrix.md` | 列単位の合格記録 |
| `docs/ui-migration/component-contracts.md` | トップカード契約 |
| `docs/ui-migration/url-registry.md` | 公開 URL 一覧 |
| `docs/ui-migration/exceptions.md` | compact / clamp 例外 |
| `scripts/verify-ax-ui.mjs` | CRITICAL_URLS 一覧 |

---

**版:** 2026-10-16  
**次のアクション:** 段 A → B（トップ）から、本書 §2・§3 を Cursor ブラウザで実施し、§7 に記録する。
