"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  children?: readonly { href: string; label: string }[];
}

interface MobileNavProps {
  items: readonly NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ items, open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        id="mobile-site-menu"
        aria-describedby="mobile-menu-description"
        className="w-[280px] max-w-[100vw] overflow-y-auto [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document
            .getElementById("mobile-menu-trigger")
            ?.focus({ preventScroll: true });
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-left">メニュー</SheetTitle>
        </SheetHeader>
        <p id="mobile-menu-description" className="sr-only">
          ご支援内容の下から、コンサルティングと半内製化の詳細を選べます。
        </p>
        <nav className="mt-6" aria-label="サイトメニュー">
          <ul className="flex flex-col gap-2">
            {items.map(({ href, label, children }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex min-h-11 items-center text-[1rem] font-medium text-[var(--color-accent-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    pathname === href && "font-bold",
                  )}
                >
                  {label}
                </Link>
                {children && (
                  <ul
                    className="ml-2 border-l border-[var(--color-border-light)] pl-4"
                    aria-label={`${label}の詳細`}
                  >
                    {children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={
                            pathname === child.href ? "page" : undefined
                          }
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            "flex min-h-11 items-center rounded px-2 text-[15px] text-[var(--color-accent-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                            pathname === child.href &&
                              "bg-[var(--color-accent-primary-light)] font-bold",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
