import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として半内製化（FDE）へ統合 */
export default function FlowLegacyPage() {
  permanentRedirect("/services/insourcing-enablement");
}
