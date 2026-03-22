/** 配送インシデント体験（xp-int-04）用の純関数モック */

export type IncidentLaneId =
  | "datetime"
  | "location"
  | "summary"
  | "immediate"
  | "impact";

export const INCIDENT_LANES: {
  id: IncidentLaneId;
  label: string;
  reportHeading: string;
}[] = [
  { id: "datetime", label: "発生日時", reportHeading: "【発生日時】" },
  { id: "location", label: "場所", reportHeading: "【場所】" },
  { id: "summary", label: "概要", reportHeading: "【概要】" },
  {
    id: "immediate",
    label: "直ちに実施",
    reportHeading: "【直ちに実施したこと】",
  },
  { id: "impact", label: "顧客影響", reportHeading: "【顧客影響】" },
];

export type TranscriptFragment = {
  id: string;
  text: string;
};

export type LaneAssignments = Record<IncidentLaneId, string | null>;

const DEFAULT_TRANSCRIPT =
  "積み忘れ1箱。荷主へ遅延連絡済み。本日14時20分頃、〇〇DC出庫ゲート。配送管理へ連絡しルート変更を確認中。到着予定は約2時間遅延の見込み。";

function newFragmentId(): string {
  return `frag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 句点・改行で分割。空入力はデフォルト文を分割。 */
export function splitTranscriptMock(raw: string): TranscriptFragment[] {
  const base = raw.trim() || DEFAULT_TRANSCRIPT;
  const parts = base
    .split(/[。\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks =
    parts.length > 0
      ? parts.map((text) => ({ id: newFragmentId(), text }))
      : [{ id: newFragmentId(), text: base }];

  return chunks;
}

export function emptyAssignments(): LaneAssignments {
  return {
    datetime: null,
    location: null,
    summary: null,
    immediate: null,
    impact: null,
  };
}

function textForFragment(
  id: string | null,
  byId: Map<string, TranscriptFragment>
): string {
  if (!id) return "";
  return byId.get(id)?.text ?? "";
}

/** 左ペイン用セクション */
export function buildIncidentDraft(
  fragments: TranscriptFragment[],
  assignments: LaneAssignments
): { sections: { heading: string; body: string; laneId: IncidentLaneId }[] } {
  const byId = new Map(fragments.map((f) => [f.id, f]));
  const sections = INCIDENT_LANES.map(({ id, reportHeading }) => {
    const body = textForFragment(assignments[id], byId);
    return {
      laneId: id,
      heading: reportHeading,
      body,
    };
  });
  return { sections };
}

function isSummaryFilled(assignments: LaneAssignments): boolean {
  return Boolean(assignments.summary);
}

function isFullyFilled(assignments: LaneAssignments): boolean {
  return INCIDENT_LANES.every(({ id }) => Boolean(assignments[id]));
}

/**
 * 概要レーンが空: プレースホルダ。
 * 概要のみ: 短い荷主向け案。
 * 主要レーンが揃った場合: 既存モックに近い丁寧な文。
 */
export function buildShipperMemo(
  assignments: LaneAssignments,
  fragments: TranscriptFragment[],
  rawInput: string
): string {
  const byId = new Map(fragments.map((f) => [f.id, f]));
  const summary = textForFragment(assignments.summary, byId);
  const impact = textForFragment(assignments.impact, byId);
  const immediate = textForFragment(assignments.immediate, byId);
  const location = textForFragment(assignments.location, byId);
  const datetime = textForFragment(assignments.datetime, byId);

  if (!isSummaryFilled(assignments)) {
    return [
      "【荷主向けメモ（下書き）】",
      "概要レーンにセンテンスを割り当てると、ここに連絡文案が自動で組み立てられます。",
      "現在は項目の整理中です。左の報告ドラフトとあわせて、レーンへの振り分けを進めてください。",
      rawInput.trim()
        ? `（元テキスト: ${rawInput.trim().slice(0, 80)}${rawInput.trim().length > 80 ? "…" : ""}）`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (!isFullyFilled(assignments)) {
    return [
      "お世話になっております。",
      `状況の要点として「${summary}」と認識しております。`,
      impact
        ? `影響については「${impact}」としており、追って詳細をご連絡いたします。`
        : "詳細な時刻・影響範囲は確認中です。追ってご連絡いたします。",
      "ご不便をおかけし申し訳ございません。",
    ].join("");
  }

  const detailBits = [datetime, location].filter(Boolean).join("／");
  const actionBit = immediate || "社内で状況を共有し、対応を進めております。";

  return [
    "お世話になっております。",
    `本件、${detailBits ? `${detailBits}にて` : ""}発生した事象についてご報告いたします。`,
    `${summary}`,
    `${actionBit}`,
    impact ? `お客様への影響は${impact}としております。` : "",
    "ご迷惑をおかけし誠に申し訳ございません。引き続き対応状況を共有いたします。",
  ]
    .filter(Boolean)
    .join("");
}

/** タイムライン上の相対幅（装飾用） */
export function fragmentWeights(fragments: TranscriptFragment[]): number[] {
  if (fragments.length === 0) return [];
  const lens = fragments.map((f) => Math.max(1, f.text.length));
  const sum = lens.reduce((a, b) => a + b, 0);
  return lens.map((l) => l / sum);
}
