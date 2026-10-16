import type { ConciergeMode } from "@/components/chat/concierge-chat-context";
import type { ConciergeTrack, FlowSelection } from "@/lib/chat/concierge-flow";
import {
  experienceHref,
  getDemoSlugForAbTrack,
  getDemoSlugForCdeTrack,
} from "@/lib/chat/concierge-routing";
import { isDemoHubForConciergePolicy } from "@/lib/chat/concierge-demo-hub-policy";

export type ConciergeCtaKind =
  | "estimate_detailed"
  | "contact"
  | "demo_list"
  | "experience_prototype"
  | "concierge_adjust"
  | "concierge_freeform";

export type ConciergeLinkCta = {
  key: string;
  label: string;
  href: string;
  ctaKind: ConciergeCtaKind;
};

export type ConciergeButtonCta = {
  key: string;
  label: string;
  ctaKind: ConciergeCtaKind;
  href?: string;
  variant: "primary" | "secondary";
};

export function shouldUseDelayedConciergeCta(args: {
  resolvedPath: string;
  demoRecommendFromTextInFlight: boolean;
}): boolean {
  const { resolvedPath, demoRecommendFromTextInFlight } = args;
  if (!resolvedPath) return false;
  if (isDemoHubForConciergePolicy(resolvedPath)) return false;
  if (demoRecommendFromTextInFlight) return false;
  return true;
}

export function buildDelayedConciergeCtaConfig(args: {
  mode: ConciergeMode;
  showEntryPicker: boolean;
  shouldShowDemoPrompt: boolean;
  demoPrompt: string;
}) {
  const { mode, showEntryPicker, shouldShowDemoPrompt, demoPrompt } = args;

  if (mode === "development" || mode === "consulting") {
    return {
      promptText: null,
      buttonCtas: [
        {
          key: "estimate",
          label: "詳細見積もり",
          href: "/estimate-detailed",
          ctaKind: "estimate_detailed",
          variant: "primary",
        },
        {
          key: "contact",
          label: "お問い合わせ",
          href: "/contact",
          ctaKind: "contact",
          variant: "secondary",
        },
      ] satisfies ConciergeButtonCta[],
      textLinkCtas: [] satisfies ConciergeLinkCta[],
    };
  }

  return {
    promptText:
      shouldShowDemoPrompt && !showEntryPicker ? demoPrompt : null,
    buttonCtas: [] satisfies ConciergeButtonCta[],
    textLinkCtas: showEntryPicker
      ? []
      : ([
          {
            key: "demo_list",
            label: "demo一覧",
            href: "/demo/list",
            ctaKind: "demo_list",
          },
          {
            key: "estimate",
            label: "詳細見積もり",
            href: "/estimate-detailed",
            ctaKind: "estimate_detailed",
          },
          {
            key: "contact",
            label: "お問い合わせ",
            href: "/contact",
            ctaKind: "contact",
          },
        ] satisfies ConciergeLinkCta[]),
  };
}

export function resolveHomeDoneDemoCta(
  track: ConciergeTrack,
  path: FlowSelection[]
): ConciergeLinkCta {
  const demoSlugResolved =
    track === "A" || track === "B"
      ? getDemoSlugForAbTrack(track, path)
      : getDemoSlugForCdeTrack(track, path);

  return demoSlugResolved
    ? {
        key: "demo",
        label: "近いdemo",
        href: experienceHref(demoSlugResolved),
        ctaKind: "experience_prototype",
      }
    : {
        key: "demo",
        label: "近いdemo",
        href: "/demo/list",
        ctaKind: "demo_list",
      };
}

export function buildHomeDoneFooterCtas(
  track: ConciergeTrack,
  path: FlowSelection[]
) {
  return {
    demo: resolveHomeDoneDemoCta(track, path),
    primaryButtons: [
      {
        key: "estimate",
        label: "詳細見積もりへ",
        href: "/estimate-detailed",
        ctaKind: "estimate_detailed",
        variant: "primary",
      },
      {
        key: "adjust",
        label: "条件変更",
        ctaKind: "concierge_adjust",
        variant: "secondary",
      },
    ] satisfies ConciergeButtonCta[],
    secondaryLinks: [
      {
        key: "contact",
        label: "お問い合わせ",
        href: "/contact",
        ctaKind: "contact",
      },
      {
        key: "freeform",
        label: "メモを入力欄に貼る",
        href: "",
        ctaKind: "concierge_freeform",
      },
    ] satisfies ConciergeLinkCta[],
  };
}
