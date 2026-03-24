import { redirect } from "next/navigation";

/** 体験ハブは `/demo` に統合 */
export default function ExperienceIndexPage() {
  redirect("/demo");
}
