"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_OUT_BACK } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/** ふわっとゆっくり浮かび上がるポップアップ（easeOutBack） */
const popupVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE_OUT_BACK,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function ChatPopup({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: ChatPopupProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-popup-title"
          aria-describedby="chat-popup-description"
        >
          <motion.div
            className="absolute inset-0 bg-base/80 backdrop-blur-lg"
            variants={prefersReducedMotion ? undefined : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onOpenChange(false)}
            aria-hidden
          />
          <motion.div
            className={cn(
              "relative flex max-h-[85vh] min-h-0 w-full max-w-md flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark shadow-2xl",
              "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-base",
              className
            )}
            variants={prefersReducedMotion ? undefined : popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-silver/20 px-4 py-3">
              <div>
                <h2
                  id="chat-popup-title"
                  className="font-semibold text-text"
                >
                  {title}
                </h2>
                <p
                  id="chat-popup-description"
                  className="text-sm text-text-sub"
                >
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-2 opacity-70 ring-offset-base transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
