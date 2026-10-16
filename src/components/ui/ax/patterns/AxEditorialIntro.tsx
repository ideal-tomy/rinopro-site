import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AxText } from "@/components/ui/ax/AxText";

export type AxEditorialIntroProps = {
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  visual?: ReactNode;
  split?: boolean;
  className?: string;
};

export function AxEditorialIntro({
  eyebrow,
  title,
  titleId,
  lead,
  visual,
  split = Boolean(visual),
  className,
}: AxEditorialIntroProps) {
  return (
    <div
      className={cn(
        "ax-pattern-editorial",
        split && "ax-pattern-editorial--split",
        className
      )}
    >
      <div>
        {eyebrow ? (
          <AxText role="eyebrow" className="ax-pattern-editorial__eyebrow">
            {eyebrow}
          </AxText>
        ) : null}
        <AxText
          role="pageTitle"
          id={titleId}
          className="ax-pattern-editorial__title"
        >
          {title}
        </AxText>
        {lead ? (
          <div className={cn("ax-role-lead", "ax-pattern-editorial__lead")}>
            {lead}
          </div>
        ) : null}
      </div>
      {visual ? (
        <div className="ax-pattern-editorial__visual">{visual}</div>
      ) : null}
    </div>
  );
}
