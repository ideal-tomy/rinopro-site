"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const defaultVariantInnerClass =
  "relative z-[1] inline-flex w-full min-w-0 min-h-0 flex-1 items-center justify-center gap-2";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      /**
       * 2 系統:
       * - `default` … 主CTA: 背景 #3b82f6 / 白字 → ホバーで橙背景＋光が走る
       * - `outline` … 枠＋透過 → ホバーで枠と字が橙（トップ「コンサルティング」等）
       * `ghost` / `text` … 枠の有無の違い。ホバーは橙枠＋字に揃える
       */
      variant: {
        default:
          "btn-primary-sheen border border-transparent " +
          "bg-[var(--color-accent-primary)] text-white shadow-sm " +
          "transition-[background-color,box-shadow,transform,ring] duration-300 ease-out " +
          "motion-safe:transform-gpu motion-safe:hover:scale-[1.02] motion-reduce:transform-none " +
          "hover:bg-[var(--color-accent-primary-hover)] hover:text-white " +
          "focus-visible:ring-action",
        outline:
          "border border-[var(--color-border-light)] bg-transparent text-[var(--color-text-primary)] " +
          "transition-[color,border-color,ring] duration-200 ease-out " +
          "motion-safe:hover:scale-[1.01] motion-reduce:transform-none " +
          "hover:border-[var(--color-accent-primary)] hover:bg-transparent hover:text-[var(--color-accent-primary)] " +
          "focus-visible:ring-warm/55",
        ghost:
          "border border-transparent bg-transparent text-[var(--color-text-primary)] " +
          "transition-[color,border-color,background-color,ring] duration-200 ease-out " +
          "motion-safe:hover:scale-[1.01] motion-reduce:transform-none " +
          "hover:border-[var(--color-accent-primary)]/80 hover:bg-transparent hover:text-[var(--color-accent-primary)] " +
          "focus-visible:ring-warm/50",
        text:
          "border border-transparent bg-transparent px-0 text-[var(--color-text-secondary)] " +
          "transition-[color,ring] duration-200 " +
          "hover:bg-transparent hover:text-[var(--color-accent-primary)] " +
          "scale-100 motion-safe:hover:scale-100 " +
          "focus-visible:ring-warm/50",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const v = variant ?? "default";
    const mergedClass = cn(buttonVariants({ variant, size, className }));

    if (v === "default" && asChild && React.isValidElement(children)) {
      const el = children as React.ReactElement<{ children?: React.ReactNode }>;
      return (
        <Slot className={mergedClass} ref={ref} {...props}>
          {React.cloneElement(el, {
            children: (
              <span className={defaultVariantInnerClass}>{el.props.children}</span>
            ),
          })}
        </Slot>
      );
    }

    if (v === "default" && !asChild) {
      const { type, ...rest } = props;
      return (
        <button type={type ?? "button"} className={mergedClass} ref={ref} {...rest}>
          <span className={defaultVariantInnerClass}>{children}</span>
        </button>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={mergedClass} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
