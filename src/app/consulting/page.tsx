import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として /services/dx-strategy へ統合 */
export default function ConsultingLegacyPage() {
  permanentRedirect("/services/dx-strategy");
}
