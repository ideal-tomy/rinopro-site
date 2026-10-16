"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomeConsultCtaButtonProps = {
  label: string;
  className?: string;
  size?: ButtonProps["size"];
};

export function HomeConsultCtaButton({
  label,
  className,
  size = "default",
}: HomeConsultCtaButtonProps) {
  return (
    <Button
      asChild
      size={size}
      className={cn("mt-5 w-full", className)}
    >
      <Link href="/contact">{label}</Link>
    </Button>
  );
}
