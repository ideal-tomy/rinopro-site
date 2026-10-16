import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { axLayout } from "@/lib/ui/ax-typography";

export type AxContainerProps = {
  variant?: "wide" | "reading";
  className?: string;
  children: ReactNode;
};

export function AxContainer({
  variant = "wide",
  className,
  children,
}: AxContainerProps) {
  return (
    <div
      className={cn(
        variant === "reading"
          ? axLayout.containerReading
          : axLayout.containerWide,
        className
      )}
    >
      {children}
    </div>
  );
}
