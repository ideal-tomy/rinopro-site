"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { saveScrollForBeforeReturnNavigation } from "@/lib/navigation/scroll-restore";

function hrefHasReturnTo(
  href: ComponentProps<typeof Link>["href"]
): boolean {
  return typeof href === "string" && href.includes("returnTo=");
}

type ScrollSavingLinkProps = ComponentProps<typeof Link>;

/**
 * `returnTo` 付きの遷移のときだけ、戻り先でスクロール復元できるよう現在位置を保存する。
 */
export function ScrollSavingLink({ href, onClick, ...rest }: ScrollSavingLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (hrefHasReturnTo(href)) {
          saveScrollForBeforeReturnNavigation();
        }
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
