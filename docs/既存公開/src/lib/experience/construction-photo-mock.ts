export type ConstructionPhotoPin = {
  id: string;
  xPct: number;
  yPct: number;
  label: string;
};

export type ConstructionPhotoMockResult = {
  tags: string[];
  memo: string;
  next: string;
  /** 現場所長・安全担当者向けの点検報告文案 */
  inspectionReportDraft: string;
  /** ピン1件あたり1行の所見（UI でリスト表示） */
  pinFindings: string[];
};

const DEFAULT_MEMO =
  "足場 北側2層目。固定クランプ1箇所に緩みを確認。作業前に所長へ報告済み。";

function buildInspectionReportDraft(
  baseMemo: string,
  pins: ConstructionPhotoPin[],
  pinFindings: string[]
): string {
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [
    `件名：現場点検記録（写真・ピン位置参照）— ${today}`,
    "",
    "現場所長 / 安全担当者 各位",
    "",
    "点検中に下記の不備・要注意箇所を確認しました。ご対応のご検討をお願いいたします。",
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
    lines.push(
      "※ 添付の現場写真では、各番号ピンがおおよその位置を示しています（モック出力）。"
    );
  } else {
    lines.push("■ 全体所見");
    lines.push(
      "写真全体に関する所見は上記メモのとおりです。ピンによる位置指定はありません。"
    );
    lines.push("");
  }

  lines.push("■ 対応依頼");
  lines.push("・現地での詳細確認および是正措置の検討");
  lines.push("・安全管理日誌および点検記録への反映をお願いいたします");
  lines.push("");
  lines.push("以上、よろしくお願いいたします。");

  return lines.join("\n");
}

export function buildConstructionPhotoMock(
  text: string,
  pins: ConstructionPhotoPin[],
  hasImage: boolean
): ConstructionPhotoMockResult {
  const baseMemo = text.trim() || DEFAULT_MEMO;
  const pinFindings = pins.map((p, i) => {
    const pos = `位置 横${Math.round(p.xPct)}%・縦${Math.round(p.yPct)}%`;
    return `ピン${i + 1}（${p.label}）: ${pos} において、${p.label}に関する不備・確認事項を記録。`;
  });

  const labelSet = new Set<string>();
  for (const p of pins) {
    if (p.label.trim()) labelSet.add(p.label.trim());
  }

  const tags: string[] = ["現場点検記録", "建設・工事"];
  if (hasImage) tags.push("写真あり");
  else tags.push("テキストのみ");

  for (const l of labelSet) tags.push(l);
  if (hasImage && pins.length === 0) tags.push("ピン未設定（全体所見）");

  tags.push("緊急度: 中");

  const memo =
    pinFindings.length > 0
      ? `${baseMemo}\n\n【ピン連動所見】\n${pinFindings.join("\n")}`
      : baseMemo;

  const inspectionReportDraft = buildInspectionReportDraft(
    baseMemo,
    pins,
    pinFindings
  );

  const hasScaffolding = [...labelSet].some((l) => l.includes("足場"));
  const hasCrack = [...labelSet].some((l) => l.includes("亀裂"));
  const hasPPE = [...labelSet].some((l) => l.includes("保護具"));

  let next = "現場所長へ写真付きで報告。安全管理日誌に記録。";
  if (hasScaffolding) {
    next =
      "現場所長へ即時報告。立入禁止措置を検討し、足場点検業者の確認を手配。安全管理日誌に記録。";
  } else if (hasCrack) {
    next =
      "専門技術者による現地確認を手配。施主へ状況を報告。ヒヤリハット様式Aで提出。";
  } else if (hasPPE) {
    next = "交換品・補充品の手配を確認。日報および安全管理日誌に記録。";
  }

  return { tags, memo, next, inspectionReportDraft, pinFindings };
}
