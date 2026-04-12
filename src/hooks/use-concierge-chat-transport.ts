"use client";

import { useMemo, type MutableRefObject } from "react";
import { DefaultChatTransport } from "ai";
import type { ConciergeSignals } from "@/lib/ai/concierge-senior";
import type { ConciergeMode } from "@/components/chat/concierge-chat-context";

/**
 * /api/chat 用 transport。postPreset 等は ref 経由で1回限り付与。
 */
export function useConciergeChatTransport(
  mode: ConciergeMode,
  pathname: string,
  conciergeSignalsRef: MutableRefObject<Partial<ConciergeSignals>>,
  pendingSignals: Partial<ConciergeSignals> | null,
  clearPendingSignals: () => void
) {
  return useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ body, messages: reqMessages }) => {
          const base =
            body && typeof body === "object" && !Array.isArray(body)
              ? { ...(body as Record<string, unknown>) }
              : {};
          const fromCaseStudy =
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("concierge_from") ===
              "case_study";

          const signals: ConciergeSignals = {};
          if (pendingSignals?.entryIntent) {
            signals.entryIntent = pendingSignals.entryIntent;
          }
          if (conciergeSignalsRef.current.postPreset) {
            signals.postPreset = true;
            if (conciergeSignalsRef.current.presetLabel) {
              signals.presetLabel = conciergeSignalsRef.current.presetLabel;
            }
          }
          if (fromCaseStudy) signals.fromCaseStudy = true;

          if (conciergeSignalsRef.current.postPreset) {
            delete conciergeSignalsRef.current.postPreset;
            delete conciergeSignalsRef.current.presetLabel;
          }
          if (pendingSignals) {
            clearPendingSignals();
          }

          const hasSignals = Object.keys(signals).length > 0;

          return {
            body: {
              ...base,
              mode,
              pathname,
              messages: reqMessages,
              ...(hasSignals ? { conciergeSignals: signals } : {}),
            },
          };
        },
      }),
    // ref は安定参照のため deps に含めない（元の ChatContainer と同一）
    [mode, pathname, pendingSignals, clearPendingSignals]
  );
}
