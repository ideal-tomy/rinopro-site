"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "トップ" },
  { href: "/demo", label: "ツールdemo" },
  { href: "/cases", label: "事例" },
  { href: "/services", label: "サービス" },
  { href: "/about", label: "会社紹介" },
  { href: "/contact", label: "問い合わせ" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-silver/20 bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-base/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-bold text-accent">
          rinopro
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium text-text-sub transition-colors hover:text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <MobileNav
        items={NAV_ITEMS}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />
    </header>
  );
}
