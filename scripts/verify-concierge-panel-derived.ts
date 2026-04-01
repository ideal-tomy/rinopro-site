/**
 * getConciergePanelDerivedState のスモーク検証（リファクタ退行防止用）。
 * npx tsx scripts/verify-concierge-panel-derived.ts
 */
import assert from "node:assert/strict";
import { getConciergePanelDerivedState } from "../src/lib/chat/concierge-panel-derived-state";

const base = {
  pathname: "/",
  messagesLength: 0,
  conciergeSurface: "pick" as const,
  mode: "default" as const,
  servicesIntroComplete: false,
  serviceCardStartDone: false,
  isServiceCardDirect: false,
  entrySource: "fab",
};

const homeFlow = getConciergePanelDerivedState(base);
assert.equal(homeFlow.mainBranch.kind, "homeFlow");
assert.equal(homeFlow.showGlobalHomeFlow, true);

const homeMessages = getConciergePanelDerivedState({
  ...base,
  messagesLength: 1,
});
assert.equal(homeMessages.mainBranch.kind, "messages");

const servicesPicker = getConciergePanelDerivedState({
  ...base,
  pathname: "/about",
  conciergeSurface: "pick",
});
assert.equal(servicesPicker.mainBranch.kind, "entryPicker");

const demoSlugWizard = getConciergePanelDerivedState({
  ...base,
  pathname: "/demo/example-slug",
  conciergeSurface: "page",
});
assert.equal(demoSlugWizard.mainBranch.kind, "demoRouteFlow");

const experienceSlugWizard = getConciergePanelDerivedState({
  ...base,
  pathname: "/experience/internal-knowledge-share-bot",
  conciergeSurface: "page",
});
assert.equal(experienceSlugWizard.mainBranch.kind, "demoRouteFlow");

console.log("verify-concierge-panel-derived: ok");
