/**
 * 問い合わせメール（A/B/C）のスモーク検証
 * 実行: npm run verify:contact-mail
 */

import { buildAdminTriageSummary } from "../src/lib/contact/build-admin-triage-summary";
import { buildAdminContactAttachments } from "../src/lib/contact/build-contact-mail-attachments";
import {
  buildAdminContactEmail,
  buildCustomerContactEmail,
  type ContactMailContext,
} from "../src/lib/contact/mail-templates";
import {
  splitContactMessage,
  CONTACT_AUTO_MEMO_MARKER,
} from "../src/lib/contact/split-contact-message";
import type { EstimateSnapshot } from "../src/lib/estimate/estimate-snapshot";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const baseSnapshot: EstimateSnapshot = {
  schemaVersion: 1,
  source: "estimate_detailed",
  createdAt: "2026-05-26T12:00:00.000Z",
  answers: {
    何を作りたいですか: "Webアプリ",
    "いま困っていること・変えたいこと": "手作業が多い",
    "うまくいっていないこと": "入力ミス",
    "扱う情報に個人情報は含まれますか": "いいえ、含まれない想定",
    "気になること・制約": "個人情報を扱うためセキュリティが重要",
    "ご予算のイメージ": "相談して決めたい",
    "予算の補足": "安定運用重視",
  },
  ai: {
    requirementTitle: "建設業向けWebアプリ",
    requirementDefinitionDocument: "## 要件\n本文",
    scopeIn: ["既存システムとの連携"],
    scopeOut: [],
    openQuestions: [],
    regulatoryNotes: [],
    assumptions: ["前提1"],
    followUpItems: [
      { title: "連携先システム", description: "詳細確認" },
      { title: "業務プロセス", description: "詳細確認" },
      { title: "認証方式", description: "詳細確認" },
      { title: "デザイン", description: "詳細確認" },
      { title: "クラウド", description: "詳細確認" },
    ],
    estimateDrivers: [],
    plainCustomerSummary: "建設業の業務効率化の概要です。",
    estimateLoMan: 800,
    estimateHiMan: 2000,
  },
  requirementDocMarkdown: "# 建設業向け\n\n## 要件定義\n長文",
  visitorJourney: {
    visitorId: "test",
    interestBias: "demo_first",
    journeyDepth: "contact_ready",
    latestEntryIntent: "consult",
    viewedDemoSlugs: [],
    recentPageKinds: ["estimate", "contact"],
    journeySummary: "関心: demo_first / contact_ready",
    industryBundle: { domainId: "construction" },
  },
};

function baseCtx(overrides: Partial<ContactMailContext> = {}): ContactMailContext {
  return {
    name: "富井亮嗣",
    email: "test@example.com",
    company: "テスト",
    triedExperience: "社内ナレッジBOT",
    message: "",
    estimateSnapshot: baseSnapshot,
    visitorJourney: baseSnapshot.visitorJourney,
    ...overrides,
  };
}

function run(): void {
  const autoMemo = "--- 開発に向けた内容の整理 ---\n長い自動メモ";
  const message = [
    "【詳細見積もりページからのお問い合わせ】",
    "",
    "追記テストです。",
    "",
    CONTACT_AUTO_MEMO_MARKER,
    "",
    autoMemo,
  ].join("\n");

  const split = splitContactMessage(message);
  assert(split.userAdded.includes("追記テスト"), "split: userAdded");
  assert(split.autoMemo != null && split.autoMemo.includes("自動メモ"), "split: autoMemo");
  assert(split.hadEstimateHandoff, "split: estimate handoff flag");

  const triage = buildAdminTriageSummary(baseCtx({ message }));
  if (!triage) throw new Error("triage: exists");
  assert(triage.includes("800"), "triage: range");
  assert(
    triage.includes("Webアプリ") || triage.includes("建設"),
    "triage: product or industry"
  );
  assert(triage.includes("【注意】"), "triage: pii contradiction");

  const admin = buildAdminContactEmail(baseCtx({ message }));
  assert(admin.subject.includes("[整理済み]"), "admin subject");
  assert(admin.subject.includes("800-2000万"), "admin subject range");
  assert(admin.textBody.includes("▼ 案件サマリ"), "admin triage section");
  assert(!admin.textBody.includes(CONTACT_AUTO_MEMO_MARKER), "admin: no auto marker in body");
  assert(!admin.textBody.includes("## 要件定義"), "admin: no full markdown in body");
  assert(!admin.textBody.includes('"schemaVersion"'), "admin: no json in body");
  assert(admin.textBody.includes("追記テスト"), "admin: user added");
  assert(admin.attachments.length === 2, "admin: two attachments");

  const customer = buildCustomerContactEmail(baseCtx({ message }));
  assert(!customer.textBody.includes(CONTACT_AUTO_MEMO_MARKER), "customer: no auto memo");
  assert(!customer.textBody.includes("# 建設業向け"), "customer: no requirement md");
  assert(customer.textBody.includes("追記テスト"), "customer: user message");
  assert(customer.textBody.includes("800"), "customer: range");

  const plain = buildAdminContactEmail(
    baseCtx({ message: "通常の問い合わせ本文です。八文字以上。" })
  );
  assert(plain.attachments.length === 0 || plain.attachments.length === 2, "plain ctx attachments");

  const attachments = buildAdminContactAttachments(baseSnapshot);
  assert(attachments[0]?.filename.endsWith(".md"), "attachment md");
  assert(attachments[1]?.filename.endsWith(".json"), "attachment json");

  console.log("verify-contact-mail-triage: OK");
}

run();
