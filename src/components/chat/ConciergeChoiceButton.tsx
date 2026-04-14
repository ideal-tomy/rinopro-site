"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const choiceGlassBase =
  "group relative w-full min-h-[44px] text-left transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out " +
  "rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-[20px] " +
  "px-4 py-3 shadow-sm " +
  "hover:border-white/25 hover:shadow-[0_0_24px_rgba(0,103,192,0.14)] " +
  "active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
  "disabled:pointer-events-none disabled:opacity-50";

/** 業種第1層2列向け：パディングと文字を詰める（`text-base` は使わない） */
const choiceGlassCompact =
  "min-h-[44px] px-3 py-2.5 sm:px-3 sm:py-2.5";

const choiceSelected =
  "border-action/45 bg-action/[0.12] shadow-[0_0_20px_rgba(0,103,192,0.18)]";

export interface ConciergeChoiceButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** 1-based display index → `01.` */
  order: number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  /** Brief pressed / selected highlight (Speak-like instant feedback) */
  selected?: boolean;
  /** 狭い2列グリッド向けの小さめタイポ・余白 */
  labelDensity?: "default" | "compact";
}

export function ConciergeChoiceButton({
  order,
  label,
  description,
  icon,
  selected = false,
  labelDensity = "default",
  className,
  type = "button",
  ...props
}: ConciergeChoiceButtonProps) {
  const reduceMotion = useReducedMotion();
  const prefix = `${String(order).padStart(2, "0")}`;
  const compact = labelDensity === "compact";

  const prefixCls = compact
    ? "pt-0.5 text-[10px] font-semibold tabular-nums tracking-wide text-action/85 sm:text-[11px]"
    : "pt-0.5 text-[10px] font-semibold tabular-nums tracking-wide text-action/85 sm:text-[16px]";

  const labelCls = compact
    ? "text-[10px] font-semibold leading-tight tracking-wide text-text/95 sm:text-[11px]"
    : "text-[10px] font-semibold leading-relaxed tracking-wide text-text/95 sm:text-[16px]";

  return (
    <button
      type={type}
      className={cn(
        choiceGlassBase,
        compact && choiceGlassCompact,
        selected && choiceSelected,
        reduceMotion && "active:scale-100",
        className
      )}
      {...props}
    >
      <span className={cn("flex w-full items-start", compact ? "gap-2" : "gap-3")}>
        <span className={cn("shrink-0", prefixCls)} aria-hidden>
          {prefix}
        </span>
        <span className="min-w-0 flex-1">
          {icon ? (
            <span className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-action">{icon}</span>
              <span className={labelCls}>{label}</span>
            </span>
          ) : (
            <span className={cn("block", labelCls)}>{label}</span>
          )}
          {description ? (
            <span className="mt-1 block text-[10px] font-normal leading-relaxed tracking-wide text-text/95 sm:text-xs">
              {description}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

const ctaPrimary =
  "w-full rounded-2xl border border-action/50 bg-action/25 px-4 py-3 font-semibold leading-relaxed tracking-wide " +
  "text-white shadow-[0_0_20px_rgba(0,103,192,0.2)] backdrop-blur-[20px] " +
  "transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out " +
  "hover:border-action/70 hover:bg-action/35 hover:text-white hover:shadow-[0_0_28px_rgba(0,103,192,0.28)] " +
  "active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
  "disabled:pointer-events-none disabled:opacity-50";

const ctaSecondary =
  "w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 font-semibold leading-relaxed tracking-wide text-text/95 " +
  "shadow-sm backdrop-blur-[20px] " +
  "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out " +
  "hover:border-white/25 hover:shadow-[0_0_24px_rgba(0,103,192,0.14)] " +
  "active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
  "disabled:pointer-events-none disabled:opacity-50";

const ctaGhost =
  "w-full rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm font-medium leading-relaxed tracking-wide text-text-sub " +
  "transition-[transform,background-color,color] duration-200 ease-out " +
  "hover:bg-white/[0.04] hover:text-text/90 " +
  "active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
  "disabled:pointer-events-none disabled:opacity-50";

export type ConciergeCtaVariant = "primary" | "secondary" | "ghost";

export interface ConciergeCtaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ConciergeCtaVariant;
}

export function ConciergeCtaButton({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ConciergeCtaButtonProps) {
  const reduceMotion = useReducedMotion();
  return (
    <button
      type={type}
      className={cn(
        variant === "primary" && ctaPrimary,
        variant === "secondary" && ctaSecondary,
        variant === "ghost" && ctaGhost,
        reduceMotion && "active:scale-100",
        className
      )}
      {...props}
    />
  );
}

export interface ConciergeCtaLinkProps {
  href: string;
  variant?: Exclude<ConciergeCtaVariant, "ghost">;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function ConciergeCtaLink({
  href,
  variant = "secondary",
  className,
  children,
  onClick,
  disabled = false,
}: ConciergeCtaLinkProps) {
  const cls = cn(
    "inline-flex items-center justify-center text-center",
    variant === "primary" && ctaPrimary,
    variant === "secondary" && ctaSecondary,
    className
  );

  if (disabled) {
    return (
      <span className={cn(cls, "pointer-events-none cursor-not-allowed opacity-50")} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={cls}>
      {children}
    </Link>
  );
}
