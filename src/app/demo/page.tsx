import { permanentRedirect } from "next/navigation";

/** 体験ハブは `/experience` に統合（ブックマーク・設定は next.config redirects と二重） */
export default function DemoPage() {
  permanentRedirect("/experience");
}
