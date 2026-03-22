import { permanentRedirect } from "next/navigation";

export default function LegacyConsultingPage() {
  permanentRedirect("/consulting");
}
