"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { TeamMember as TeamMemberType } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface TeamMemberProps {
  member: TeamMemberType;
  className?: string;
}

export function TeamMember({ member, className }: TeamMemberProps) {
  const imageUrl = member.image?.url;

  return (
    <Card className={cn("p-6", className)}>
      {imageUrl && (
        <div className="relative mb-4 aspect-square overflow-hidden rounded-full">
          <Image
            src={imageUrl}
            alt={member.name}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      )}
      <h2 className="mb-1 font-semibold text-text">{member.name}</h2>
      {member.role && (
        <p className="mb-2 text-sm text-accent">{member.role}</p>
      )}
      <p className="text-sm text-text-sub">{member.bio ?? ""}</p>
    </Card>
  );
}
