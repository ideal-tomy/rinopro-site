/** 書類シェル用の決定論的シグナル抽出（ルールベース） */

export function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function splitLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function extractBulletLikeLines(raw: string): string[] {
  return splitLines(raw).filter((l) => /^[・\-\*●◆]?\s*\S/.test(l));
}

/** 万円・単独の数字列を拾う（簡易） */
export function extractNumericHints(raw: string): string[] {
  const out: string[] = [];
  const man = raw.match(/\d+(?:\.\d+)?\s*万/g);
  if (man) out.push(...man);
  const pct = raw.match(/\d+\s*%/g);
  if (pct) out.push(...pct);
  return out;
}

export function pickIndustryFromText(raw: string): string {
  const n = norm(raw);
  if (n.includes("エステ") || n.includes("美容") || n.includes("サロン"))
    return "エステサロン";
  if (n.includes("カフェ") || n.includes("飲食") || n.includes("レストラン"))
    return "飲食店";
  if (n.includes("it") || n.includes("ソフト") || n.includes("開発"))
    return "IT・ソフトウェア";
  if (n.includes("小売") || n.includes("店舗")) return "小売・店舗";
  if (n.includes("製造") || n.includes("工場")) return "製造業";
  return "サービス業";
}

export function pickAreaFromText(raw: string): string {
  const n = norm(raw);
  if (n.includes("銀座")) return "東京都中央区銀座周辺";
  if (n.includes("渋谷")) return "東京都渋谷区";
  if (n.includes("大阪")) return "大阪府大阪市";
  if (n.includes("福岡")) return "福岡県福岡市";
  return "（エリアは入力に基づく想定立地）";
}

export function pickAmountHintFromText(raw: string): string {
  const nums = raw.match(/\d{2,4}/g);
  if (nums?.length) {
    const n = parseInt(nums[nums.length - 1]!, 10);
    if (!Number.isNaN(n) && n >= 100 && n <= 9999)
      return `${n}万円規模の設備・内装を想定`;
  }
  return "設備・内装・運転資金のバランスを想定";
}
