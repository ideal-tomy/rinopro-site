import Image from "next/image";
import { CONSULTING_STEP_MEDIA_BY_KEY } from "@/lib/content/consulting-step-media";
import { serviceReading } from "@/lib/ui/service-reading-styles";
import { cn } from "@/lib/utils";

export type ServiceProcessZigzagStep = {
  step: string;
  title: string;
  subtitle: string;
  body: string;
  mediaKey: string;
};

type ServiceProcessZigzagProps = {
  steps: readonly ServiceProcessZigzagStep[];
  className?: string;
};

function StepMedia({
  mediaKey,
  className,
}: {
  mediaKey: string;
  className?: string;
}) {
  const media = CONSULTING_STEP_MEDIA_BY_KEY[mediaKey];
  if (!media) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          style={
            media.objectPosition
              ? { objectPosition: media.objectPosition }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>
    </div>
  );
}

export function ServiceProcessZigzag({
  steps,
  className,
}: ServiceProcessZigzagProps) {
  return (
    <ol className={cn("m-0 list-none space-y-12 p-0 md:space-y-16", className)}>
      {steps.map((step, i) => (
        <li key={step.step}>
          <div className="md:hidden">
            <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent/80">
              Step {step.step}
            </p>
            <h3 className="text-lg font-semibold text-text">{step.title}</h3>
            <p className="mt-1 text-[14px] font-medium text-accent">
              {step.subtitle}
            </p>
            <StepMedia mediaKey={step.mediaKey} className="mt-5" />
            <p className={cn("mt-5", serviceReading.body)}>{step.body}</p>
          </div>

          <div
            className={cn(
              "hidden md:grid md:grid-cols-2 md:items-center md:gap-10",
              i % 2 === 1 && "[&>div:first-child]:md:order-2 [&>div:last-child]:md:order-1"
            )}
          >
            <div className="text-left">
              <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent/80">
                Step {step.step}
              </p>
              <h3 className="text-xl font-semibold text-text">{step.title}</h3>
              <p className="mt-1 text-[15px] font-medium text-accent">
                {step.subtitle}
              </p>
              <p className={cn("mt-5 max-w-prose", serviceReading.body)}>
                {step.body}
              </p>
            </div>
            <StepMedia mediaKey={step.mediaKey} />
          </div>
        </li>
      ))}
    </ol>
  );
}
