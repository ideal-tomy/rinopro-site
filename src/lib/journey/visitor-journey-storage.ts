import type { ConciergeKpiDetail } from "@/lib/chat/concierge-analytics";
import type { ConciergeIntent } from "@/lib/ai/concierge-intent";
import type { EstimateFormDraft } from "@/lib/estimate/estimate-detailed-session";
import type { FreeformInputEnvelope } from "@/lib/freeform/freeform-input";
import {
  buildVisitorJourneySummary,
  detectVisitorJourneyPageKind,
  recordRecentPageKind,
  recordViewedDemoSlug,
  summarizeFreeformText,
  updateEstimateSignalsFromAnswers,
  visitorJourneyProfileSchema,
  type VisitorJourneyIndustryBundle,
  type VisitorJourneyProfile,
  type VisitorJourneySummary,
} from "@/lib/journey/visitor-journey";

const VISITOR_JOURNEY_STORAGE_KEY = "axeon:visitor-journey:v1";
const VISITOR_JOURNEY_SESSION_KEY = "axeon:visitor-journey:session";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function generateVisitorId(): string {
  const cryptoObject = globalThis.crypto;
  if (cryptoObject && "randomUUID" in cryptoObject) {
    return cryptoObject.randomUUID();
  }
  return `visitor_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyProfile(): VisitorJourneyProfile {
  const now = new Date().toISOString();
  const visitorId = generateVisitorId();
  return {
    version: 1,
    visitorId,
    firstSeenAt: now,
    lastSeenAt: now,
    pageViews: {},
    recentPageKinds: [],
    viewedDemoSlugs: [],
    estimateReachedCount: 0,
    contactReachedCount: 0,
  };
}

function readRawStorage(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(VISITOR_JOURNEY_STORAGE_KEY);
}

function writeRawStorage(value: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(VISITOR_JOURNEY_STORAGE_KEY, value);
  window.sessionStorage.setItem(VISITOR_JOURNEY_SESSION_KEY, value);
}

export function readVisitorJourneyProfile(): VisitorJourneyProfile | null {
  const raw = readRawStorage();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const result = visitorJourneyProfileSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function ensureVisitorJourneyProfile(): VisitorJourneyProfile {
  const existing = readVisitorJourneyProfile();
  if (existing) return existing;
  const created = createEmptyProfile();
  writeVisitorJourneyProfile(created);
  return created;
}

export function writeVisitorJourneyProfile(profile: VisitorJourneyProfile): void {
  if (!canUseStorage()) return;
  writeRawStorage(JSON.stringify(profile));
}

export function updateVisitorJourneyProfile(
  updater: (current: VisitorJourneyProfile) => VisitorJourneyProfile
): VisitorJourneyProfile {
  const current = ensureVisitorJourneyProfile();
  const next = updater(current);
  writeVisitorJourneyProfile({
    ...next,
    lastSeenAt: new Date().toISOString(),
  });
  return next;
}

function extractDemoSlug(pathname: string): string | null {
  const match = pathname.match(/^\/demo\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function recordVisitorPageVisit(pathname: string): VisitorJourneyProfile {
  return updateVisitorJourneyProfile((current) => {
    const kind = detectVisitorJourneyPageKind(pathname);
    const nextPageViews = {
      ...current.pageViews,
      [kind]: (current.pageViews[kind] ?? 0) + 1,
    };
    const slug = extractDemoSlug(pathname);
    return {
      ...current,
      pageViews: nextPageViews,
      recentPageKinds: recordRecentPageKind(current.recentPageKinds, kind),
      viewedDemoSlugs:
        slug != null
          ? recordViewedDemoSlug(current.viewedDemoSlugs, slug)
          : current.viewedDemoSlugs,
      ...(kind === "estimate"
        ? { estimateReachedCount: current.estimateReachedCount + 1 }
        : {}),
      ...(kind === "contact"
        ? { contactReachedCount: current.contactReachedCount + 1 }
        : {}),
    };
  });
}

export function recordVisitorEntryIntent(
  intent: ConciergeIntent | "learn" | "compare" | "consult" | "estimate"
): VisitorJourneyProfile {
  return updateVisitorJourneyProfile((current) => ({
    ...current,
    latestEntryIntent: intent,
  }));
}

export function recordVisitorIndustryBundle(
  bundle: VisitorJourneyIndustryBundle | null | undefined
): VisitorJourneyProfile {
  if (!bundle) return ensureVisitorJourneyProfile();
  return updateVisitorJourneyProfile((current) => ({
    ...current,
    industryBundle: bundle,
  }));
}

export function recordVisitorFreeform(
  input: string | FreeformInputEnvelope
): VisitorJourneyProfile {
  const normalizedText = typeof input === "string" ? input : input.normalizedText;
  const summary = summarizeFreeformText(normalizedText);
  if (!summary) return ensureVisitorJourneyProfile();
  return updateVisitorJourneyProfile((current) => ({
    ...current,
    lastFreeformSummary: summary,
    ...(typeof input === "string"
      ? {
          lastFreeformSource: undefined,
          lastFreeformRawText: undefined,
          lastFreeformNormalizedText: undefined,
        }
      : {
          lastFreeformSource: input.source,
          lastFreeformRawText: summarizeFreeformText(input.rawText),
          lastFreeformNormalizedText: summarizeFreeformText(input.normalizedText),
        }),
  }));
}

export function recordVisitorEstimateDraft(
  draft: Partial<EstimateFormDraft>
): VisitorJourneyProfile {
  const nextSignals = {
    ...(draft.teamSize ? { teamSize: draft.teamSize } : {}),
    ...(draft.timeline ? { timeline: draft.timeline } : {}),
    ...(draft.integration ? { integration: draft.integration } : {}),
    ...(draft.usageSurface ? { usageSurface: draft.usageSurface } : {}),
    ...(draft.audienceScope ? { audienceScope: draft.audienceScope } : {}),
  };
  if (Object.keys(nextSignals).length === 0) return ensureVisitorJourneyProfile();
  return updateVisitorJourneyProfile((current) => ({
    ...current,
    estimateSignals: {
      ...current.estimateSignals,
      ...nextSignals,
    },
  }));
}

export function recordVisitorEstimateAnswers(
  answers: Record<string, string>
): VisitorJourneyProfile {
  return updateVisitorJourneyProfile((current) => {
    const nextSignals = updateEstimateSignalsFromAnswers(
      current.estimateSignals,
      answers
    );
    return {
      ...current,
      ...(nextSignals ? { estimateSignals: nextSignals } : {}),
    };
  });
}

export function recordVisitorJourneyKpi(
  detail: ConciergeKpiDetail
): VisitorJourneyProfile {
  return updateVisitorJourneyProfile((current) => {
    const next = { ...current };
    if (detail.pathname) {
      const kind = detectVisitorJourneyPageKind(detail.pathname);
      next.pageViews = {
        ...current.pageViews,
        [kind]: current.pageViews[kind] ?? 0,
      };
      next.recentPageKinds = recordRecentPageKind(current.recentPageKinds, kind);
    }
    return next;
  });
}

export function readVisitorJourneySummary(): VisitorJourneySummary | null {
  const profile = readVisitorJourneyProfile();
  return profile ? buildVisitorJourneySummary(profile) : null;
}
