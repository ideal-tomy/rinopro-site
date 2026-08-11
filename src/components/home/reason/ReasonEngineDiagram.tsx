"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.45, 0, 0.55, 1] as const;

function Pill({
  x,
  y,
  w,
  h,
  label,
  delay,
  animate,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  delay: number;
  animate: boolean;
}) {
  return (
    <motion.g
      initial={animate ? { opacity: 0 } : false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay, ease }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="white"
        stroke="var(--reason-primary)"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--reason-text)"
        fontSize={12}
        fontWeight={700}
        style={{ fontFamily: "inherit" }}
      >
        {label}
      </text>
    </motion.g>
  );
}

export function ReasonEngineDiagram() {
  const prefersReduced = useReducedMotion();
  const animate = prefersReduced !== true;

  return (
    <div
      className="mx-auto w-full max-w-[440px]"
      role="img"
      aria-label="現場の知恵と業務データが意思決定エンジンに入り、根拠つきの判断になる"
    >
      <svg
        viewBox="0 0 400 150"
        className="mx-auto block h-auto w-full"
        fill="none"
      >
        <Pill x={8} y={22} w={108} h={40} label="現場の知恵" delay={0} animate={animate} />
        <Pill x={8} y={88} w={108} h={40} label="業務データ" delay={0.1} animate={animate} />

        <motion.path
          d="M124 42 H132 V108 H124"
          stroke="var(--reason-primary)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: animate ? 0.25 : 0, ease }}
        />
        <motion.line
          x1={132}
          y1={75}
          x2={158}
          y2={75}
          stroke="var(--reason-primary)"
          strokeWidth={1.5}
          initial={animate ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: animate ? 0.4 : 0, ease }}
        />
        {animate ? (
          <motion.circle
            r={3}
            fill="var(--reason-primary)"
            initial={{ cx: 132, cy: 75, opacity: 0 }}
            whileInView={{
              cx: [132, 158],
              cy: 75,
              opacity: [0, 1, 1, 0],
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.5, ease: "easeInOut" }}
          />
        ) : null}

        <motion.g
          initial={animate ? { opacity: 0, scale: 0.94 } : false}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: animate ? 0.55 : 0, ease }}
          style={{ transformOrigin: "206px 75px" }}
        >
          <rect x={162} y={35} width={88} height={80} rx={12} fill="var(--reason-primary)" />
          <text
            x={206}
            y={68}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight={700}
            style={{ fontFamily: "inherit" }}
          >
            意思決定
          </text>
          <text
            x={206}
            y={86}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight={700}
            style={{ fontFamily: "inherit" }}
          >
            エンジン
          </text>
        </motion.g>

        <motion.line
          x1={258}
          y1={75}
          x2={286}
          y2={75}
          stroke="var(--reason-primary)"
          strokeWidth={1.5}
          initial={animate ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, delay: animate ? 0.85 : 0, ease }}
        />
        <motion.path
          d="M286 70 L296 75 L286 80"
          stroke="var(--reason-primary)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.2, delay: animate ? 1.05 : 0 }}
        />
        {animate ? (
          <motion.circle
            r={3}
            fill="var(--reason-primary)"
            initial={{ cx: 258, cy: 75, opacity: 0 }}
            whileInView={{
              cx: [258, 290],
              cy: 75,
              opacity: [0, 1, 1, 0],
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.95, ease: "easeInOut" }}
          />
        ) : null}

        <Pill
          x={300}
          y={55}
          w={92}
          h={40}
          label="根拠つきの判断"
          delay={animate ? 1.1 : 0}
          animate={animate}
        />
      </svg>
    </div>
  );
}
