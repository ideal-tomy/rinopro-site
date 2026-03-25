import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "トップ" },
  { href: "/demo", label: "体験・demo" },
  { href: "/services", label: "サービス" },
  { href: "/about", label: "会社紹介" },
  { href: "/contact", label: "問い合わせ" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-silver/20 bg-base-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm text-text-sub">
          ビジネスを再設計する
        </p>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-text-sub transition-colors hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
