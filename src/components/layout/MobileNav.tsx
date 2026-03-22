"use client";

import Link from "next/link";
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
}

interface MobileNavProps {
  items: readonly NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ items, open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="text-left">メニュー</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {items.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "text-[1rem] font-medium text-text transition-colors hover:text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
