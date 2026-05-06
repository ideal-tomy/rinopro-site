import Link from "next/link";
import { footerCopy } from "@/lib/content/site-copy";

const FOOTER_LINKS = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "サービス" },
  { href: "/about", label: "会社紹介" },
  { href: "/contact", label: "問い合わせ" },
  { href: "/demo", label: "体験デモ" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-[var(--color-text-primary)]">{footerCopy.tagline}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {footerCopy.subline}
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-primary)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
