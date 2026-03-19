import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-silver/20 bg-base-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm text-text-sub">
          現場業務を、AIで再設計して実装まで伴走する。
        </p>
        <nav className="flex gap-6">
          <Link
            href="/contact"
            className="text-sm text-text-sub transition-colors hover:text-accent"
          >
            問い合わせ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
