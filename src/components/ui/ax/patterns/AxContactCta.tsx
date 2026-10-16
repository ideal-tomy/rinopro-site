import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxText } from "@/components/ui/ax/AxText";

export type AxContactCtaProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function AxContactCta({
  id,
  eyebrow = "お問い合わせ",
  title,
  titleId,
  lead,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: AxContactCtaProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("ax-pattern-cta", className)}
    >
      <AxContainer>
        <AxText role="eyebrow">{eyebrow}</AxText>
        <h2 id={titleId} className="ax-role-section-title">
          {title}
        </h2>
        {lead ? <div className="ax-pattern-cta__lead">{lead}</div> : null}
        <div className="ax-pattern-cta__actions">
          <Link className="ax-pattern-cta__primary" href={primaryHref}>
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link className="ax-pattern-cta__secondary" href={secondaryHref}>
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </AxContainer>
    </section>
  );
}
