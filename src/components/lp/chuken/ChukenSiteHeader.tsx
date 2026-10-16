"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AxContainer } from "@/components/ui/ax/AxContainer";

const chukenDisplay = "font-[family-name:var(--font-chuken-display),serif]";

const NAV = [
  { href: "#principles", label: "考え方" },
  { href: "#solutions", label: "サービス" },
  { href: "#approach", label: "進め方" },
  { href: "#cases", label: "事例" },
  { href: "#team", label: "体制" },
  { href: "#faq", label: "FAQ" },
] as const;

const HIDE_THRESHOLD = 80;

export function ChukenSiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let accum = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (y < 48) {
        setHidden(false);
        accum = 0;
        return;
      }

      accum += delta;
      if (accum > HIDE_THRESHOLD) {
        setHidden(true);
        setMenuOpen(false);
        accum = HIDE_THRESHOLD;
      } else if (accum < -HIDE_THRESHOLD / 2) {
        setHidden(false);
        accum = -HIDE_THRESHOLD / 2;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-[var(--ax-border-subtle)] bg-[color-mix(in_srgb,var(--ax-surface-page)_92%,transparent)] backdrop-blur transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <AxContainer className="flex items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className={`${chukenDisplay} text-[22px] font-semibold tracking-[0.15em] text-[var(--ax-brand-primary)] no-underline`}
        >
          AXEON
        </Link>

        <nav className="hidden items-center gap-5 text-[13px] text-[var(--ax-text-supporting)] lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[var(--ax-brand-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/contact?from=lp-chuken-v2"
            className="rounded-full bg-[var(--ax-theme-accent,#c84a3a)] px-3 py-2 text-[12px] font-bold text-white no-underline sm:px-4 sm:text-[13px]"
          >
            初回相談を予約
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ax-border-subtle)] text-[var(--ax-text-heading)] lg:hidden"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">メニュー</span>
            <span aria-hidden className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </AxContainer>

      {menuOpen ? (
        <nav
          className="border-t border-[var(--ax-border-subtle)] bg-[var(--ax-surface-page)] lg:hidden"
          aria-label="モバイルナビ"
        >
          <AxContainer className="flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b border-[var(--ax-border-subtle)] py-3.5 text-[14px] font-medium text-[var(--ax-text-heading)] no-underline last:border-b-0"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </AxContainer>
        </nav>
      ) : null}
    </header>
  );
}
