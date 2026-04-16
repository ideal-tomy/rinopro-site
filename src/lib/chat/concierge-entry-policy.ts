import type { ConciergeIntent } from "@/lib/ai/concierge-intent";
import type {
  ConciergeEntrySource,
  ConciergeMode,
} from "@/components/chat/concierge-chat-context";
import type { ConciergeSignals } from "@/lib/ai/concierge-senior";
import type { ConciergeChatSurface } from "@/lib/chat/concierge-session-id";
import { isDemoExperienceWizardPath } from "@/lib/chat/concierge-demo-hub-policy";
import type { ConciergeEntryChoice } from "@/components/chat/ConciergeEntryPicker";

export type ConciergeEntryPresetKey =
  | "homeConsult"
  | "servicesDevelopmentCard"
  | "servicesConsultingCard"
  | "demoListCompare";

type ConciergeEntryPreset = {
  mode: ConciergeMode;
  entrySource: ConciergeEntrySource;
  signals: Partial<ConciergeSignals>;
};

const CONCIERGE_ENTRY_PRESETS: Record<
  ConciergeEntryPresetKey,
  ConciergeEntryPreset
> = {
  homeConsult: {
    mode: "default",
    entrySource: "fab",
    signals: { entryIntent: "consult" },
  },
  servicesDevelopmentCard: {
    mode: "development",
    entrySource: "services-card-development",
    signals: { entryIntent: "consult" },
  },
  servicesConsultingCard: {
    mode: "consulting",
    entrySource: "services-card-consulting",
    signals: { entryIntent: "consult" },
  },
  demoListCompare: {
    mode: "default",
    entrySource: "fab",
    signals: { entryIntent: "compare" },
  },
};

export function getConciergeEntryPreset(
  key: ConciergeEntryPresetKey
): ConciergeEntryPreset {
  return CONCIERGE_ENTRY_PRESETS[key];
}

export function buildEntryIntentSignals(intent: ConciergeIntent) {
  return { entryIntent: intent } satisfies Partial<ConciergeSignals>;
}

export function resolveLauncherOpenState(pathname: string) {
  return {
    entrySource: "fab" as const,
    surface: (isDemoExperienceWizardPath(pathname) ? "page" : "pick") as ConciergeChatSurface,
    resetServicesMode: pathname === "/services",
  };
}

export function resolveEntryChoiceSurface(args: {
  pathname: string;
  choice: ConciergeEntryChoice;
}): {
  surface: ConciergeChatSurface;
  resetServicesMode: boolean;
} {
  const { pathname, choice } = args;
  if (choice === "global" || pathname === "/") {
    return {
      surface: "global",
      resetServicesMode: false,
    };
  }

  return {
    surface: "page",
    resetServicesMode: pathname === "/services",
  };
}

export function resolveDemoListSequenceOpen(pathname: string) {
  const host = pathname === "/demo/list" || pathname === "/demo";
  if (!host) return null;
  return {
    entrySource: "fab" as const,
    surface: "page" as const,
    shouldOpen: true,
  };
}

export function resolveDemoWizardCompletion(pathname: string) {
  return {
    shouldClose:
      pathname === "/demo/list" || pathname === "/demo",
    surface: "pick" as const,
    entrySource: "fab" as const,
  };
}
