# AXEON UI 移行 — 例外台帳

**版:** 2026-10-16  
例外は **URL 名ではなくバリエーション ID** で管理する。承認者: プロダクトオーナー（サイト運用）。

| ID | 意味 | 適用範囲 | 理由 | 検証方法 |
|----|------|----------|------|----------|
| `density:compact` | 本文・余白を詰める | experience prototypes、demo 操作 UI、estimate ウィザード | 高密度操作画面 | SP で 15px 未満の**主説明**がないこと |
| `theme:care` | ケア配色 | `/lp/kaigo-care-dx` | 業種 LP ブランド | コントラスト 4.5:1 |
| `theme:chuken` | 中堅 LP 配色 | `/lp/chuken-enterprise-v2` | 別ブランド演出 | 同上 |
| `theme:lp` | 業種 LP 色上書き | `/industries/*` | 既存 `--lp-*` | slate 固定 FAQ 維持 |
| `diagram:scrollable` | 局所横スクロール可 | 比較表・タイムラインのみ | 比較のため | ページ全体 overflow なし |
| `scope:studio` | CMS UI | `/studio/*` | Sanity 既定 UI | 移行対象外 |
| `scope:chat` | コンシェルジュ | 右下チャット | 別デザイン系統 | 移行対象外（色トークン衝突注意） |
| `home:presentation-clamp` | トップ見出しの clamp タイポ | `/` の `home-presentation.ts` | Ideal 移植の見た目維持。ロール表への完全寄せは F | 本文 15px 未満なし |

### 新規例外の追加手順

1. 本表に ID・理由・検証を追記
2. `url-registry.md` の該当行を更新
3. CSS は `data-ax-density="compact"` 等の**意味属性**で実装（ページ名クラス禁止）
