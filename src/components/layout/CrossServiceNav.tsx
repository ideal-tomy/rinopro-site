"use client";

import Link from "next/link";

const linkClass =
  "text-sm text-text/85 underline-offset-4 transition-colors hover:text-accent";

type ServiceCurrent = "consulting" | "flow";

/** サービス詳細ページ用：demo と兄弟ページへの控えめな導線 */
export function ServiceCrossLinks({ current }: { current: ServiceCurrent }) {
  const sibling =
    current === "consulting"
      ? { href: "/flow" as const, label: "開発の流れ" }
      : { href: "/consulting" as const, label: "コンサルティング" };

  return (
    <nav
      aria-label="関連ページ"
      className="mx-auto mt-14 max-w-xl border-t border-silver/15 pt-10 text-center md:mt-16"
    >
      <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-text-sub">
        ほかのコンテンツ
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        <li className="list-none">
          <Link href="/demo" className={linkClass}>
            体験・demo
          </Link>
        </li>
        <li className="list-none">
          <Link href={sibling.href} className={linkClass}>
            {sibling.label}
          </Link>
        </li>
        <li className="list-none">
          <Link href="/services" className={linkClass}>
            サービス一覧
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/** /demo 一覧：開発・コンサル詳細への導線 */
export function DemoCrossServiceLinks() {
  return (
    <nav
      aria-label="進め方の詳細"
      className="mt-14 border-t border-silver/15 pt-10 text-center md:mt-16"
    >
      <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-text-sub">
        実装・伴走の進め方
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        <li className="list-none">
          <Link href="/flow" className={linkClass}>
            開発の流れ
          </Link>
        </li>
        <li className="list-none">
          <Link href="/consulting" className={linkClass}>
            コンサルティング
          </Link>
        </li>
      </ul>
    </nav>
  );
}
