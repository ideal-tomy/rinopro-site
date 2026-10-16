import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AxProductScreenProps = {
  urlLabel?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
};

export function AxProductScreen({
  urlLabel = "app.example / preview",
  badge,
  children,
  className,
}: AxProductScreenProps) {
  return (
    <div className={cn("ax-pattern-product", className)}>
      <div className="ax-pattern-product__bar">
        <span aria-hidden="true">● ● ●</span>
        <span className="flex-1 truncate font-mono text-[11px]">{urlLabel}</span>
        {badge ? <span>{badge}</span> : null}
      </div>
      <div className="ax-pattern-product__body">{children}</div>
    </div>
  );
}
