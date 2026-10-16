"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { getConciergeEntryPreset } from "@/lib/chat/concierge-entry-policy";

/**
 * `/demo/list?concierge=1` で遷移したとき、一覧ページの「コンシェルジュを開く」と同じ経路でチャットを開く。
 */
export function DemoListConciergeUrlSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { requestOpenDemoListPageConcierge } = useConciergeChat();
  const entry = getConciergeEntryPreset("demoListCompare");
  const handledRef = useRef(false);

  useEffect(() => {
    if (searchParams.get("concierge") !== "1") {
      handledRef.current = false;
      return;
    }
    if (handledRef.current) return;
    handledRef.current = true;
    requestOpenDemoListPageConcierge(entry.signals);
    router.replace("/demo/list", { scroll: false });
  }, [entry.signals, searchParams, requestOpenDemoListPageConcierge, router]);

  return null;
}
