"use client";

import type { ComponentProps } from "react";
import { FeaturedExperienceVideoCard } from "@/components/experience/FeaturedExperienceVideoCard";
import { useCurrentLocationString } from "@/hooks/use-current-location";

type CardProps = ComponentProps<typeof FeaturedExperienceVideoCard>;

/**
 * サーバー親からでも `returnTo` を付けられるよう、現在位置を注入するラッパー。
 */
export function FeaturedExperienceVideoCardWithReturn(
  props: Omit<CardProps, "entryLocation">
) {
  const entryLocation = useCurrentLocationString();
  return (
    <FeaturedExperienceVideoCard {...props} entryLocation={entryLocation} />
  );
}
