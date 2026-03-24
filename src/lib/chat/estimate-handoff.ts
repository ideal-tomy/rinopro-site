import type { ConciergeTrack, FlowSelection } from "@/lib/chat/concierge-flow";

const HANDOFF_V1 = 1 as const;
const HANDOFF_V2 = 2 as const;
const CTX_V1 = 1 as const;

/** 問い合わせフォームへ：コンシェルジュ完了時 */
export interface ChatHandoffPayloadV1 {
  v: typeof HANDOFF_V1;
  track: ConciergeTrack;
  trackLabel: string;
  path: FlowSelection[];
  detailBlock: string;
}

/** 問い合わせフォームへ：詳細見積もりページ完了時 */
export interface ChatHandoffPayloadV2 {
  v: typeof HANDOFF_V2;
  source: "estimate_detailed";
  requirementDoc: string;
  estimateLoMan: number;
  estimateHiMan: number;
  answersSummary: string;
}

export type ChatHandoffPayload = ChatHandoffPayloadV1 | ChatHandoffPayloadV2;

/** 詳細見積もりページの入口：コンシェルジュからのコンテキスト */
export interface ConciergeEstimateContextPayload {
  v: typeof CTX_V1;
  track: ConciergeTrack;
  path: FlowSelection[];
  detailBlock: string;
}

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) {
    bin += String.fromCharCode(b);
  }
  if (typeof btoa !== "function") {
    throw new Error("btoa is not available");
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(b64url: string): string {
  const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLen);
  if (typeof atob !== "function") {
    throw new Error("atob is not available");
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeChatHandoff(payload: ChatHandoffPayload): string {
  return utf8ToBase64Url(JSON.stringify(payload));
}

export function decodeChatHandoff(raw: string): ChatHandoffPayload | null {
  try {
    const parsed = JSON.parse(base64UrlToUtf8(raw)) as Record<string, unknown>;
    if (parsed.v === HANDOFF_V2 && parsed.source === "estimate_detailed") {
      const p = parsed as unknown as ChatHandoffPayloadV2;
      if (
        typeof p.requirementDoc === "string" &&
        typeof p.estimateLoMan === "number" &&
        typeof p.estimateHiMan === "number" &&
        typeof p.answersSummary === "string"
      ) {
        return p;
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
  return utf8ToBase64Url(JSON.stringify(payload));
}

export function decodeConciergeEstimateContext(
  raw: string
): ConciergeEstimateContextPayload | null {
  try {
    const parsed = JSON.parse(base64UrlToUtf8(raw)) as ConciergeEstimateContextPayload;
    if (
      parsed?.v === CTX_V1 &&
      parsed.track &&
      Array.isArray(parsed.path) &&
      typeof parsed.detailBlock === "string"
    ) {
      return parsed;
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

export function buildContactHandoffUrl(payload: ChatHandoffPayload): string {
  const encoded = encodeChatHandoff(payload);
  const params = new URLSearchParams({ handoff: encoded });
  return `/contact?${params.toString()}`;
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
  detailBlock: string
): ChatHandoffPayloadV1 {
  return {
    v: HANDOFF_V1,
    track,
    trackLabel: TRACK_LABELS[track],
    path,
    detailBlock,
  };
}

export function buildEstimateContextPayload(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string
): ConciergeEstimateContextPayload {
  return {
    v: CTX_V1,
    track,
    path,
    detailBlock,
  };
}

export function buildHandoffPayloadV2FromDetailed(args: {
  requirementDoc: string;
  estimateLoMan: number;
  estimateHiMan: number;
  answersSummary: string;
}): ChatHandoffPayloadV2 {
  return {
    v: HANDOFF_V2,
    source: "estimate_detailed",
    requirementDoc: args.requirementDoc,
    estimateLoMan: args.estimateLoMan,
    estimateHiMan: args.estimateHiMan,
    answersSummary: args.answersSummary,
  };
}

/** 問い合わせフォームのメッセージ欄用ドラフト */
export function buildContactMessageDraft(payload: ChatHandoffPayload): string {
  if (payload.v === HANDOFF_V2) {
    return [
      "【詳細見積もりからの引き継ぎ】",
      "",
      payload.answersSummary,
      "",
      "--- 仮要件定義（自動生成） ---",
      "",
      payload.requirementDoc,
      "",
      `概算レンジ（目安）: 約${payload.estimateLoMan}万円〜${payload.estimateHiMan}万円程度`,
      "",
      "---",
      "正式見積もり・追加ヒアリングのご希望があれば続けてご記入ください。",
    ].join("\n");
  }
  const lines = [
    "【AIコンシェルジュからの引き継ぎ】",
    "",
    `ご用件: ${payload.trackLabel}（トラック ${payload.track}）`,
    "",
    payload.detailBlock,
    "",
    "---",
    "上記はチャット上の選択に基づくたたき台です。追加のご要望があれば続けてご記入ください。",
  ];
  return lines.join("\n");
}

/** @deprecated 互換: V1 のみ生成 */
export function buildHandoffPayload(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string
): ChatHandoffPayloadV1 {
  return buildHandoffPayloadV1(track, path, detailBlock);
}
