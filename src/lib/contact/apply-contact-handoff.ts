import {
  buildContactMessageDraft,
  buildHandoffPayloadV2FromDetailed,
  CONTACT_FROM_ESTIMATE_QUERY,
  CONTACT_FROM_ESTIMATE_VALUE,
  CONTACT_HANDOFF_SESSION_QUERY,
  CONTACT_PREFILL_QUERY,
  CONTACT_PREFILL_SESSION_MARKER,
  decodeChatHandoff,
  type ChatHandoffPayload,
} from "@/lib/chat/estimate-handoff";
import { buildEstimateSnapshotFromFlow } from "@/lib/estimate/build-estimate-snapshot-from-flow";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import type { EstimateDetailedFlowState } from "@/lib/estimate/estimate-detailed-session";

const ESTIMATE_MESSAGE_FALLBACK =
  "詳細見積もりの内容について相談したいです。";

export type ContactHandoffResult =
  | {
      status: "estimate_ok";
      snapshot: EstimateSnapshot;
      messageDraft: string;
      source: "handoff" | "flow_recovery";
    }
  | {
      status: "concierge_ok";
      messageDraft: string;
    }
  | {
      status: "estimate_failed";
      reason: "missing_storage" | "invalid_snapshot" | "flow_incomplete";
    }
  | { status: "none" };

export interface ContactHandoffStorage {
  peekPrefill: () => string | null;
  peekSnapshot: () => EstimateSnapshot | null;
  peekHandoffPayload: () => ChatHandoffPayload | null;
  readEstimateFlow: () => EstimateDetailedFlowState | null;
}

function decodePrefillParam(raw: string): string {
  if (raw === CONTACT_PREFILL_SESSION_MARKER) {
    return "";
  }
  try {
    return decodeURIComponent(raw);
  } catch {
    return "";
  }
}

function ensureMessageDraft(
  snapshot: EstimateSnapshot,
  draft: string
): string {
  const trimmed = draft.trim();
  if (trimmed.length >= 8) return trimmed;
  const generated = buildContactMessageDraft(
    buildHandoffPayloadV2FromDetailed(snapshot)
  ).trim();
  if (generated.length >= 8) return generated;
  if (trimmed.length > 0) {
    return `${ESTIMATE_MESSAGE_FALLBACK}\n\n${trimmed}`;
  }
  return ESTIMATE_MESSAGE_FALLBACK;
}

function snapshotFromHandoffPayload(
  payload: ChatHandoffPayload
): EstimateSnapshot | null {
  if (payload.v !== 2 || payload.source !== "estimate_detailed") return null;
  if ("snapshot" in payload && payload.snapshot) {
    return payload.snapshot;
  }
  return null;
}

function resolveEstimateHandoff(
  storage: ContactHandoffStorage,
  prefillRaw: string | null
): ContactHandoffResult {
  let messageDraft = "";
  if (prefillRaw != null) {
    if (prefillRaw === CONTACT_PREFILL_SESSION_MARKER) {
      messageDraft = storage.peekPrefill()?.trim() ?? "";
    } else {
      messageDraft = decodePrefillParam(prefillRaw).trim();
    }
  }

  let snapshot = storage.peekSnapshot();
  let source: "handoff" | "flow_recovery" = "handoff";

  if (!snapshot) {
    const flow = storage.readEstimateFlow();
    if (flow) {
      snapshot = buildEstimateSnapshotFromFlow(flow);
      if (snapshot) source = "flow_recovery";
    }
  }

  if (snapshot) {
    return {
      status: "estimate_ok",
      snapshot,
      messageDraft: ensureMessageDraft(snapshot, messageDraft),
      source,
    };
  }

  return {
    status: "estimate_failed",
    reason: prefillRaw === CONTACT_PREFILL_SESSION_MARKER ? "missing_storage" : "flow_incomplete",
  };
}

function resolveHandoffParam(
  storage: ContactHandoffStorage,
  handoffRaw: string
): ContactHandoffResult {
  if (handoffRaw === CONTACT_HANDOFF_SESSION_QUERY) {
    const payload = storage.peekHandoffPayload();
    if (!payload) {
      return { status: "none" };
    }
    const snapshot = snapshotFromHandoffPayload(payload);
    if (snapshot) {
      const messageDraft = ensureMessageDraft(
        snapshot,
        buildContactMessageDraft(payload)
      );
      return {
        status: "estimate_ok",
        snapshot,
        messageDraft,
        source: "handoff",
      };
    }
    const draft = buildContactMessageDraft(payload).trim();
    if (draft.length > 0) {
      return { status: "concierge_ok", messageDraft: draft };
    }
    return { status: "none" };
  }

  const payload = decodeChatHandoff(handoffRaw);
  if (!payload) {
    return { status: "none" };
  }

  const snapshot = snapshotFromHandoffPayload(payload);
  if (snapshot) {
    return {
      status: "estimate_ok",
      snapshot,
      messageDraft: ensureMessageDraft(
        snapshot,
        buildContactMessageDraft(payload)
      ),
      source: "handoff",
    };
  }

  const draft = buildContactMessageDraft(payload).trim();
  if (draft.length > 0) {
    return { status: "concierge_ok", messageDraft: draft };
  }
  return { status: "none" };
}

export function applyContactHandoff(
  searchParams: Pick<URLSearchParams, "get">,
  storage: ContactHandoffStorage
): ContactHandoffResult {
  const prefillRaw = searchParams.get(CONTACT_PREFILL_QUERY);
  const handoffRaw = searchParams.get("handoff");
  const fromEstimate =
    searchParams.get(CONTACT_FROM_ESTIMATE_QUERY) === CONTACT_FROM_ESTIMATE_VALUE;

  const estimateIntent =
    fromEstimate || prefillRaw === CONTACT_PREFILL_SESSION_MARKER;

  if (estimateIntent) {
    return resolveEstimateHandoff(storage, prefillRaw);
  }

  if (handoffRaw) {
    return resolveHandoffParam(storage, handoffRaw);
  }

  if (prefillRaw) {
    const messageDraft =
      prefillRaw === CONTACT_PREFILL_SESSION_MARKER
        ? (storage.peekPrefill()?.trim() ?? "")
        : decodePrefillParam(prefillRaw).trim();
    if (messageDraft.length > 0) {
      return { status: "concierge_ok", messageDraft };
    }
  }

  return { status: "none" };
}
