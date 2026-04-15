"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu } from "lucide-react";

const MobileNav = dynamic(
  () => import("./MobileNav").then((mod) => mod.MobileNav),
  { ssr: false, loading: () => null }
);

const NAV_ITEMS = [
  { href: "/", label: "トップ" },
  { href: "/demo", label: "体験・demo" },
  { href: "/services", label: "サービス" },
  { href: "/about", label: "会社紹介" },
  { href: "/contact", label: "問い合わせ" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shouldLoadMobileNav, setShouldLoadMobileNav] = useState(false);

  const handleOpenMobileNav = () => {
    setShouldLoadMobileNav(true);
    setMobileOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-silver/20 bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-base/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-bold text-accent">
          Axeon
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <div
              key={href}
              className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-px"
            >
              <Link
                href={href}
                className="block text-sm font-medium text-text-sub transition-colors hover:text-accent"
              >
                {label}
              </Link>
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-text-sub transition-colors hover:bg-silver/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e17] md:hidden"
          onClick={handleOpenMobileNav}
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {shouldLoadMobileNav ? (
        <MobileNav
          items={NAV_ITEMS}
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        />
      ) : null}
    </header>
  );
}
