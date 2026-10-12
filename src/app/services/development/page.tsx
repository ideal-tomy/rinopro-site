import { permanentRedirect } from "next/navigation";

/** 旧URLは互換導線として半内製化（FED）へ統合 */
export default function ServicesDevelopmentPage() {
  permanentRedirect("/services/insourcing-enablement");
}
