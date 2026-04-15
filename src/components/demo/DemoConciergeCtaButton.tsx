"use client";

import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

export function DemoConciergeCtaButton({ label }: { label: string }) {
  const { requestOpenDemoListPageConcierge } = useConciergeChat();

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      onClick={() => {
        recordVisitorEntryIntent("compare");
        requestOpenDemoListPageConcierge({ entryIntent: "compare" });
      }}
    >
      {label}
    </Button>
  );
}
