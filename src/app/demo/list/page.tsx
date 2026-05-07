import { permanentRedirect } from "next/navigation";

/** demo 一覧は `/experience` に統合 */
export default function DemoListPage() {
  permanentRedirect("/experience");
}
