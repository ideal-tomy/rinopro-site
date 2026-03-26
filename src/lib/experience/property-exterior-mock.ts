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
  /** 管理会社・業者向けの修繕依頼文案 */
  repairRequestDraft: string;
  /** ピン1件あたり1行の所見（UI でリスト表示） */
  pinFindings: string[];
};

const DEFAULT_MEMO =
  "共用廊下 東側。LED照明1基消灯。通行支障なし。前回点検から2週間。";

function buildRepairRequestDraft(
  baseMemo: string,
  pins: PropertyPhotoPin[],
  pinFindings: string[]
): string {
  const lines: string[] = [
    "件名：共用部・外観に関する修繕のご依頼（現地写真・ピン位置参照）",
    "",
    "○○マンション管理室／修繕担当 各位",
    "",
    "いつもお世話になっております。現地確認のうえ、下記の事象を確認しました。ご対応をお願いいたします。",
    "",
    "■ 現場メモ（自由記載）",
    baseMemo,
    "",
  ];

  if (pins.length > 0) {
    lines.push("■ 不備・確認箇所（写真上ピンと対応）");
    pinFindings.forEach((line, i) => {
      lines.push(`${i + 1}. ${line}`);
    });
    lines.push("");
    lines.push("※ 添付の現場写真では、各番号ピンがおおよその位置を示しています（モック出力）。");
  } else {
    lines.push("■ 全体所見");
    lines.push("写真全体に関する所見は上記メモのとおりです。ピンによる位置指定はありません。");
    lines.push("");
  }

  lines.push("■ 希望");
  lines.push("・現地での詳細確認およびお見積りのご提示");
  lines.push("・完了後、管理記録への反映をお願いいたします");
  lines.push("");
  lines.push("以上、よろしくお願いいたします。");

  return lines.join("\n");
}

export function buildPropertyMockFromPins(
  text: string,
  pins: PropertyPhotoPin[],
  hasImage: boolean
): PropertyExteriorMockResult {
  const baseMemo = text.trim() || DEFAULT_MEMO;
  const pinFindings = pins.map((p, i) => {
    const pos = `位置 横${Math.round(p.xPct)}%・縦${Math.round(p.yPct)}%`;
    return `ピン${i + 1}（${p.label}）: ${pos} において、${p.label}に関する所見を記録。`;
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
      ? `${baseMemo}\n\n【ピン連動所見】\n${pinFindings.join("\n")}`
      : baseMemo;

  const repairRequestDraft = buildRepairRequestDraft(
    baseMemo,
    pins,
    pinFindings
  );

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

  return { tags, memo, next, repairRequestDraft, pinFindings };
}
