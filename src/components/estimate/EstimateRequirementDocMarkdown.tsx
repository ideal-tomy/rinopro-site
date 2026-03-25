"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-5 text-xl font-bold text-white first:mt-0 md:text-2xl">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-4 text-lg font-bold text-white first:mt-0 md:text-xl">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-3 text-[16px] font-semibold text-white first:mt-0">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mt-2 text-[15px] leading-relaxed text-white/90 first:mt-0 md:text-[16px]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-2 list-inside list-disc space-y-1.5 pl-0.5 text-[15px] text-white/90 md:text-[16px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-2 list-inside list-decimal space-y-1.5 pl-0.5 text-[15px] text-white/90 md:text-[16px]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
};

export function EstimateRequirementDocMarkdown({ source }: { source: string }) {
  return (
    <div className="estimate-requirement-doc-md">
      <ReactMarkdown components={components}>{source}</ReactMarkdown>
    </div>
  );
}
