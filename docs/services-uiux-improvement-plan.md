# /services 系ページ UI/UX 改善 PLAN

作成日: 2026-05-27  
対象ページ: `/services` / `/services/consulting` / `/services/insourcing-enablement`

---

## 背景・目的

現状の3ページには以下の課題がある。

- `/services`: カードとタブが同じ2分類を繰り返す重複構造。サービス詳細ページへの導線がない。
- `/services/consulting`: 日本語への過大な字間(letter-spacing)。長いページなのに中間CTAがなく途中離脱しやすい。
- `/services/insourcing-enablement`: `**bold**` がそのまま表示されるバグ。全サービス共通テンプレートで個性がない。

これらをフェーズ分けして着実に改善する。

---

## フェーズ構成

| フェーズ | 内容 | 影響範囲 | 目安工数 |
|---------|------|---------|---------|
| Phase 1 | バグ修正・即効改善 | 小（2ファイル） | 小 |
| Phase 2 | コピー・スタイル改善 | 中（3〜4ファイル） | 中 |
| Phase 3 | 構造改善（/servicesのレイアウト刷新） | 大（3ファイル以上） | 大 |

---

## Phase 1: バグ修正・即効改善

> ビルドや既存機能への影響が最小のもの。承認なしで着手可。

### 1-A: `**bold**` 表示バグの修正

**問題**  
`src/lib/content/service-offerings.ts` の `insourcing-enablement` の `why.paragraphs` に `**コアな判断と運用は内製**` のようなマークダウン記法が含まれている。しかし `ServiceOfferingDetailView.tsx` では `<p>{p}</p>` で素通し表示しているため、アスタリスクが画面に文字として表示されてしまう。

**やること**  
`ServiceOfferingDetailView.tsx` の `why.paragraphs` 表示部分に、`**...**` を `<strong>` に変換するインライン関数を追加する。（`FlowTimelinePageContent.tsx` にある `EmphasisText` コンポーネントと同じパターン）

**触るファイル**
- `src/components/services/ServiceOfferingDetailView.tsx`（why段落のレンダリング部分のみ）

**触らないファイル**
- `src/lib/content/service-offerings.ts`（データは変更不要）
- その他の全ファイル

**想定リスク**
- ビルドが壊れる可能性: **低**（ロジック追加のみ）
- 既存機能への影響: **なし**（他のサービス提供ページにも適用されるが、他ページには `**` 記法は存在しない）

**ロールバック方法**  
`git checkout src/components/services/ServiceOfferingDetailView.tsx` で元に戻せる。

---

### 1-B: consulting ページの見出し letter-spacing 修正

**問題**  
`ConsultingDetailPageContent.tsx` のセクション見出し（`h2`）に `tracking-[0.18em]` 〜 `tracking-[0.22em]` が設定されている。日本語テキストに対して字間が広すぎ、読みにくい。

**やること**  
見出しの `tracking-[0.18em]` / `tracking-[0.22em]` を `tracking-tight`（= `-0.025em`）または `tracking-normal` に変更する。kicker（eyebrow）の `tracking-[0.2em]` はそのまま維持（英語テキストなのでOK）。

**触るファイル**
- `src/components/services/ConsultingDetailPageContent.tsx`（h2のtrackingのみ）

**触らないファイル**
- すべての他ファイル

**想定リスク**
- ビルドが壊れる可能性: **低**
- 既存機能への影響: **なし**（スタイルのみ）

**ロールバック方法**  
`git checkout src/components/services/ConsultingDetailPageContent.tsx` で元に戻せる。

---

## Phase 2: コンテンツ・スタイル改善

> デザインの質を上げる。既存の構造を変えない範囲で改善。

### 2-A: consulting ページに中間CTAを追加

**問題**  
CTAボタン（「相談する」）がページ最下部の1箇所のみ。8セクション読んだあとにしか表示されず、途中で意欲が出たユーザーを逃す。

**やること**  
セクション4〜5の間に、コンパクトな中間CTAブロックを1つ挿入する。デザインは既存のフッターCTAと同じButtonコンポーネントを流用。過度なバナーにはしない（1〜2行テキスト＋ボタン程度）。

**触るファイル**
- `src/components/services/ConsultingDetailPageContent.tsx`（セクションループ内に条件分岐を追加）

**触らないファイル**
- `src/lib/content/site-copy.ts`（コピーは既存の `consultingDetailPageCopy.cta` を再利用）

**想定リスク**
- ビルドが壊れる可能性: **低**
- 既存機能への影響: **なし**

**ロールバック方法**  
`git checkout src/components/services/ConsultingDetailPageContent.tsx` で元に戻せる。

---

### 2-B: insourcing-enablement ページの pitfalls セクションの視覚コントラスト強化

**問題**  
「よくある詰まり」と「AXEONの支援の重点」の2カラムの差が `bg-neutral` vs `bg-pure` の背景色のみで弱い。「問題」と「解決策」という対比の訴求力が出ていない。

**やること**  
- 「よくある詰まり」カラム: 左端にアクセントの薄い赤ボーダー（`border-l-4 border-orange-400/60` 程度）を追加し、課題感を視覚的に表現
- 「AXEONの支援の重点」カラム: 左端にアクセントカラーのボーダー（`border-l-4 border-accent/60`）を追加し、解決感を強調

**触るファイル**
- `src/components/services/ServiceOfferingDetailView.tsx`（pitfalls セクションのカラム className のみ）

**触らないファイル**
- データファイル全般

**想定リスク**
- ビルドが壊れる可能性: **低**
- 既存機能への影響: **低**（全サービス提供ページの pitfalls セクションに影響するが、全ページ共通で改善）

**ロールバック方法**  
`git checkout src/components/services/ServiceOfferingDetailView.tsx` で元に戻せる。

---

### 2-C: insourcing-enablement の outcomes `futureParagraph` に小見出しを追加

**問題**  
`outcomes.bullets` の箇条書きのあとに `futureParagraph` がそのまま続き、読者が「何の説明か」迷う。

**やること**  
`futureParagraph` の直前に小さなラベル（例: `"将来像"`）を追加し、内容が箇条書きと別文脈だと分かるようにする。

**触るファイル**
- `src/components/services/ServiceOfferingDetailView.tsx`（outcomes セクションの futureParagraph 前にラベル追加）

**触らないファイル**
- データファイル全般

**想定リスク**
- ビルドが壊れる可能性: **低**
- 既存機能への影響: **低**（全サービス提供ページに適用されるが、全ページで改善）

**ロールバック方法**  
`git checkout src/components/services/ServiceOfferingDetailView.tsx` で元に戻せる。

---

### 2-D: /services カードにアイコンを追加

**問題**  
開発・コンサルティングの2カードがテキストのみで視覚的に区別しにくい。

**やること**  
各カードの上部に `lucide-react` の既存アイコン（`Code2` や `Lightbulb` など）を追加する。新規ライブラリ不要。

**触るファイル**
- `src/components/services/ServicesPageContent.tsx`（カードのJSXにアイコン要素追加）

**触らないファイル**
- コンテンツファイル全般

**想定リスク**
- ビルドが壊れる可能性: **低**（lucide-react は既に依存関係に含まれている）
- 既存機能への影響: **なし**（見た目のみ）

**ロールバック方法**  
`git checkout src/components/services/ServicesPageContent.tsx` で元に戻せる。

---

## Phase 3: 構造改善（/services のレイアウト刷新）

> 影響範囲が大きく、情報設計の判断を含む。着手前に別途相談・承認が必要。

### 3-A: カードとタブパネルの役割重複を解消

**問題**  
`ServicesPageContent` では上部に2カード（チャット誘導）＋下部にタブ（詳細コンテンツ）という構造で、同じ「開発/コンサルティング」の2分類が重複している。

**改善方針の選択肢**

**案A（推奨）: カードを「入口の選択」として整理し、タブを廃止してリンクで代替**
- 上部カード: チャット誘導ボタン ＋ サービス詳細ページへのリンクボタンを両方置く
- タブパネル廃止: 代わりに「詳細はこちら」のリンクで各詳細ページへ誘導
- 長所: ページが短くなり、情報設計がシンプルになる
- 短所: 詳細コンテンツを/servicesから直接見られなくなる

**案B: タブパネルを「サマリーカード」に変える**
- タブを廃止し、開発・コンサルティングそれぞれのサマリー（3〜5行+リンク）を横並びカードで表示
- 長所: /servicesページが概要ハブとして完結する
- 短所: FlowTimelinePageContent / ConsultingDetailPageContent の埋め込みを外すと各ページへの流入が必要になる

**触るファイル（案A or 案Bともに）**
- `src/components/services/ServicesPageContent.tsx`（メイン変更）
- `src/lib/content/site-copy.ts`（servicesCopy の追加・調整の可能性）

**触らないファイル**
- `ConsultingDetailPageContent.tsx`（単体ページとしてそのまま機能）
- `FlowTimelinePageContent.tsx`（単体ページとしてそのまま機能）
- その他の全ファイル

**想定リスク**
- ビルドが壊れる可能性: **中**（動的インポートやタブ状態管理を外すため）
- 既存機能への影響: **中**（チャット誘導のトラッキング処理 `writeServicesFlowPick` が整理されたカード内にあるため、接続を維持する必要がある）

**ロールバック方法**  
`git checkout src/components/services/ServicesPageContent.tsx` で元に戻せる。

---

### 3-B: /services/consulting にページ内ナビゲーションを追加

**問題**  
長大ページ（8セクション）でどこにいるか把握できない。

**改善方針**  
ページ上部または左サイドに各セクションへのアンカーリンクを設置。モバイルでは折りたたみ式ドロップダウンにする。

**触るファイル**
- `src/components/services/ConsultingDetailPageContent.tsx`
- `src/lib/content/site-copy.ts`（セクション名のリスト管理）

**触らないファイル**
- その他全般

**想定リスク**
- ビルドが壊れる可能性: **低〜中**
- 既存機能への影響: **低**（スクロール挙動の追加のみ）

**ロールバック方法**  
`git checkout src/components/services/ConsultingDetailPageContent.tsx` で元に戻せる。

---

### 3-C: コードリファクタリング（kicker依存ロジックの解消）

**問題**  
`ConsultingDetailPageContent.tsx` の `renderSectionBody` が `kicker.startsWith("セクション1")` でレイアウトを分岐しており、コンテンツのテキストが変わると表示が壊れる。

**改善方針**  
`consultingDetailPageCopy` のセクションデータに `layout: "bullets" | "faq" | "default"` フィールドを追加し、コンポーネント側はそのフィールドで分岐する。

**触るファイル**
- `src/lib/content/site-copy.ts`（セクションデータに `layout` フィールド追加）
- `src/components/services/ConsultingDetailPageContent.tsx`（分岐ロジックを `kicker` 文字列から `layout` フィールドへ変更）

**触らないファイル**
- その他全般

**想定リスク**
- ビルドが壊れる可能性: **低**（型の追加と参照先の変更のみ）
- 既存機能への影響: **低**（表示は変わらず、内部ロジックのみ改善）

**ロールバック方法**  
`git checkout` で両ファイルを元に戻せる。

---

## 推奨着手順序

```
Phase 1-A（バグ修正）
  → Phase 1-B（letter-spacing）
  → Phase 2-D（カードアイコン）+ Phase 2-A（中間CTA）[並行可]
  → Phase 2-B（pitfalls コントラスト）+ Phase 2-C（futureParagraph ラベル）[並行可]
  → Phase 3 の方針を相談・決定
  → Phase 3-A（構造改善）
  → Phase 3-B（ページ内ナビ）+ Phase 3-C（コードリファクタリング）[並行可]
```

Phase 1〜2 は各項目を1コミット単位で進める。Phase 3 は着手前に改めて相談する。

---

## 判断が必要な事項（Phase 3 着手前に確認）

1. **Phase 3-A の案A/案Bのどちらを選ぶか**: `/services` からタブを外す場合、各詳細ページへの流入をどう設計するか
2. **パンくずリストを追加するか**: 全services系ページ共通で追加するなら `PageShell` への変更が必要
3. **insourcing-enablement のヒーローをカスタマイズするか**: 全サービス共通テンプレートを変えず、データ側にオプションを追加する方向で対応するか
