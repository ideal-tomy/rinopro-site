"use client";

import { Button } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";

export function HomeConsultCtaButton({ label }: { label: string }) {
  const { openConcierge } = useConciergeChat();

  return (
    <Button
      className="mt-5 w-full"
      onClick={() => {
        recordVisitorEntryIntent("consult");
        openConcierge("default", "fab", { entryIntent: "consult" });
      }}
    >
      {label}
    </Button>
  );
}
