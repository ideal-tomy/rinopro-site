import Image from "next/image";
import type { ConsultingDeliverableItem } from "@/lib/content/services-embedded-copy";
import { cn } from "@/lib/utils";

type ServiceDeliverableGridProps = {
  items: readonly ConsultingDeliverableItem[];
  note?: string;
  className?: string;
};

export function ServiceDeliverableGrid({
  items,
  note,
  className,
}: ServiceDeliverableGridProps) {
  return (
    <div className={className}>
      <ul className="grid list-none gap-4 sm:grid-cols-2 md:gap-5">
        {items.map((item) => (
          <li
            key={item.label}
            className="overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
          >
            <div className="relative aspect-[16/10] w-full bg-[var(--color-bg-neutral)]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                style={
                  item.objectPosition
                    ? { objectPosition: item.objectPosition }
                    : undefined
                }
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </div>
            <div className="px-4 py-3 md:px-5 md:py-4">
              <p className="text-[15px] font-semibold text-text md:text-[16px]">
                {item.label}
              </p>
              <p className="mt-1 text-[14px] text-text-sub">{item.caption}</p>
            </div>
          </li>
        ))}
      </ul>
      {note ? (
        <p className={cn("mt-4 text-left text-[14px] leading-[1.8] text-text-sub md:text-[15px]")}>
          {note}
        </p>
      ) : null}
    </div>
  );
}
