import type { ConciergeTrack, FlowSelection } from "@/lib/chat/concierge-flow";

const HANDOFF_VERSION = 1 as const;

export interface ChatHandoffPayload {
  v: typeof HANDOFF_VERSION;
  track: ConciergeTrack;
  /** 画面表示用のトラック名 */
  trackLabel: string;
  path: FlowSelection[];
  /** A/B の概算ブロック、CDE の案内ブロック */
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
    const parsed = JSON.parse(base64UrlToUtf8(raw)) as ChatHandoffPayload;
    if (parsed?.v !== HANDOFF_VERSION || !parsed.track || !Array.isArray(parsed.path)) {
      return null;
    }
    return parsed;
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

export function buildHandoffPayload(
  track: ConciergeTrack,
  path: FlowSelection[],
  detailBlock: string
): ChatHandoffPayload {
  return {
    v: HANDOFF_VERSION,
    track,
    trackLabel: TRACK_LABELS[track],
    path,
    detailBlock,
  };
}

/** 問い合わせフォームのメッセージ欄用ドラフト */
export function buildContactMessageDraft(payload: ChatHandoffPayload): string {
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
