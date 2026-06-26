"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  consultingBlocksCopy,
  type ConsultingBlockCopy,
} from "@/lib/content/services-embedded-copy";
import { ServiceDeliverableGrid } from "@/components/services/ServiceDeliverableGrid";
import { ServiceProcessZigzag } from "@/components/services/ServiceProcessZigzag";
import { serviceReading } from "@/lib/ui/service-reading-styles";
import { cn } from "@/lib/utils";

const EASE_MIST = [0.22, 1, 0.36, 1] as const;

function mistVariants(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.25 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_MIST },
    },
  };
}

function BlockHeader({
  kicker,
  heading,
}: {
  kicker: string;
  heading: string;
}) {
  return (
    <header className="mb-6 md:mb-8">
      <p className="mb-2 text-[13px] font-medium tracking-[0.12em] text-accent md:text-[14px]">
        {kicker}
      </p>
      <h2 className="text-balance text-xl font-semibold leading-snug text-text md:text-2xl">
        {heading}
      </h2>
    </header>
  );
}

function renderBlock(block: ConsultingBlockCopy) {
  switch (block.variant) {
    case "cards":
      return (
        <>
          <BlockHeader kicker={block.kicker} heading={block.heading} />
          <ul className="grid list-none gap-3 md:grid-cols-2 md:gap-4">
            {block.items.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-3 text-left text-[15px] leading-[1.75] text-text-sub md:px-5 md:py-4 md:text-[16px]"
              >
                <span className="inline-flex items-start gap-2">
                  <span
                    className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
                    aria-hidden
                  />
                  <span>{line}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      );
    case "band":
      return (
        <div className="rounded-xl bg-accent-primary-light/40 px-5 py-6 md:px-8 md:py-8">
          <BlockHeader kicker={block.kicker} heading={block.heading} />
          <p className={cn("max-w-prose", serviceReading.body)}>{block.body}</p>
        </div>
      );
    case "zigzag":
      return (
        <>
          <BlockHeader kicker={block.kicker} heading={block.heading} />
          <ServiceProcessZigzag steps={block.steps} />
        </>
      );
    case "thumbnails":
      return (
        <>
          <BlockHeader kicker={block.kicker} heading={block.heading} />
          <ServiceDeliverableGrid items={block.items} note={block.note} />
        </>
      );
    case "assurance":
      return (
        <>
          <BlockHeader kicker={block.kicker} heading={block.heading} />
          <ul className="grid list-none gap-4 md:grid-cols-3 md:gap-5">
            {block.costCards.map((card) => (
              <li
                key={card.title}
                className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-4 py-5 md:px-5"
              >
                <p className="text-[15px] font-semibold text-text md:text-[16px]">
                  {card.title}
                </p>
                <p className={cn("mt-2", serviceReading.body)}>{card.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 md:mt-10">
            {block.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 open:pb-5 md:px-6"
              >
                <summary className="cursor-pointer list-none text-[16px] font-semibold leading-snug text-text [&::-webkit-details-marker]:hidden">
                  Q. {item.q}
                </summary>
                <p className={cn("mt-3", serviceReading.body)}>A. {item.a}</p>
              </details>
            ))}
          </div>
        </>
      );
    default:
      return null;
  }
}

type ServiceConsultingBlocksProps = {
  className?: string;
};

export function ServiceConsultingBlocks({ className }: ServiceConsultingBlocksProps) {
  const reduce = useReducedMotion();
  const v = mistVariants(!!reduce);

  return (
    <div className={cn("flex flex-col gap-10 md:gap-14", className)}>
      {consultingBlocksCopy.map((block, i) => (
        <motion.section
          key={block.id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={v}
          transition={{ delay: reduce ? 0 : 0.06 + i * 0.04 }}
        >
          {renderBlock(block)}
        </motion.section>
      ))}
    </div>
  );
}
