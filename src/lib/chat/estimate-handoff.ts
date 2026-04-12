import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { estimateSnapshotSchema } from "@/lib/estimate/estimate-snapshot";
import {
  decodeHandoffPayload,
  encodeHandoffPayload,
} from "@/lib/estimate-core/handoff-codec";
import type { ConciergeTrack, FlowSelection } from "@/lib/chat/concierge-flow";
import type { ConciergeDomainId } from "@/lib/demo/intelligent-concierge";
import {
  CONCIERGE_DOMAIN_OPTIONS,
  getConciergeDomainDetailLabel,
} from "@/lib/demo/intelligent-concierge";
import type { VisitorJourneySummary } from "@/lib/journey/visitor-journey";
import { visitorJourneySummarySchema } from "@/lib/journey/visitor-journey";

const HANDOFF_V1 = 1 as const;
const HANDOFF_V2 = 2 as const;
const CTX_V1 = 1 as const;

/** URLが長くなりすぎる場合に sessionStorage へ退避するときの query 値 */
export const CONTACT_HANDOFF_SESSION_QUERY = "session";
export const CONTACT_HANDOFF_STORAGE_KEY = "rinopro_contact_handoff_payload_v1";

/** 問い合わせフォームへ：コンシェルジュ完了時 */
export interface ChatHandoffPayloadV1 {
  v: typeof HANDOFF_V1;
  track: ConciergeTrack;
  trackLabel: string;
  path: FlowSelection[];
  detailBlock: string;
  visitorJourney?: VisitorJourneySummary;
}

/** 問い合わせフォームへ：詳細見積もりページ完了時（現在形式） */
export interface ChatHandoffPayloadV2 {
  v: typeof HANDOFF_V2;
  source: "estimate_detailed";
  snapshot: EstimateSnapshot;
}

/** 旧URL互換（スナップショット導入前） */
export interface ChatHandoffPayloadV2Legacy {
  v: typeof HANDOFF_V2;
  source: "estimate_detailed";
  requirementDoc: string;
  estimateLoMan: number;
  estimateHiMan: number;
  answersSummary: string;
}

export type ChatHandoffPayload =
  | ChatHandoffPayloadV1
  | ChatHandoffPayloadV2
  | ChatHandoffPayloadV2Legacy;

const CONCIERGE_DOMAIN_IDS = new Set<ConciergeDomainId>(
  CONCIERGE_DOMAIN_OPTIONS.map((o) => o.id)
);

/** トップ／一覧コンシェルジュから詳細見積へ渡す業種（任意） */
export interface ConciergeIndustryBundle {
  domainId: ConciergeDomainId;
  domainDetailId?: string | null;
  note?: string | null;
}

/** 詳細見積もりページの入口：コンシェルジュからのコンテキスト */
export interface ConciergeEstimateContextPayload {
  v: typeof CTX_V1;
  track: ConciergeTrack;
  path: FlowSelection[];
  detailBlock: string;
  /** 後方互換: 未設定の旧 URL は従来どおり */
  industryBundle?: ConciergeIndustryBundle;
  visitorJourney?: VisitorJourneySummary;
}

export function encodeChatHandoff(payload: ChatHandoffPayload): string {
  return encodeHandoffPayload(payload);
}

function isV2Legacy(
  parsed: Record<string, unknown>
): parsed is Record<string, unknown> & ChatHandoffPayloadV2Legacy {
  if (parsed.snapshot != null) return false;
  return (
    typeof parsed.requirementDoc === "string" &&
    typeof parsed.estimateLoMan === "number" &&
    typeof parsed.estimateHiMan === "number" &&
    typeof parsed.answersSummary === "string"
  );
}

export function decodeChatHandoff(raw: string): ChatHandoffPayload | null {
  try {
    const parsed = decodeHandoffPayload(raw);
    if (!parsed) return null;
    if (parsed.v === HANDOFF_V2 && parsed.source === "estimate_detailed") {
      if (parsed.snapshot != null) {
        const checked = estimateSnapshotSchema.safeParse(parsed.snapshot);
        if (checked.success) {
          return {
            v: HANDOFF_V2,
            source: "estimate_detailed",
            snapshot: checked.data,
          };
        }
        return null;
      }
      if (isV2Legacy(parsed)) {
        return {
          v: HANDOFF_V2,
          source: "estimate_detailed",
          requirementDoc: parsed.requirementDoc,
          estimateLoMan: parsed.estimateLoMan,
          estimateHiMan: parsed.estimateHiMan,
          answersSummary: parsed.answersSummary,
        };
      }
      return null;
    }
    if (parsed.v === HANDOFF_V1) {
      const p = parsed as unknown as ChatHandoffPayloadV1;
      if (
        p.track &&
        p.trackLabel &&
        Array.isArray(p.path) &&
        typeof p.detailBlock === "string"
      ) {
        return p;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function encodeConciergeEstimateContext(
  payload: ConciergeEstimateContextPayload
): string {
  return encodeHandoffPayload(payload);
}

function parseIndustryBundle(
  raw: unknown
): ConciergeIndustryBundle | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const domainId = o.domainId;
  if (
    typeof domainId !== "string" ||
    !CONCIERGE_DOMAIN_IDS.has(domainId as ConciergeDomainId)
  ) {
    return undefined;
  }
  const domainDetailId =
    o.domainDetailId == null
      ? undefined
      : typeof o.domainDetailId === "string"
        ? o.domainDetailId
        : undefined;
  const note =
    o.note == null ? undefined : typeof o.note === "string" ? o.note : undefined;
  return {
    domainId: domainId as ConciergeDomainId,
    domainDetailId,
    note,
  };
}

function parseVisitorJourneySummary(raw: unknown): VisitorJourneySummary | undefined {
  const checked = visitorJourneySummarySchema.safeParse(raw);
  return checked.success ? checked.data : undefined;
}

export function decodeConciergeEstimateContext(
  raw: string
): ConciergeEstimateContextPayload | null {
  try {
    const parsed = decodeHandoffPayload(raw);
    if (!parsed) return null;
    if (
      parsed?.v === CTX_V1 &&
      parsed.track &&
      Array.isArray(parsed.path) &&
      typeof parsed.detailBlock === "string"
    ) {
      const industryBundle = parseIndustryBundle(parsed.industryBundle);
      const visitorJourney = parseVisitorJourneySummary(parsed.visitorJourney);
      const out: ConciergeEstimateContextPayload = {
        v: CTX_V1,
        track: parsed.track as ConciergeTrack,
        path: parsed.path as FlowSelection[],
        detailBlock: parsed.detailBlock as string,
      };
      if (industryBundle) out.industryBundle = industryBundle;
      if (visitorJourney) out.visitorJourney = visitorJourney;
      return out;
    }
    return null;
  } catch {
    return null;
  }
}

const TRACK_LABELS: Record<ConciergeTrack, string> = {
  A: "開発コスト",
  B: "契約・コンサル費用",
  C: "開発技術",
  D: "ツール内容",
  E: "依頼方法",
};

function industryBundleSummaryLine(bundle: ConciergeIndustryBundle): string {
  const domLabel =
    CONCIERGE_DOMAIN_OPTIONS.find((o) => o.id === bundle.domainId)?.label ??
    bundle.domainId;
  const parts = [domLabel];
  const d = getConciergeDomainDetailLabel(
    bundle.domainId,
    bundle.domainDetailId
  );
  if (d) parts.push(d);
  let line = parts.join(" — ");
  const note = bundle.note?.trim();
  if (note) line += `（補足: ${note}）`;
  return line;
}

/** 概算見積（コンシェルジュ）からの文脈を、画面上で見せやすい形にする */
export function summarizeConciergeEstimateContextForDisplay(
  ctx: ConciergeEstimateContextPayload
): {
  trackLabel: string;
  steps: { title: string; answerLine: string }[];
  freeNotes: string;
} {
  const pathSteps = ctx.path.map((p) => ({
    title: p.stepTitle,
    answerLine: p.freeform?.trim()
      ? `${p.label}（追記: ${p.freeform.trim()}）`
      : p.label,
  }));
  if (ctx.industryBundle) {
    pathSteps.unshift({
      title: "事業領域",
      answerLine: industryBundleSummaryLine(ctx.industryBundle),
    });
  }
  return {
    trackLabel: TRACK_LABELS[ctx.track],
    steps: pathSteps,
    freeNotes: ctx.detailBlock.trim(),
  };
}

export function buildContactHandoffUrl(payload: ChatHandoffPayload): string {
  const encoded = encodeChatHandoff(payload);
  const params = new URLSearchParams({ handoff: encoded });
  return `/contact?${params.toString()}`;
}

/** 推奨: 長い場合は sessionStorage + ?handoff=session */
export function buildContactHandoffNavigation(
  payload: ChatHandoffPayload,
  maxEncodedLength = 2400
): { href: string; storeInSession: boolean } {
  const encoded = encodeChatHandoff(payload);
  if (encoded.length > maxEncodedLength) {
    return {
      href: `/contact?handoff=${encodeURIComponent(CONTACT_HANDOFF_SESSION_QUERY)}`,
      storeInSession: true,
    };
  }
  return { href: buildContactHandoffUrl(payload), storeInSession: false };
}

export function storeHandoffPayloadInSession(payload: ChatHandoffPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CONTACT_HANDOFF_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export function consumeHandoffPayloadFromSession(): ChatHandoffPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CONTACT_HANDOFF_STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(CONTACT_HANDOFF_STORAGE_KEY);
    const parsed = JSON.parse(raw) as ChatHandoffPayload;
    if (parsed.v === HANDOFF_V2 && parsed.source === "estimate_detailed") {
      if ("snapshot" in parsed && parsed.snapshot) {
        const checked = estimateSnapshotSchema.safeParse(parsed.snapshot);
        if (checked.success) {
          return { v: HANDOFF_V2, source: "estimate_detailed", snapshot: checked.data };
        }
        return null;
      }
      const rec = parsed as unknown as Record<string, unknown>;
      if (isV2Legacy(rec)) {
        return {
          v: HANDOFF_V2,
          source: "estimate_detailed",
          requirementDoc: rec.requirementDoc,
          estimateLoMan: rec.estimateLoMan,
          estimateHiMan: rec.estimateHiMan,
          answersSummary: rec.answersSummary,
        };
      }
    }
    if (parsed.v === HANDOFF_V1) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function buildEstimateDetailedEntryUrl(
  ctx: ConciergeEstimateContextPayload
): string {
  const encoded = encodeConciergeEstimateContext(ctx);
  return `/estimate-detailed?ctx=${encodeURIComponent(encoded)}`;
}

export function buildHandoffPayloadV1(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string,
  visitorJourney?: VisitorJourneySummary | null
): ChatHandoffPayloadV1 {
  return {
    v: HANDOFF_V1,
    track,
    trackLabel: TRACK_LABELS[track],
    path,
    detailBlock,
    ...(visitorJourney ? { visitorJourney } : {}),
  };
}

export function buildEstimateContextPayload(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string,
  industryBundle?: ConciergeIndustryBundle | null,
  visitorJourney?: VisitorJourneySummary | null
): ConciergeEstimateContextPayload {
  const out: ConciergeEstimateContextPayload = {
    v: CTX_V1,
    track,
    path,
    detailBlock,
  };
  if (industryBundle) out.industryBundle = industryBundle;
  if (visitorJourney) out.visitorJourney = visitorJourney;
  return out;
}

export function buildHandoffPayloadV2FromDetailed(
  snapshot: EstimateSnapshot
): ChatHandoffPayloadV2 {
  return {
    v: HANDOFF_V2,
    source: "estimate_detailed",
    snapshot,
  };
}

/** 問い合わせフォームのメッセージ欄用ドラフト */
export function buildContactMessageDraft(payload: ChatHandoffPayload): string {
  if (payload.v === HANDOFF_V2 && payload.source === "estimate_detailed") {
    if ("snapshot" in payload && payload.snapshot) {
      const { snapshot } = payload;
      return [
        "【詳細見積もりページからのお問い合わせ】",
        "",
        "（この上に、追加で伝えたいことを書いてください）",
        "",
        "--- 以下は自動メモです ---",
        "",
        snapshot.ai.plainCustomerSummary,
        "",
        `金額の目安: 約${snapshot.ai.estimateLoMan}万円〜${snapshot.ai.estimateHiMan}万円程度`,
        "",
        "--- 開発に向けた内容の整理（自動） ---",
        "",
        snapshot.requirementDocMarkdown,
        "",
        "---",
        "※ 正式なお見積もりではありません。内容は返信前にすり合わせます。",
      ].join("\n");
    }
    const legacy = payload as ChatHandoffPayloadV2Legacy;
    return [
      "【詳細見積もりからの引き継ぎ】",
      "",
      legacy.answersSummary,
      "",
      "--- 開発に向けた内容の整理（自動） ---",
      "",
      legacy.requirementDoc,
      "",
      `金額の目安: 約${legacy.estimateLoMan}万円〜${legacy.estimateHiMan}万円程度`,
      "",
      "---",
      "追加のご希望があれば、この上にご記入ください。",
    ].join("\n");
  }
  if (payload.v === HANDOFF_V1) {
    const lines = [
      "【AIコンシェルジュからの引き継ぎ】",
      "",
      `ご用件: ${payload.trackLabel}（トラック ${payload.track}）`,
      "",
      payload.visitorJourney
        ? `サイト内の文脈: ${payload.visitorJourney.journeySummary}`
        : "",
      payload.visitorJourney ? "" : null,
      payload.detailBlock,
      "",
      "---",
      "上記はチャット上の選択に基づくたたき台です。追加のご要望があれば続けてご記入ください。",
    ];
    return lines.join("\n");
  }
  return "";
}

/** @deprecated 互換: V1 のみ生成 */
export function buildHandoffPayload(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string
): ChatHandoffPayloadV1 {
  return buildHandoffPayloadV1(track, path, detailBlock);
}
