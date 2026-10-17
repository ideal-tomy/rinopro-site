import { HOME_CLOSING_CTA_STYLES } from "./home-presentation";
import Link from "next/link";
import { AxPhrases } from "@/components/ui/ax/AxPhrases";

const HEADING = ["簡単なお悩みから", "課題を明確にします。"] as const;
const BODY = [
  "「なんとなく非効率な気がする」——",
  "その段階からで構いません。",
  "お話を伺いながら、",
  "まずは触れるデモのかたちでご提案します。",
  "デモのカスタマイズ相談だけでも歓迎です。",
] as const;

export function HomeClosingCta() {
  return (
    <section
      id="cta"
      className={HOME_CLOSING_CTA_STYLES.section}
      aria-labelledby="home-closing-cta-heading"
    >
      <div className={HOME_CLOSING_CTA_STYLES.container}>
        <h2
          id="home-closing-cta-heading"
          className={HOME_CLOSING_CTA_STYLES.heading}
        >
          <AxPhrases phrases={HEADING} />
        </h2>
        <p className={HOME_CLOSING_CTA_STYLES.body}>
          <AxPhrases phrases={BODY} />
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className={HOME_CLOSING_CTA_STYLES.primaryCta}
          >
            お問い合わせ
          </Link>
        </div>

        <p className="mt-8">
          <Link
            href="/estimate-detailed"
            className={HOME_CLOSING_CTA_STYLES.estimateLink}
          >
            概算の感触を先に見る →
          </Link>
        </p>
      </div>
    </section>
  );
}
