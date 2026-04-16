"use client";

import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { getConciergeEntryPreset } from "@/lib/chat/concierge-entry-policy";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

export function HomeConsultCtaButton({ label }: { label: string }) {
  const { openConcierge } = useConciergeChat();
  const entry = getConciergeEntryPreset("homeConsult");

  return (
    <Button
      className="mt-5 w-full"
      onClick={() => {
        recordVisitorEntryIntent("consult");
        openConcierge(entry.mode, entry.entrySource, entry.signals);
      }}
    >
      {label}
    </Button>
  );
}
