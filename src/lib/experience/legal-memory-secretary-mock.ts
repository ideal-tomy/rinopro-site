export type LegalMemoryTagId = "lease" | "nda" | "vendor";

export interface LegalMemoryTagOption {
  id: LegalMemoryTagId;
  label: string;
  /** 1行の検索対象説明（UI の「検索対象」に使う） */
  scopeDescription: string;
}

export const LEGAL_MEMORY_TAG_OPTIONS: LegalMemoryTagOption[] = [
  {
    id: "lease",
    label: "賃貸・不動産",
    scopeDescription: "賃貸借契約書（港区物件・解約条項を含む）",
  },
  {
    id: "nda",
    label: "NDA",
    scopeDescription: "秘密保持・返還条項（標準NDA 2021版）",
  },
  {
    id: "vendor",
    label: "業務委託",
    scopeDescription: "業務委託基本契約（解約・準拠法周り）",
  },
];

const DEFAULT_SCOPE =
  "契約書・NDA・業務委託（横断サンプル。タグで絞り込み可能）";

export function getSearchScopeLabel(selectedTagIds: LegalMemoryTagId[]): string {
  if (selectedTagIds.length === 0) return DEFAULT_SCOPE;
  const parts = selectedTagIds
    .map((id) => LEGAL_MEMORY_TAG_OPTIONS.find((o) => o.id === id)?.scopeDescription)
    .filter(Boolean) as string[];
  return parts.join(" ／ ");
}

export interface LegalMemoryHit {
  id: string;
  title: string;
  collapsedExcerpt: string;
  expandedExcerpt: string;
  citation: string;
}

export interface LegalMemorySummarySegment {
  text: string;
  /** 要約内のこの部分が参照するヒット */
  hitId?: string;
}

export interface LegalMemoryMockResult {
  searchScope: string;
  hits: LegalMemoryHit[];
  summarySegments: LegalMemorySummarySegment[];
  internal: string;
  /** 統合された回答（UI「統合回答」用） */
  integratedAnswer: string;
  /** 回答横のステータス（例: 法務チェック済み） */
  lawCheckStatusLabel: string;
  /** ステータスの補足（1〜2行） */
  lawCheckNote: string;
}

const HIT_LEASE: LegalMemoryHit = {
  id: "hit-lease",
  title: "賃貸借契約書（港区〇〇ビル）",
  collapsedExcerpt: "解約の意思表示は契約期間満了の3か月前までに書面で…",
  expandedExcerpt:
    "…「借主は、契約期間満了の3か月前までに書面で解約の意思表示を行うものとする」…（但書: 事業用の場合は別紙の特約を優先）",
  citation: "契約書 2022-04-12 別紙1 第12条",
};

const HIT_NDA: LegalMemoryHit = {
  id: "hit-nda",
  title: "標準NDA（2021版）",
  collapsedExcerpt: "秘密情報の返還または破棄は契約終了後30日以内…",
  expandedExcerpt:
    "…秘密情報の返還または破棄は、本契約終了後30日以内に行うものとする。電子媒体の場合は消去証跡の提出を求めることができる…",
  citation: "NDA 2021-06-01 第8条",
};

const HIT_VENDOR: LegalMemoryHit = {
  id: "hit-vendor",
  title: "業務委託基本契約",
  collapsedExcerpt: "30日前の書面通知により本契約を解約できる…",
  expandedExcerpt:
    "…いずれかの当事者は、相手方に30日前の書面通知により本契約を解約できる。ただし、重大な債務不履行の場合は即時解除が可能…",
  citation: "委託契約 2020-09-15 第15条",
};

function orderHits(
  primary: LegalMemoryTagId | null,
  qSnippet: string
): LegalMemoryHit[] {
  const base = [HIT_LEASE, HIT_NDA, HIT_VENDOR];
  if (primary === "lease") {
    return [
      { ...HIT_LEASE, collapsedExcerpt: `${HIT_LEASE.collapsedExcerpt}（検索語: ${qSnippet}）` },
      HIT_NDA,
      HIT_VENDOR,
    ];
  }
  if (primary === "nda") {
    return [
      { ...HIT_NDA, collapsedExcerpt: `${HIT_NDA.collapsedExcerpt}（検索語: ${qSnippet}）` },
      HIT_VENDOR,
      HIT_LEASE,
    ];
  }
  if (primary === "vendor") {
    return [
      {
        ...HIT_VENDOR,
        collapsedExcerpt: `${HIT_VENDOR.collapsedExcerpt}（検索語: ${qSnippet}）`,
      },
      HIT_LEASE,
      HIT_NDA,
    ];
  }
  return base.map((h, i) =>
    i === 0
      ? {
          ...h,
          collapsedExcerpt: `${h.collapsedExcerpt.slice(0, 40)}…（検索語: ${qSnippet}）`,
        }
      : h
  );
}

function pickPrimaryTag(
  selected: LegalMemoryTagId[]
): LegalMemoryTagId | null {
  if (selected.length === 1) return selected[0]!;
  if (selected.includes("lease")) return "lease";
  if (selected.includes("nda")) return "nda";
  if (selected.includes("vendor")) return "vendor";
  return null;
}

export function buildLegalMemoryMock(params: {
  tagIds: LegalMemoryTagId[];
  query: string;
}): LegalMemoryMockResult {
  const q = params.query.trim() || "港区 賃貸 解約";
  const qSnippet = q.length > 28 ? `${q.slice(0, 28)}…` : q;
  const searchScope = getSearchScopeLabel(params.tagIds);
  const primary = pickPrimaryTag(params.tagIds);
  const hits = orderHits(primary, qSnippet);

  const summarySegments: LegalMemorySummarySegment[] = [
    {
      text: "【賃貸】港区物件の契約では、解約は「3か月前の書面通知」が繰り返し要件として出てきます。",
      hitId: "hit-lease",
    },
    { text: " " },
    {
      text: "【NDA】秘密保持の終了後対応は、返還・破棄を30日以内とする条項が標準テンプレにあります。",
      hitId: "hit-nda",
    },
    { text: " " },
    {
      text: "【委託】基本契約側は30日前の書面解約が原則で、重大不履行時は即時解除の但書があります。",
      hitId: "hit-vendor",
    },
    { text: `（入力要約: ${qSnippet}）` },
  ];

  const internal =
    primary === "nda"
      ? "次: NDA第8条の電子媒体但書を顧問メモに1行追記。賃貸は今回スコープ外。"
      : primary === "vendor"
        ? "次: 委託契約PDFの第15条但書を開き、即時解除トリガーを一覧化。"
        : "次: 該当物件の最新版契約PDFを開き、第12条の但書を確認。顧問へは引用2件のみ添付でOK。";

  const integratedAnswer =
    primary === "nda"
      ? "NDA終了後の対応は、原則として返還・破棄を30日以内に行う条項が中心です。電子媒体の場合の消去証跡提出もあわせて確認し、必要なら顧問へ該当の但書を一行追記するとスムーズです。"
      : primary === "vendor"
        ? "業務委託基本契約は、原則として30日前の書面通知で解約が可能です。重大な債務不履行時は即時解除があり得るため、想定事象の分類（不履行の種類）を先に揃えるのが安全です。"
        : "賃貸借契約の解約は、原則として契約満了の3か月前までに書面で意思表示を行う要件が繰り返し現れます。事業用の特約・別紙が優先されるため、今回の入力条件に該当する但書を優先して読み解くと実用性が上がります。";

  const lawCheckStatusLabel = "法務チェック済み";
  const lawCheckNote =
    "引用条文の要点を統合し、例外（事業用特約/電子媒体/重大不履行）に触れる形で整理しています。";

  return {
    searchScope,
    hits,
    summarySegments,
    internal,
    integratedAnswer,
    lawCheckStatusLabel,
    lawCheckNote,
  };
}
