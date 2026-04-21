/**
 * デモのカテゴリ分類とタグ色マップ
 * 一覧のグルーピング・Netflix風レール・タグ色分けに使用
 */

/** functionTags の値 → カテゴリID（レール見出し用） */
export const CATEGORY_BY_FUNCTION_TAG: Record<string, string> = {
  "音声入力": "report",
  "報告書生成": "report",
  "報告書作成": "report",
  "議事録生成": "report",
  "記録業務": "report",
  "検索": "search",
  "要約": "search",
  "問い合わせ対応": "inquiry",
  "返信生成": "inquiry",
  "帳票生成": "document",
  "受注管理": "document",
  "見積作成": "document",
  "契約レビュー": "document",
  "契約交渉": "document",
  "請求管理": "document",
  "期限管理": "document",
  "資料作成": "document",
  "文書生成": "document",
  "連絡文生成": "document",
  "安全管理": "safety",
  "工程調整": "safety",
  "原価管理": "safety",
  "協力会社管理": "safety",
  "品質管理": "quality",
  "保全": "quality",
  "在庫管理": "quality",
  "引継ぎ": "quality",
  "商品企画": "sales",
  "販促": "sales",
  "CS効率化": "sales",
  "追客": "sales",
  "案件整理": "sales",
  "面談準備": "legal",
  "ヒアリング": "legal",
  "採用": "hr",
  "評価": "hr",
  "画像入力": "inspection",
  "配送管理": "logistics",
};

/** カテゴリID → 表示ラベル */
export const CATEGORY_LABELS: Record<string, string> = {
  report: "報告・記録",
  search: "検索・要約",
  inquiry: "問い合わせ",
  document: "帳票・契約",
  safety: "安全管理",
  quality: "品質・製造",
  sales: "販促・営業",
  legal: "士業・法務",
  hr: "採用・人材",
  inspection: "点検・画像",
  logistics: "物流",
  other: "その他",
};

/** 業種タグ → Tailwind 色クラス（目立つ・判別しやすい） */
export const INDUSTRY_COLOR_MAP: Record<string, string> = {
  建設: "border-amber-500/60 bg-amber-500/15 text-amber-400",
  士業: "border-blue-500/60 bg-blue-500/15 text-blue-400",
  製造: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400",
  小売: "border-violet-500/60 bg-violet-500/15 text-violet-400",
  EC: "border-violet-500/60 bg-violet-500/15 text-violet-400",
  不動産: "border-teal-500/60 bg-teal-500/15 text-teal-400",
  医療: "border-rose-500/60 bg-rose-500/15 text-rose-400",
  介護: "border-rose-500/60 bg-rose-500/15 text-rose-400",
  物流: "border-indigo-500/60 bg-indigo-500/15 text-indigo-400",
  人材: "border-sky-500/60 bg-sky-500/15 text-sky-400",
  飲食: "border-orange-500/60 bg-orange-500/15 text-orange-400",
  サービス: "border-warm/60 bg-warm/15 text-warm",
  保険: "border-lime-500/60 bg-lime-500/15 text-lime-400",
};

/** 機能タグ（カテゴリ）→ Tailwind 色クラス */
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  report: "border-warm/60 bg-warm/15 text-warm",
  search: "border-blue-500/60 bg-blue-500/15 text-blue-400",
  inquiry: "border-amber-500/60 bg-amber-500/15 text-amber-400",
  document: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400",
  safety: "border-orange-500/60 bg-orange-500/15 text-orange-400",
  quality: "border-green-500/60 bg-green-500/15 text-green-400",
  sales: "border-violet-500/60 bg-violet-500/15 text-violet-400",
  legal: "border-indigo-500/60 bg-indigo-500/15 text-indigo-400",
  hr: "border-sky-500/60 bg-sky-500/15 text-sky-400",
  inspection: "border-teal-500/60 bg-teal-500/15 text-teal-400",
  logistics: "border-slate-400/60 bg-slate-500/15 text-slate-300",
  other: "border-silver/40 bg-silver/10 text-text-sub",
};

/** デモの functionTags からカテゴリIDを取得（先頭一致優先） */
export function getCategoryId(functionTags: string[] | undefined): string {
  if (!functionTags?.length) return "other";
  for (const tag of functionTags) {
    const cat = CATEGORY_BY_FUNCTION_TAG[tag];
    if (cat) return cat;
  }
  return "other";
}

/** 業種タグの色クラスを取得 */
export function getIndustryTagClass(tag: string): string {
  return INDUSTRY_COLOR_MAP[tag] ?? "border-silver/40 bg-silver/10 text-text-sub";
}

/** 機能タグの色クラスを取得（カテゴリ経由） */
export function getFunctionTagClass(tag: string): string {
  const catId = CATEGORY_BY_FUNCTION_TAG[tag] ?? "other";
  return CATEGORY_COLOR_MAP[catId] ?? CATEGORY_COLOR_MAP.other;
}
