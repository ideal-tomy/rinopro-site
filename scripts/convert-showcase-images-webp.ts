/**
 * 事例・スクショ用 PNG を WebP に変換（public/images 直下のみ）。
 * 実行: npx tsx scripts/convert-showcase-images-webp.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "public", "images");

async function main() {
  const names = fs.readdirSync(root).filter((n) => n.toLowerCase().endsWith(".png"));
  for (const name of names) {
    const input = path.join(root, name);
    const base = name.replace(/\.png$/i, "");
    const output = path.join(root, `${base}.webp`);
    await sharp(input).webp({ quality: 85 }).toFile(output);
    console.log(`${name} -> ${base}.webp`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
