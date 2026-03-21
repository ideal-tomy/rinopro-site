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

type ConciergeChatContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: ConciergeMode;
  setMode: (value: ConciergeMode) => void;
  openConcierge: (nextMode: ConciergeMode) => void;
};

const ConciergeChatContext = createContext<ConciergeChatContextValue | null>(
  null
);

export function ConciergeChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ConciergeMode>("default");

  const openConcierge = useCallback((nextMode: ConciergeMode) => {
    setMode(nextMode);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      mode,
      setMode,
      openConcierge,
    }),
    [open, mode, openConcierge]
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
