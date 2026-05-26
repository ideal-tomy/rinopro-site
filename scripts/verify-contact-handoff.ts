/**
 * 問い合わせ引き継ぎロジックのスモーク検証
 * 実行: npx tsx scripts/verify-contact-handoff.ts
 */

import {
  applyContactHandoff,
  type ContactHandoffStorage,
} from "../src/lib/contact/apply-contact-handoff";
import {
  CONTACT_FROM_ESTIMATE_QUERY,
  CONTACT_FROM_ESTIMATE_VALUE,
  CONTACT_PREFILL_QUERY,
  CONTACT_PREFILL_SESSION_MARKER,
} from "../src/lib/chat/estimate-handoff";
import type { EstimateSnapshot } from "../src/lib/estimate/estimate-snapshot";
import type { EstimateDetailedFlowState } from "../src/lib/estimate/estimate-detailed-session";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const sampleSnapshot: EstimateSnapshot = {
  schemaVersion: 1,
  source: "estimate_detailed",
  createdAt: new Date().toISOString(),
  answers: { 業種: "テスト" },
  ai: {
    requirementTitle: "テスト案件",
    requirementDefinitionDocument: "## 要件",
    scopeIn: [],
    scopeOut: [],
    openQuestions: [],
    regulatoryNotes: [],
    assumptions: ["前提"],
    followUpItems: [],
    estimateDrivers: [],
    plainCustomerSummary: "概要テストです。十分な長さの文章。",
    estimateLoMan: 80,
    estimateHiMan: 120,
  },
  requirementDocMarkdown: "# テスト\n\n本文",
};

const sampleFlow: EstimateDetailedFlowState = {
  v: 1,
  ctxQuery: null,
  priorContext: "",
  answers: { 業種: "テスト" },
  ai: sampleSnapshot.ai,
  visitorJourney: null,
  inquiryPreparation: null,
};

function mockStorage(overrides: Partial<ContactHandoffStorage> = {}): ContactHandoffStorage {
  return {
    peekPrefill: () => null,
    peekSnapshot: () => null,
    peekHandoffPayload: () => null,
    readEstimateFlow: () => null,
    ...overrides,
  };
}

function params(init: Record<string, string>): URLSearchParams {
  return new URLSearchParams(init);
}

function run(): void {
  const emptyPrefillSnapshot = applyContactHandoff(
    params({
      [CONTACT_PREFILL_QUERY]: CONTACT_PREFILL_SESSION_MARKER,
      [CONTACT_FROM_ESTIMATE_QUERY]: CONTACT_FROM_ESTIMATE_VALUE,
    }),
    mockStorage({
      peekSnapshot: () => sampleSnapshot,
      peekPrefill: () => "",
    })
  );
  assert(emptyPrefillSnapshot.status === "estimate_ok", "prefill empty + snapshot");
  assert(
    emptyPrefillSnapshot.status === "estimate_ok" &&
      emptyPrefillSnapshot.messageDraft.length >= 8,
    "message draft from snapshot"
  );

  const flowRecovery = applyContactHandoff(
    params({
      [CONTACT_FROM_ESTIMATE_QUERY]: CONTACT_FROM_ESTIMATE_VALUE,
    }),
    mockStorage({
      readEstimateFlow: () => sampleFlow,
    })
  );
  assert(
    flowRecovery.status === "estimate_ok" && flowRecovery.source === "flow_recovery",
    "flow recovery"
  );

  const failed = applyContactHandoff(
    params({
      [CONTACT_FROM_ESTIMATE_QUERY]: CONTACT_FROM_ESTIMATE_VALUE,
    }),
    mockStorage()
  );
  assert(failed.status === "estimate_failed", "estimate_failed");

  const concierge = applyContactHandoff(
    params({ [CONTACT_PREFILL_QUERY]: encodeURIComponent("コンシェルジュ下書きテストです。") }),
    mockStorage()
  );
  assert(concierge.status === "concierge_ok", "concierge prefill");

  console.log("verify-contact-handoff: OK");
}

run();
