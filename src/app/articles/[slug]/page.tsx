import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleShadowHost } from "@/components/articles/ArticleShadowHost";
import { PageShell } from "@/components/layout/PageShell";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  industryArticles,
} from "@/data/articles";
import { readArticleHtml } from "@/lib/articles/load-html";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "現場の記事" };
  return {
    title: article.title.replace(/。$/, ""),
    description: article.description,
    openGraph: {
      title: article.title.replace(/。$/, ""),
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const html = readArticleHtml(slug);

  if (!article || !html) {
    notFound();
  }

  const others = industryArticles.filter((a) => a.slug !== slug);

  return (
    <PageShell>
      <div className="min-h-screen">
        <div className="border-b border-[var(--color-border-light)]">
          <div className="mx-auto flex w-[min(100%-40px,940px)] flex-wrap items-center gap-x-2 py-1.5 text-xs text-[var(--color-text-secondary)]">
            <Link
              href="/#articles"
              className="no-underline hover:text-[var(--color-accent-primary)] hover:no-underline"
            >
              現場の記事
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--color-text-primary)]">
              {article.hubIndustry}
            </span>
          </div>
        </div>

        <ArticleShadowHost html={html} />

        {others.length > 0 && (
          <section className="border-t border-[var(--color-border-light)] py-8">
            <div className="mx-auto w-[min(100%-40px,620px)]">
              <h2 className="mb-3 text-xs tracking-[0.08em] text-[var(--color-text-secondary)]">
                ほかの記事
              </h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/articles/${item.slug}`}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"
                    >
                      {item.hubIndustry}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5">
                <Link
                  href="/#articles"
                  className="text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-accent-primary)] hover:no-underline"
                >
                  目次に戻る
                </Link>
              </p>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
