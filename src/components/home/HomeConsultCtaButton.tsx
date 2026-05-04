"use client";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { getConciergeEntryPreset } from "@/lib/chat/concierge-entry-policy";
import { recordVisitorEntryIntent } from "@/lib/journey/visitor-journey-storage";
import { cn } from "@/lib/utils";

type HomeConsultCtaButtonProps = {
  label: string;
  className?: string;
  size?: ButtonProps["size"];
};

export function HomeConsultCtaButton({
  label,
  className,
  size = "default",
}: HomeConsultCtaButtonProps) {
  const { openConcierge } = useConciergeChat();
  const entry = getConciergeEntryPreset("homeConsult");

  return (
    <Button
      size={size}
      className={cn("mt-5 w-full", className)}
      onClick={() => {
        recordVisitorEntryIntent("consult");
        openConcierge(entry.mode, entry.entrySource, entry.signals);
      }}
    >
      {label}
    </Button>
  );
}
