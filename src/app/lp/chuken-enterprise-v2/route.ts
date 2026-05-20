import { readFile } from "node:fs/promises";
import path from "node:path";

/** 配布用スタンドアロンLP（Header/Footer なし）。原稿: public/lp/chuken-enterprise-v2.html */
const LP_HTML_PATH = path.join(
  process.cwd(),
  "public/lp/chuken-enterprise-v2.html"
);

export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(LP_HTML_PATH, "utf-8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
