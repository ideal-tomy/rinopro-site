import { permanentRedirect } from "next/navigation";

export default function LegacyDevelopmentFlowPage() {
  permanentRedirect("/flow");
}
