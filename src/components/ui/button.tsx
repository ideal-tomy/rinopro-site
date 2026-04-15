"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_BACK } from "@/lib/motion/variants";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e17] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-action text-white hover:bg-action/90 hover:text-white",
        outline:
          "border border-silver/30 bg-transparent hover:bg-silver/10",
        ghost: "hover:bg-silver/10",
        text: "bg-transparent px-0 text-text-sub hover:bg-transparent hover:text-accent",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const Comp = asChild ? Slot : "button";
    const content = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
    return (
      <motion.span
        style={{ display: "inline-flex" }}
        whileHover={
          prefersReducedMotion ? undefined : { scale: 1.03 }
        }
        transition={{ ease: EASE_OUT_BACK, duration: 0.25 }}
      >
        {content}
      </motion.span>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
