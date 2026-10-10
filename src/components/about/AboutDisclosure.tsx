"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./about-page.module.css";

type AboutDisclosureProps = {
  id: string;
  summary: ReactNode;
  headingClassName?: string;
  children: ReactNode;
};

/** Collapsible on mobile only; on desktop the heading is static and the panel is always shown. */
export function AboutDisclosure({ id, summary, headingClassName, children }: AboutDisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.disclosure} data-open={open}>
      <h3 className={cn(styles.disclosureHeading, headingClassName)}>
        <button
          type="button"
          className={styles.disclosureToggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {summary}
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </button>
        <span className={styles.disclosureStatic}>{summary}</span>
      </h3>
      <div id={id} className={styles.disclosurePanel}>{children}</div>
    </div>
  );
}
