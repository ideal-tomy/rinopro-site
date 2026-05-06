import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として /services/consulting へ統合 */
export default function ConsultingLegacyPage() {
  permanentRedirect("/services/consulting");
}
