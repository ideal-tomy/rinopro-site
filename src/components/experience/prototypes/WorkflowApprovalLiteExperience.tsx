"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

interface Row {
  id: string;
  title: string;
  status: Status;
}

const INITIAL: Row[] = [
  { id: "1", title: "見積ドラフト v2（〇〇商事）", status: "pending" },
  { id: "2", title: "広告出稿申請（3月キャンペーン）", status: "pending" },
  { id: "3", title: "勤怠例外（シフト振替）", status: "pending" },
];

interface WorkflowApprovalLiteExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function WorkflowApprovalLiteExperience({
  className,
}: WorkflowApprovalLiteExperienceProps) {
  const [rows, setRows] = useState<Row[]>(INITIAL);

  const setStatus = (id: string, status: Exclude<Status, "pending">) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-text-sub">
        承認待ち一覧からワンタップで状態を更新するモックです。通知・アラート連携のイメージ用です。
      </p>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-silver/25 bg-base-dark/80 p-4"
          >
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-text">{r.title}</span>
              <span
                className={cn(
                  "w-fit rounded-full px-2 py-0.5 text-xs",
                  r.status === "pending" && "bg-silver/15 text-text-sub",
                  r.status === "approved" && "bg-accent/15 text-accent",
                  r.status === "rejected" && "bg-destructive/15 text-destructive"
                )}
              >
                {r.status === "pending" && "承認待ち"}
                {r.status === "approved" && "承認済み"}
                {r.status === "rejected" && "差し戻し"}
              </span>
            </div>
            {r.status === "pending" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setStatus(r.id, "approved")}
                >
                  承認
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus(r.id, "rejected")}
                >
                  差し戻し
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
