import type { ConciergeMode } from "@/components/chat/concierge-chat-context";
import { isDemoExperienceWizardPath } from "@/lib/chat/concierge-demo-hub-policy";
import type { ConciergeChatSurface } from "@/lib/chat/concierge-session-id";

export type ConciergeMainPanelBranch =
  | { kind: "messages" }
  | { kind: "entryPicker" }
  | { kind: "homeFlow" }
  | { kind: "servicesIntro" }
  | { kind: "serviceCardStart" }
  | { kind: "demoRouteFlow" }
  | { kind: "empty" };

export type ConciergePanelDerivedInput = {
  pathname: string;
  messagesLength: number;
  conciergeSurface: ConciergeChatSurface;
  mode: ConciergeMode;
  servicesIntroComplete: boolean;
  serviceCardStartDone: boolean;
  isServiceCardDirect: boolean;
  entrySource: string;
};

export type ConciergePanelDerivedState = ConciergePanelDerivedInput & {
  isHomePage: boolean;
  showGlobalHomeFlow: boolean;
  showEntryPicker: boolean;
  neutralServicesFabEntry: boolean;
  showDemoRouteFlow: boolean;
  isServiceWizardPage: boolean;
  showServiceCardStartFlow: boolean;
  mainBranch: ConciergeMainPanelBranch;
};

/**
 * ChatContainer の mainContent 分岐とレイアウト用フラグを一括算出（純粋関数）。
 */
export function getConciergePanelDerivedState(
  input: ConciergePanelDerivedInput
): ConciergePanelDerivedState {
  const {
    pathname,
    messagesLength,
    conciergeSurface,
    mode,
    servicesIntroComplete,
    serviceCardStartDone,
    isServiceCardDirect,
    entrySource,
  } = input;

  const isHomePage = pathname === "/";
  const showGlobalHomeFlow =
    messagesLength === 0 &&
    (conciergeSurface === "global" ||
      (isHomePage && conciergeSurface === "pick"));
  const showEntryPicker =
    messagesLength === 0 &&
    conciergeSurface === "pick" &&
    !isHomePage &&
    !isServiceCardDirect;
  const neutralServicesFabEntry =
    pathname === "/services" && showEntryPicker && entrySource === "fab";
  const showDemoRouteFlow =
    messagesLength === 0 &&
    conciergeSurface === "page" &&
    isDemoExperienceWizardPath(pathname);
  const isServiceWizardPage =
    pathname === "/services" ||
    pathname === "/flow" ||
    pathname === "/consulting";
  const showServiceCardStartFlow =
    isServiceWizardPage &&
    servicesIntroComplete &&
    (mode === "development" || mode === "consulting") &&
    !serviceCardStartDone &&
    messagesLength === 0 &&
    (conciergeSurface === "page" || isServiceCardDirect);

  let mainBranch: ConciergeMainPanelBranch;
  if (messagesLength > 0) {
    mainBranch = { kind: "messages" };
  } else if (showEntryPicker) {
    mainBranch = { kind: "entryPicker" };
  } else if (showGlobalHomeFlow) {
    mainBranch = { kind: "homeFlow" };
  } else if (
    pathname === "/services" &&
    conciergeSurface === "page" &&
    !servicesIntroComplete
  ) {
    mainBranch = { kind: "servicesIntro" };
  } else if (showServiceCardStartFlow) {
    mainBranch = { kind: "serviceCardStart" };
  } else if (showDemoRouteFlow) {
    mainBranch = { kind: "demoRouteFlow" };
  } else {
    mainBranch = { kind: "empty" };
  }

  return {
    ...input,
    isHomePage,
    showGlobalHomeFlow,
    showEntryPicker,
    neutralServicesFabEntry,
    showDemoRouteFlow,
    isServiceWizardPage,
    showServiceCardStartFlow,
    mainBranch,
  };
}
