"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConciergeMode = "default" | "development" | "consulting";
export type ConciergeEntrySource =
  | "fab"
  | "auto"
  | "services-card-development"
  | "services-card-consulting";

type ConciergeChatContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: ConciergeMode;
  setMode: (value: ConciergeMode) => void;
  entrySource: ConciergeEntrySource;
  setEntrySource: (value: ConciergeEntrySource) => void;
  openConcierge: (
    nextMode: ConciergeMode,
    source?: ConciergeEntrySource
  ) => void;
};

const ConciergeChatContext = createContext<ConciergeChatContextValue | null>(
  null
);

export function ConciergeChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ConciergeMode>("default");
  const [entrySource, setEntrySource] = useState<ConciergeEntrySource>("fab");

  const openConcierge = useCallback(
    (nextMode: ConciergeMode, source: ConciergeEntrySource = "fab") => {
      setEntrySource(source);
      setMode(nextMode);
      setOpen(true);
    },
    []
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      mode,
      setMode,
      entrySource,
      setEntrySource,
      openConcierge,
    }),
    [open, mode, entrySource, openConcierge]
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
