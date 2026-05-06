import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として /services/development へ統合 */
export default function FlowLegacyPage() {
  permanentRedirect("/services/development");
}
