"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  useConciergeChat,
  type ConciergeMode,
} from "@/components/chat/concierge-chat-context";
import { clearServicesFlowPick } from "@/lib/chat/chat-auto-open";
import { isDemoExperienceWizardPath } from "@/lib/chat/concierge-demo-hub-policy";
import { resolveLauncherOpenState } from "@/lib/chat/concierge-entry-policy";
import { ConciergeFabNudge } from "@/components/chat/ConciergeFabNudge";

const ChatContainer = dynamic(
  () => import("./ChatContainer").then((mod) => mod.ChatContainer),
  {
    ssr: false,
    loading: () => null,
  }
);

function ChatLauncherFab({ onWarmup }: { onWarmup: () => void }) {
  const pathname = usePathname();
  const {
    open,
    setOpen,
    setMode,
    setEntrySource,
    setPendingSignals,
  } = useConciergeChat();

  const openConciergeFromFab = () => {
    onWarmup();
    const next = resolveLauncherOpenState(pathname);
    setEntrySource(next.entrySource);
    setPendingSignals(null);
    if (next.resetServicesMode) {
      clearServicesFlowPick();
      setMode("default" as ConciergeMode);
    }
    setOpen(true);
  };

  return (
    <div className="chat-theme-ai pointer-events-none fixed bottom-5 right-4 z-[200] flex flex-col items-end sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      <ConciergeFabNudge />
      <button
        type="button"
        className="pointer-events-auto box-border inline-flex min-h-[3.25rem] min-w-[3.25rem] flex-col items-center justify-center gap-1 rounded-full border border-silver/30 bg-base-dark/85 px-2.5 py-2 text-text opacity-90 shadow-[0_4px_18px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04] backdrop-blur-sm transition-[border-color,box-shadow,opacity] duration-200 hover:border-accent/45 hover:opacity-100 hover:shadow-[0_6px_24px_color-mix(in_srgb,var(--color-accent)_14%,transparent)] sm:min-h-[3.5rem] sm:min-w-[3.5rem] sm:flex-row sm:gap-1.5 sm:px-3 sm:py-0"
        onPointerEnter={onWarmup}
        onFocus={onWarmup}
        onClick={openConciergeFromFab}
        aria-expanded={open}
        aria-controls={
          isDemoExperienceWizardPath(pathname) ? "concierge-panel-page" : undefined
        }
        aria-label="相談・ガイド（AI相談窓口）を開く"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 9h8" />
          <path d="M8 13h5" />
          <path d="M12 3c4.97 0 9 3.58 9 8s-4.03 8-9 8c-1.2 0-2.35-.2-3.4-.58L3 21l1.85-4.08A7.42 7.42 0 0 1 3 11c0-4.42 4.03-8 9-8Z" />
        </svg>
        <span className="max-w-[4.75rem] text-center text-[0.62rem] font-semibold leading-snug tracking-tight text-text sm:max-w-none sm:text-xs sm:font-medium sm:tracking-normal">
          相談
        </span>
      </button>
    </div>
  );
}

export function ChatContainerLazy() {
  const { open } = useConciergeChat();
  const [warmedUp, setWarmedUp] = useState(false);
  const shouldLoadContainer = warmedUp || open;

  return (
    <>
      <ChatLauncherFab onWarmup={() => setWarmedUp(true)} />
      {shouldLoadContainer ? <ChatContainer showLauncher={false} /> : null}
    </>
  );
}
