import Link from "next/link";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

type LegacyOfferingNoticeProps = {
  href: string;
  children: ReactNode;
};

/**
 * 旧 `/services/consulting`・`/services/development` から、新サービス概要ページへ誘導する。
 */
export function LegacyOfferingNotice({ href, children }: LegacyOfferingNoticeProps) {
  return (
    <aside
      className="container mx-auto max-w-4xl px-4 pt-10 md:px-6 md:pt-12"
      aria-label="サービス概要ページの案内"
    >
      <div className="flex gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)] md:text-[16px]">
        <Info
          className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-primary)]"
          aria-hidden
        />
        <p>
          {children}{" "}
          <Link
            href={href}
            className="font-semibold text-[var(--color-accent-primary)] underline-offset-4 hover:underline"
          >
            サービス概要ページを見る
          </Link>
        </p>
      </div>
    </aside>
  );
}
