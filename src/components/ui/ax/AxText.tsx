import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { axRole, type AxTextRole } from "@/lib/ui/ax-typography";

const defaultElement: Record<AxTextRole, ElementType> = {
  display: "h1",
  pageTitle: "h1",
  sectionTitle: "h2",
  itemTitle: "h3",
  lead: "p",
  body: "p",
  supporting: "p",
  uiLabel: "span",
  eyebrow: "p",
};

export type AxTextProps = {
  role: AxTextRole;
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** 共通ルールのタイポロールを付与するテキスト要素 */
export function AxText({
  role,
  as,
  className,
  children,
  id,
}: AxTextProps) {
  const Component = as ?? defaultElement[role];
  return (
    <Component id={id} className={cn(axRole[role], className)}>
      {children}
    </Component>
  );
}
