"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";
import { isSafeAssistantInternalPath } from "@/lib/chat/assistant-internal-path";
import {
  linkifyBareInternalPathsForAssistant,
  normalizeAssistantMarkdownArtifacts,
} from "@/lib/chat/assistant-linkify";
import { emitConciergeNavigateFromChatLink } from "@/lib/chat/concierge-navigate-from-chat";

/**
 * コンシェルジュが返す `[表示名](/path)` をクリック可能にする。
 * 同一オリジン相当のパス（先頭 `/`）のみリンク化。それ以外はテキストのまま。
 */

function AssistantMarkdownInternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-accent underline underline-offset-2 hover:text-accent/90"
      onClick={() => emitConciergeNavigateFromChatLink()}
    >
      {children}
    </Link>
  );
}

const assistantMarkdownComponents: Components = {
  a({ href, children }) {
    if (!isSafeAssistantInternalPath(href)) {
      return <span className="text-text/90">{children}</span>;
    }
    return <AssistantMarkdownInternalLink href={href}>{children}</AssistantMarkdownInternalLink>;
  },
  p({ children }) {
    return (
      <p className="mb-2 text-[12px] leading-relaxed text-text last:mb-0 sm:text-sm">{children}</p>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-white/95">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-text">{children}</em>;
  },
  ul({ children }) {
    return <ul className="mb-2 list-disc pl-4 text-sm leading-relaxed last:mb-0">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="mb-2 list-decimal pl-4 text-sm leading-relaxed last:mb-0">{children}</ol>;
  },
  li({ children }) {
    return <li className="mb-0.5">{children}</li>;
  },
  code({ className, children, ...props }) {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code
          className={cn("block font-mono text-[11px] text-text sm:text-[13px]", className)}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-base/80 px-1 py-0.5 font-mono text-[13px] text-accent/95"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre({ children }) {
    return (
      <pre className="mb-2 overflow-x-auto rounded-md border border-silver/20 bg-base/80 p-2 last:mb-0">
        {children}
      </pre>
    );
  },
  h1: ({ children }) => (
    <p className="mb-1 text-[12px] font-semibold text-white/95 sm:text-sm">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="mb-1 text-[12px] font-semibold text-white/95 sm:text-sm">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="mb-1 text-[12px] font-semibold text-white/95 sm:text-sm">{children}</p>
  ),
  blockquote({ children }) {
    return (
      <blockquote className="mb-2 border-l-2 border-accent/40 pl-3 text-[12px] text-text/90 last:mb-0 sm:text-sm">
        {children}
      </blockquote>
    );
  },
  hr: () => <hr className="my-2 border-silver/20" />,
  img: () => null,
};

export function AssistantMarkdown({ content }: { content: string }) {
  const linked = linkifyBareInternalPathsForAssistant(
    normalizeAssistantMarkdownArtifacts(content)
  );
  return (
    <div className="assistant-md text-[12px] text-text sm:text-sm">
      <ReactMarkdown components={assistantMarkdownComponents}>{linked}</ReactMarkdown>
    </div>
  );
}
