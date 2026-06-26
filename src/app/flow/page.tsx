import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として /services/ai-apps へ統合 */
export default function FlowLegacyPage() {
  permanentRedirect("/services/ai-apps");
}
