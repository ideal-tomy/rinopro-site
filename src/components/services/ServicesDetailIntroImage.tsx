import Image from "next/image";
import { cn } from "@/lib/utils";

type ServicesDetailIntroImageProps = {
  className?: string;
};

export function ServicesDetailIntroImage({
  className,
}: ServicesDetailIntroImageProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]",
        className
      )}
    >
      <Image
        src="/images/services01.jpg"
        alt="AXEONの開発・コンサルティングサービスのイメージ"
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, 672px"
      />
    </div>
  );
}
