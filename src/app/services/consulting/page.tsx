import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として /services/dx-strategy へ統合 */
export default function ServicesConsultingPage() {
  permanentRedirect("/services/dx-strategy");
}
