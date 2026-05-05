"use client";

import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { getConciergeEntryPreset } from "@/lib/chat/concierge-entry-policy";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

export function DemoConciergeCtaButton({ label }: { label: string }) {
  const { requestOpenDemoListPageConcierge } = useConciergeChat();
  const entry = getConciergeEntryPreset("demoListCompare");

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      className="clickable-element border-silver/25 opacity-95 hover:opacity-100"
      onClick={() => {
        recordVisitorEntryIntent("compare");
        requestOpenDemoListPageConcierge(entry.signals);
      }}
    >
      {label}
    </Button>
  );
}
