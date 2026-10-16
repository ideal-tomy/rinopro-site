import fs from "node:fs";
import path from "node:path";

const articlesDir = path.join(process.cwd(), "content", "articles");
const themeArticlesDir = path.join(articlesDir, "t");

export function readArticleHtml(slug: string): string | null {
  const filePath = path.join(articlesDir, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function readThemeArticleHtml(slug: string): string | null {
  const filePath = path.join(themeArticlesDir, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}
