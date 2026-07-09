import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PrototypeShowroomContent } from "@/components/prototype-showroom/PrototypeShowroomContent";
import { PROTOTYPE_SHOWROOM_METADATA } from "@/lib/content/prototype-showroom";

export const metadata: Metadata = {
  title: PROTOTYPE_SHOWROOM_METADATA.title,
  description: PROTOTYPE_SHOWROOM_METADATA.description,
  robots: { index: false, follow: false },
};

export default function PrototypeShowroomPage() {
  return (
    <PageShell>
      <PrototypeShowroomContent />
    </PageShell>
  );
}
