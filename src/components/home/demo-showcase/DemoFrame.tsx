"use client";

import { createContext, useContext, type ReactNode } from "react";

/** 窓のタイトルバー直下に差し込む帯 */
export const DemoFrameOverlayContext = createContext<ReactNode>(null);

/** デモ本文エリアの下端に重ねる帯（トップ SP の Before/After など） */
export const DemoFrameBottomOverlayContext = createContext<ReactNode>(null);

interface DemoFrameProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function DemoFrame({
  title = "デモ体験",
  children,
  className,
}: DemoFrameProps) {
  const overlay = useContext(DemoFrameOverlayContext);
  const bottomOverlay = useContext(DemoFrameBottomOverlayContext);
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#D9DDE3] bg-[#F4F5F7] text-gray-900 shadow-lg ${className ?? ""}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-[#D9DDE3] bg-white px-4 py-3 sm:px-6">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" aria-hidden="true" />
        <span className="ml-2 text-xs font-medium text-[var(--site-fg-muted)]">
          {title}
        </span>
      </div>
      {overlay}
      <div className="relative min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        {children}
        {bottomOverlay}
      </div>
    </div>
  );
}
