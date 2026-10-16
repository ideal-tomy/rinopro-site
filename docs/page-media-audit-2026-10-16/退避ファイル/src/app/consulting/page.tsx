import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線としてコンサルティング詳細へ統合 */
export default function ConsultingLegacyPage() {
  permanentRedirect("/services/consulting");
}
