import type { Variants } from "framer-motion";

export const EASE_OUT = [0, 0, 0.2, 1] as const;
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;
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
