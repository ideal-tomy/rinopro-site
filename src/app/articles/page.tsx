import { redirect } from "next/navigation";

/** 目次はトップ `#articles` が正本。ハブ URL は公開しない。 */
export default function ArticlesHubPage() {
  redirect("/#articles");
}
