import { ServiceJourneyDiagram } from "@/components/services/ServiceJourneyDiagram";
import { servicesValueBandCopy } from "@/lib/content/services-embedded-copy";
import { serviceReading } from "@/lib/ui/service-reading-styles";
import { cn } from "@/lib/utils";

type ServiceValueBandProps = {
  className?: string;
};

export function ServiceValueBand({ className }: ServiceValueBandProps) {
  const { title, lead, journeySteps } = servicesValueBandCopy;

  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] px-5 py-8 md:px-8 md:py-10",
        className
      )}
      aria-labelledby="services-value-band-heading"
    >
      <h2
        id="services-value-band-heading"
        className="text-balance text-center text-xl font-bold leading-snug text-text md:text-2xl"
      >
        {title}
      </h2>
      <p
        className={cn(
          "mx-auto mt-4 max-w-[48ch] text-center",
          serviceReading.body
        )}
      >
        {lead}
      </p>
      <div className="mt-8 md:mt-10">
        <ServiceJourneyDiagram steps={journeySteps} />
      </div>
    </section>
  );
}
