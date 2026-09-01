import type { ReactNode } from "react";

interface DemoFrameProps {
  title?: string;
  children: ReactNode;
}

export function DemoFrame({ title = "デモ体験", children }: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#D9DDE3] bg-[#F4F5F7] text-gray-900 shadow-lg">
      <div className="flex items-center gap-2 border-b border-[#D9DDE3] bg-white px-4 py-3 sm:px-6">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" aria-hidden="true" />
        <span className="ml-2 text-xs font-medium text-[var(--site-fg-muted)]">
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
