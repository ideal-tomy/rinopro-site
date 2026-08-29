import { ArticleTocDirectory } from "./ArticleTocDirectory";

/** TOP — 業界／よくある悩みの短い目次。各行は記事へ直リンク */
export function HomeArticleToc() {
  return (
    <section
      id="articles"
      className="article-toc-scope container mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-6 md:py-[120px]"
      aria-labelledby="home-articles-heading"
    >
      <h2
        id="home-articles-heading"
        className="mb-3 text-[clamp(26px,5.6vw,40px)] font-bold leading-[1.5] text-[var(--article-text)] md:mb-4"
      >
        仕事の名前から読む。
      </h2>
      <p className="mb-6 max-w-[640px] text-[16px] leading-[1.75] text-[var(--color-text-secondary)] md:mb-7 md:text-[17px]">
        業界ごとの実務の話です。短い名前をクリックすると、その記事へ飛びます。
      </p>

      <ArticleTocDirectory />
    </section>
  );
}
