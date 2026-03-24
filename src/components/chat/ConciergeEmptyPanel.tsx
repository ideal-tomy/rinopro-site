"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function hintForPath(pathname: string): { title: string; body: string } {
  if (pathname === "/demo/list") {
    return {
      title: "demo一覧の案内",
      body: "用途やキーワードを入力いただくと、一覧の中から近いものを一緒に探しやすくなります。下の入力欄からお試しください。",
    };
  }
  if (pathname.startsWith("/demo/")) {
    return {
      title: "このデモについて",
      body: "画面の見方や想定ユースケースなど、下の入力欄からお気軽にご質問ください。",
    };
  }
  return {
    title: "ご相談",
    body: "下の入力欄から、ご質問やご要望を自由にお送りください。",
  };
}

export function ConciergeEmptyPanel({
  pathname,
  className,
  children,
}: {
  pathname: string;
  className?: string;
  /** 先頭に追加するブロック（例: /services 選択後の説明） */
  children?: ReactNode;
}) {
  const { title, body } = hintForPath(pathname);
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
      {children}
      <div className="border-b border-silver/15 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          {title}
        </p>
        <p className="mt-1 text-sm text-text-sub">{body}</p>
      </div>
    </div>
  );
}
