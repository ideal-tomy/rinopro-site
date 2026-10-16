"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface DemoCardProps {
  demo: DemoItem;
  className?: string;
}

export function DemoCard({ demo, className }: DemoCardProps) {
  const slug = typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
  const imageUrl = demo.image?.url;

  return (
    <Card
      className={cn(
        "p-6 transition-colors hover:border-accent/50",
        className
      )}
    >
      {imageUrl && (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <h2 className="mb-2 font-semibold text-text">{demo.title}</h2>
      <p className="mb-4 line-clamp-2 text-sm text-text-sub">
        {demo.description ?? "Demo"}
      </p>
      <Button variant="outline" size="sm" asChild>
        <Link href={slug ? `/demo/${slug}` : "#"}>体験する</Link>
      </Button>
    </Card>
  );
}
