"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  applyContactHandoff,
  type ContactHandoffResult,
} from "@/lib/contact/apply-contact-handoff";
import {
  clearContactHandoffFromSession,
  CONTACT_FROM_ESTIMATE_QUERY,
  peekContactEstimateSnapshotFromSession,
  peekContactPrefillFromSession,
  peekHandoffPayloadFromSession,
} from "@/lib/chat/estimate-handoff";
import { readEstimateDetailedFlow } from "@/lib/estimate/estimate-detailed-session";

export type ResolvedContactHandoff =
  | ContactHandoffResult
  | { status: "loading" };

export function useContactHandoff() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resolved, setResolved] = useState<ResolvedContactHandoff>({
    status: "loading",
  });
  const [failureDismissed, setFailureDismissed] = useState(false);

  const storage = useMemo(
    () => ({
      peekPrefill: peekContactPrefillFromSession,
      peekSnapshot: peekContactEstimateSnapshotFromSession,
      peekHandoffPayload: peekHandoffPayloadFromSession,
      readEstimateFlow: readEstimateDetailedFlow,
    }),
    []
  );

  useEffect(() => {
    setResolved(applyContactHandoff(searchParams, storage));
  }, [searchParams, storage]);

  const dismissEstimateFailure = useCallback(() => {
    setFailureDismissed(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(CONTACT_FROM_ESTIMATE_QUERY);
    const query = params.toString();
    router.replace(query ? `/contact?${query}` : "/contact");
  }, [router, searchParams]);

  const clearHandoffAfterSubmit = useCallback(() => {
    clearContactHandoffFromSession();
  }, []);

  const estimateSubmitBlocked = useMemo(() => {
    if (failureDismissed) return false;
    if (resolved.status !== "estimate_failed") return false;
    return searchParams.get(CONTACT_FROM_ESTIMATE_QUERY) === "estimate";
  }, [failureDismissed, resolved.status, searchParams]);

  return {
    resolved,
    failureDismissed,
    dismissEstimateFailure,
    clearHandoffAfterSubmit,
    estimateSubmitBlocked,
  };
}
