"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  { label: "課題を聞く" },
  {
    label: "デモを作る",
    caption: "最短1〜2週間",
    emphasis: true,
  },
  { label: "触って判断" },
] as const;

function Connector({ delay, animate }: { delay: number; animate: boolean }) {
  return (
    <div
      className="relative mx-0.5 flex h-8 w-6 shrink-0 items-center self-center sm:mx-1.5 sm:w-10"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--reason-primary)]/20" />
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-[var(--reason-primary)]"
        initial={animate ? { scaleX: 0 } : { scaleX: 1 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, delay, ease: [0.45, 0, 0.55, 1] }}
      />
      {animate ? (
        <motion.span
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--reason-primary)]"
          initial={{ left: "0%", opacity: 0 }}
          whileInView={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: delay + 0.2, ease: "easeInOut" }}
        />
      ) : null}
      <motion.span
        className="absolute top-1/2 right-0 h-0 w-0 -translate-y-1/2 border-y-[4px] border-y-transparent border-l-[6px] border-l-[var(--reason-primary)]"
        initial={animate ? { opacity: 0 } : { opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.25, delay: delay + 0.45 }}
      />
    </div>
  );
}

export function ReasonFlowDiagram() {
  const prefersReduced = useReducedMotion();
  const animate = prefersReduced !== true;

  return (
    <div
      className="mx-auto flex w-full max-w-[440px] items-stretch justify-center"
      role="img"
      aria-label="課題を聞く、デモを作る、触って判断の流れ"
    >
      {STEPS.map((step, i) => (
        <Fragment key={step.label}>
          <motion.div
            className={`flex min-h-[88px] min-w-0 flex-1 flex-col items-center justify-center rounded-[10px] border px-2 py-3 text-center sm:min-h-[96px] sm:px-3.5 ${
              "emphasis" in step && step.emphasis
                ? "border-[var(--reason-primary)] bg-[color-mix(in_srgb,var(--reason-primary)_12%,white)] shadow-[0_1px_0_color-mix(in_srgb,var(--reason-primary)_18%,transparent)]"
                : "border-[color-mix(in_srgb,var(--reason-primary)_22%,#cbd5e1)] bg-white/70"
            }`}
            initial={animate ? { opacity: 0, y: 10 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.4,
              delay: animate ? i * 0.15 : 0,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            <span className="text-[13px] font-bold leading-snug tracking-wide text-[var(--reason-text)] sm:text-[14px]">
              {step.label}
            </span>
            {"caption" in step && step.caption ? (
              <span className="mt-1.5 text-[10px] font-medium tracking-wide text-[var(--reason-muted)] sm:text-[11px]">
                {step.caption}
              </span>
            ) : null}
          </motion.div>

          {i < STEPS.length - 1 ? (
            <Connector delay={animate ? 0.12 + i * 0.2 : 0} animate={animate} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
