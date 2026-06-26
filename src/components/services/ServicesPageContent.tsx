import { PageSectionWithScroll } from "@/components/layout/PageSectionWithScroll";
import { ServiceCatalogGrid } from "@/components/services/ServiceCatalogGrid";
import { ServiceValueBand } from "@/components/services/ServiceValueBand";
import { servicesCopy } from "@/lib/content/site-copy";

export function ServicesPageContent() {
  return (
    <PageSectionWithScroll
      title={servicesCopy.title}
      headingClassName="text-center"
    >
      <p className="mx-auto mb-8 max-w-2xl text-center text-[16px] leading-[1.8] text-text-sub md:mb-10 md:text-[17px]">
        {servicesCopy.purpose}
      </p>

      <div className="mx-auto w-full max-w-4xl">
        <ServiceValueBand className="mb-10 md:mb-12" />
        <ServiceCatalogGrid />
      </div>
    </PageSectionWithScroll>
  );
}
