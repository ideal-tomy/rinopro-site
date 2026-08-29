import { PageSectionWithScroll } from "@/components/layout/PageSectionWithScroll";
import { ServiceValueBand } from "@/components/services/ServiceValueBand";
import { SupportPillarCards } from "@/components/services/SupportPillarCards";
import { supportHubCopy } from "@/lib/content/support-pillars";

export function ServicesPageContent() {
  return (
    <PageSectionWithScroll
      title={supportHubCopy.title}
      headingClassName="text-center"
    >
      <p className="mx-auto mb-8 max-w-2xl text-center text-[16px] leading-[1.8] text-text-sub md:mb-10 md:text-[17px]">
        {supportHubCopy.purpose}
      </p>

      <div className="mx-auto w-full max-w-5xl">
        <ServiceValueBand className="mb-10 md:mb-12" />
        <SupportPillarCards />
      </div>
    </PageSectionWithScroll>
  );
}
