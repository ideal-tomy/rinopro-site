"use client";

import type { ComponentProps, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  buildEstimateDetailedResumeHref,
  readEstimateDetailedFlow,
  writeEstimateDetailedFlow,
} from "@/lib/estimate/estimate-detailed-session";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
};

/** 質問ページへ。formDraft を残し ai のみ消す（処理ページが結果へ飛ばさないようにする） */
export function EstimateDetailedResumeQuestionsButton({
  children,
  className,
  variant = "outline",
}: Props) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("min-h-11 w-full sm:w-auto", className)}
      onClick={() => {
        const flow = readEstimateDetailedFlow();
        if (!flow) {
          router.push("/estimate-detailed");
          return;
        }
        writeEstimateDetailedFlow({
          ...flow,
          ai: null,
        });
        router.push(buildEstimateDetailedResumeHref(flow.ctxQuery));
      }}
    >
      {children}
    </Button>
  );
}
