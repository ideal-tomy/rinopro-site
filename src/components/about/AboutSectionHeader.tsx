import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

type AboutSectionHeaderProps = {
  id: string;
  kicker?: string;
  title: ReactNode;
  className?: string;
};

export function AboutSectionHeader({ id, kicker, title, className }: AboutSectionHeaderProps) {
  return (
    <header className={cn(styles.header, className)} {...aboutReveal()}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h2 id={id} className={styles.heading}>{title}</h2>
    </header>
  );
}
