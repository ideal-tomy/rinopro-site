import type { Variants } from "framer-motion";

export const EASE_OUT = [0, 0, 0.2, 1] as const;
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;
/** Flutter Curves.easeOutBack（少し行き過ぎて戻る） */
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;
export const SPRING_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 25 };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const heroStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren" },
  },
};

/**
 * 非均等スタッガー用（Flutter _opacityFor(start, end) の翻訳）
 * custom: [start, end] で閾値区間を指定（0-1）
 */
export const heroStaggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: [number, number]) => {
    const [start, end] = custom;
    return {
      opacity: 1,
      y: 0,
      transition: {
        duration: (end - start) * 3,
        delay: start * 3,
        ease: EASE_SMOOTH,
      },
    };
  },
};

export const heroStaggerItemWithScale: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.94 },
  visible: (custom: [number, number]) => {
    const [start, end] = custom;
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: (end - start) * 3,
        delay: start * 3,
        ease: EASE_OUT_BACK,
      },
    };
  },
};
