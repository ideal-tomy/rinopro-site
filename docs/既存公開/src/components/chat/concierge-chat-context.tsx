"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConciergeSignals } from "@/lib/ai/concierge-senior";
import type {
  ConciergeAnswers,
  ConciergePick,
} from "@/lib/demo/intelligent-concierge";

export type ConciergeMode = "default" | "development" | "consulting";
export type ConciergeEntrySource =
  | "fab"
  | "auto"
  | "services-card-development"
  | "services-card-consulting";

/** `/demo/list` 上のチップ・提案レールと `DemoListConciergeFlow` を同期する */
export type DemoListWizardSnapshot = {
  answers: ConciergeAnswers;
  picks: ConciergePick[];
};

type ConciergeChatContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: ConciergeMode;
  setMode: (value: ConciergeMode) => void;
  entrySource: ConciergeEntrySource;
  setEntrySource: (value: ConciergeEntrySource) => void;
  pendingSignals: Partial<ConciergeSignals> | null;
  setPendingSignals: (value: Partial<ConciergeSignals> | null) => void;
  openConcierge: (
    nextMode: ConciergeMode,
    source?: ConciergeEntrySource,
    signals?: Partial<ConciergeSignals>
  ) => void;
  demoListWizardSnapshot: DemoListWizardSnapshot | null;
  setDemoListWizardSnapshot: (value: DemoListWizardSnapshot | null) => void;
  demoListPageOpenSeq: number;
  requestOpenDemoListPageConcierge: (
    signals?: Partial<ConciergeSignals>
  ) => void;
};

const ConciergeChatContext = createContext<ConciergeChatContextValue | null>(
  null
);

export function ConciergeChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ConciergeMode>("default");
  const [entrySource, setEntrySource] = useState<ConciergeEntrySource>("fab");
  const [pendingSignals, setPendingSignals] =
    useState<Partial<ConciergeSignals> | null>(null);
  const [demoListWizardSnapshot, setDemoListWizardSnapshot] =
    useState<DemoListWizardSnapshot | null>(null);
  const [demoListPageOpenSeq, setDemoListPageOpenSeq] = useState(0);

  const openConcierge = useCallback(
    (
      nextMode: ConciergeMode,
      source: ConciergeEntrySource = "fab",
      signals?: Partial<ConciergeSignals>
    ) => {
      setEntrySource(source);
      setPendingSignals(signals ?? null);
      setMode(nextMode);
      setOpen(true);
    },
    []
  );

  const requestOpenDemoListPageConcierge = useCallback((signals?: Partial<ConciergeSignals>) => {
    setPendingSignals(signals ?? null);
    setDemoListPageOpenSeq((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      mode,
      setMode,
      entrySource,
      setEntrySource,
      pendingSignals,
      setPendingSignals,
      openConcierge,
      demoListWizardSnapshot,
      setDemoListWizardSnapshot,
      demoListPageOpenSeq,
      requestOpenDemoListPageConcierge,
    }),
    [
      open,
      mode,
      entrySource,
      pendingSignals,
      openConcierge,
      demoListWizardSnapshot,
      demoListPageOpenSeq,
      requestOpenDemoListPageConcierge,
    ]
  );

  return (
    <ConciergeChatContext.Provider value={value}>
      {children}
    </ConciergeChatContext.Provider>
  );
}

export function useConciergeChat() {
  const ctx = useContext(ConciergeChatContext);
  if (!ctx) {
    throw new Error("useConciergeChat must be used within ConciergeChatProvider");
  }
  return ctx;
}
