export type PropertyPhotoPin = {
  id: string;
  xPct: number;
  yPct: number;
  label: string;
};

export type PropertyExteriorMockResult = {
  tags: string[];
  memo: string;
  next: string;
  /** ピン1件あたり1行の所見（UI でリスト表示） */
  pinFindings: string[];
};

const DEFAULT_MEMO =
  "共用廊下 東側。LED照明1基消灯。通行支障なし。前回点検から2週間。";

export function buildPropertyMockFromPins(
  text: string,
  pins: PropertyPhotoPin[],
  hasImage: boolean
): PropertyExteriorMockResult {
  const baseMemo = text.trim() || DEFAULT_MEMO;
  const pinFindings = pins.map((p, i) => {
    const pos = `位置 横${Math.round(p.xPct)}%・縦${Math.round(p.yPct)}%`;
    return `ピン${i + 1}（${p.label}）: ${pos} において、${p.label}に関する所見を記録（モック）。`;
  });

  const labelSet = new Set<string>();
  for (const p of pins) {
    if (p.label.trim()) labelSet.add(p.label.trim());
  }

  const tags: string[] = ["外観・共用部記録"];
  if (hasImage) tags.push("写真あり");
  else tags.push("テキストのみ");

  for (const l of labelSet) tags.push(l);
  if (hasImage && pins.length === 0) tags.push("ピン未設定（全体所見）");

  tags.push("緊急度: 中");

  const memo =
    pinFindings.length > 0
      ? `${baseMemo}\n\n【ピン連動所見（モック）】\n${pinFindings.join("\n")}`
      : baseMemo;

  const hasLighting = [...labelSet].some((l) => l.includes("照明"));
  const hasExterior = [...labelSet].some((l) => l.includes("外壁"));
  let next =
    "管理会社へ写真付きでメール連絡。交換部品の手配可否を確認。";
  if (hasLighting) {
    next =
      "管理会社へ写真・ピン位置を添付し照明交換を依頼。点検記録番号を記載。";
  } else if (hasExterior) {
    next =
      "外壁専門業者の現地確認を手配。雨漏り有無を別途確認し管理会社へ共有。";
  }

  return { tags, memo, next, pinFindings };
}
