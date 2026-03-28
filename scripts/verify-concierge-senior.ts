/**
 * シニア発火ロジックの簡易検証（tsx scripts/verify-concierge-senior.ts）
 */
import type { UIMessage } from "ai";
import {
  detectPostWizardUserMessage,
  inferSeniorEngagement,
  SENIOR_MIN_MESSAGE_LENGTH,
} from "../src/lib/ai/concierge-senior";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

function u(text: string): UIMessage {
  return {
    id: "u",
    role: "user",
    parts: [{ type: "text", text }],
  } as UIMessage;
}

function a(text: string): UIMessage {
  return {
    id: "a",
    role: "assistant",
    parts: [{ type: "text", text }],
  } as UIMessage;
}

// 39文字は発火しない（閾値40）
const short39 = "あ".repeat(39);
assert(
  !inferSeniorEngagement({
    messages: [u(short39)],
    mode: "development",
    pageContext: "services",
  }),
  "39 chars alone should not senior"
);

// 40文字で development は発火
const long40 = "あ".repeat(40);
assert(
  inferSeniorEngagement({
    messages: [u(long40)],
    mode: "development",
    pageContext: "services",
  }),
  "40 chars on development should senior"
);

// default + top は短くても発火しない
assert(
  !inferSeniorEngagement({
    messages: [u(long40)],
    mode: "default",
    pageContext: "top",
  }),
  "default top should not senior on 40 chars only"
);

// default + demo は40文字で発火
assert(
  inferSeniorEngagement({
    messages: [u(long40)],
    mode: "default",
    pageContext: "demo",
  }),
  "default demo should senior on 40 chars"
);

// キーワード2つ
assert(
  inferSeniorEngagement({
    messages: [u("基幹システムと連携したい課題があります")],
    mode: "development",
    pageContext: "services",
  }),
  "2+ keywords should senior"
);

// プリセット後の2通目
assert(
  detectPostWizardUserMessage([u("開発できるものを知りたい"), a("x"), u("請求を自動化したい")]),
  "detectPostWizard"
);

assert(
  inferSeniorEngagement({
    messages: [u("開発できるものを知りたい"), a("template"), u("a")],
    mode: "development",
    pageContext: "services",
  }),
  "post-wizard short 3rd message should senior (structure)"
);

// postPreset シグナル
assert(
  inferSeniorEngagement({
    messages: [u("hi")],
    mode: "development",
    pageContext: "services",
    signals: { postPreset: true },
  }),
  "postPreset should senior even short"
);

assert(SENIOR_MIN_MESSAGE_LENGTH === 40, "min length constant");

console.log("verify-concierge-senior: OK");
