import Image from "next/image";
import styles from "./consulting-page.module.css";

const ILLUSTRATION = {
  consulting: {
    src: "/images/about/about01.png",
    alt:
      "戦略コンサルティングとITコンサルティングを中心に示した、戦略から運用までの5工程の図。",
  },
  enablement: {
    src: "/images/about/abput02png.png",
    alt:
      "システム開発・導入・展開・運用・保守を中心に示した、戦略から運用までの5工程の図。",
  },
} as const;

export type ServiceHeroIllustrationKey = keyof typeof ILLUSTRATION;

type ServiceHeroIllustrationProps = {
  pageKey: ServiceHeroIllustrationKey;
  priority?: boolean;
};

export function ServiceHeroIllustration({
  pageKey,
  priority = false,
}: ServiceHeroIllustrationProps) {
  const { src, alt } = ILLUSTRATION[pageKey];

  return (
    <div className={styles.imageWrap}>
      <Image
        src={src}
        alt={alt}
        width={1536}
        height={1024}
        sizes="(max-width: 899px) calc(100vw - 40px), 56vw"
        priority={priority}
      />
    </div>
  );
}
