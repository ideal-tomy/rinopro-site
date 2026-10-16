import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AxProseProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

/** 長文ブロック（1段落=連続テキスト。装飾 span block 禁止） */
export function AxProse({ children, className, fullWidth }: AxProseProps) {
  return (
    <div
      className={cn(
        "ax-pattern-prose",
        fullWidth && "max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
