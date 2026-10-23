import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildEstimateSnapshotFromFlow } from "../../src/lib/estimate/build-estimate-snapshot-from-flow";
import { buildContactMessageDraft, buildHandoffPayloadV2FromDetailed } from "../../src/lib/chat/estimate-handoff";
import { applyContactHandoff } from "../../src/lib/contact/apply-contact-handoff";
import { buildAdminContactAttachments } from "../../src/lib/contact/build-contact-mail-attachments";
import { contactSchema } from "../../src/lib/validation/contact-schema";
import type { EstimateDetailedFlowState } from "../../src/lib/estimate/estimate-detailed-session";

const flow: EstimateDetailedFlowState = {
  v: 1, ctxQuery: null, priorContext: "", visitorJourney: null, inquiryPreparation: null,
  answers: { 業種: "調査用" },
  ai: {
    requirementTitle: "調査用の長い要件",
    requirementDefinitionDocument: "要".repeat(7000),
    scopeIn: [], scopeOut: [], openQuestions: [], regulatoryNotes: [],
    assumptions: ["調査用"], followUpItems: [], estimateDrivers: [],
    plainCustomerSummary: "調査用の見積もり・要件定義です。", estimateLoMan: 80, estimateHiMan: 120,
  },
};
const snapshot = buildEstimateSnapshotFromFlow(flow);
assert.ok(snapshot);
const fullDraft = buildContactMessageDraft(buildHandoffPayloadV2FromDetailed(snapshot));
const longValidation = contactSchema.safeParse({ name: "調査用", email: "audit@example.com", message: fullDraft, estimateSnapshot: snapshot });
assert.equal(longValidation.success, false);
const shortValidation = contactSchema.safeParse({ name: "調査用", email: "audit@example.com", message: "作成した見積もり・要件について相談したいです。", estimateSnapshot: snapshot });
assert.equal(shortValidation.success, true);
assert.equal(buildAdminContactAttachments(snapshot).length, 2);
assert.equal(buildAdminContactAttachments(undefined).length, 0);
const storage = { peekPrefill: () => null, peekSnapshot: () => snapshot, peekHandoffPayload: () => null, readEstimateFlow: () => flow };
assert.equal(applyContactHandoff(new URLSearchParams(), storage).status, "none");
assert.equal(applyContactHandoff(new URLSearchParams("from=estimate"), storage).status, "estimate_ok");
const result = {
  validFlowWithoutSourceMarker: "none",
  validFlowWithSourceMarker: "estimate_ok",
  generatedFullDraftLength: fullDraft.length,
  fullDraftValidationErrors: longValidation.success ? [] : longValidation.error.issues.map(e => ({ path: e.path, message: e.message })),
  shortMessageWithFullSnapshotValid: shortValidation.success,
  attachmentCountWithSnapshot: 2,
  attachmentCountWithoutSnapshot: 0,
};
writeFileSync(join(__dirname, "logic-results.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
