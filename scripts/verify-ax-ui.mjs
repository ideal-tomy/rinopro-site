#!/usr/bin/env node
/**
 * AXEON UI 移行 — 静的チェック + 検証 URL 一覧
 * 使い方: node scripts/verify-ax-ui.mjs
 * ブラウザ計測は docs/ui-migration/acceptance-matrix.md と併用。
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

const VIEWPORTS = [320, 375, 390, 430, 768, 1024, 1280, 1440];

const CRITICAL_URLS = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/services/consulting",
  "/services/insourcing-enablement",
  "/industries/construction",
  "/experience",
  "/estimate-detailed",
  "/lp/kaigo-care-dx",
  "/lp/chuken-enterprise-v2",
  "/prototype-showroom",
];

/** ページ本体で ax-page または data-ax-theme を期待するファイル */
const SHELL_MARKERS = [
  "src/components/home/HomeLandingPage.tsx",
  "src/components/about/AboutPageContent.tsx",
  "src/components/contact/ContactPageContent.tsx",
  "src/components/services/ServicesPageContent.tsx",
  "src/components/services/ConsultingPage.tsx",
  "src/components/services/EnablementPage.tsx",
  "src/components/industries/IndustryLpPage.tsx",
  "src/components/experience/ExperienceGalleryPageContent.tsx",
  "src/components/lp/KaigoCareDxPage.tsx",
  "src/components/lp/ChukenEnterpriseV2Page.tsx",
  "src/components/prototype-showroom/PrototypeShowroomContent.tsx",
];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next") continue;
      walk(p, acc);
    } else if (/\.(tsx|ts|css)$/.test(name.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const srcFiles = walk(join(root, "src"));

for (const file of srcFiles) {
  const text = readFileSync(file, "utf8");
  const rel = relative(root, file).replace(/\\/g, "/");

  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (
      /\btext-base\b/.test(line) &&
      !/\btext-base-dark\b/.test(line) &&
      !line.includes("text-base は使わない") &&
      !line.includes("text-base 禁止") &&
      !line.includes("`text-base`")
    ) {
      warnings.push(`${rel}:${i + 1}: text-base 残存の可能性 → ${line.trim().slice(0, 100)}`);
    }
  });
}

for (const rel of SHELL_MARKERS) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    errors.push(`シェル対象ファイル欠落: ${rel}`);
    continue;
  }
  const text = readFileSync(p, "utf8");
  if (!text.includes("ax-page") && !text.includes("data-ax-theme")) {
    errors.push(`ax-page / data-ax-theme 未検出: ${rel}`);
  }
}

const required = [
  "src/styles/axeon-ui.css",
  "src/styles/axeon-themes.css",
  "src/components/ui/ax/AxText.tsx",
  "src/components/ui/ax/patterns/AxProcessFlow.tsx",
  "src/app/lp/kaigo-care-dx/page.tsx",
  "src/app/lp/chuken-enterprise-v2/page.tsx",
  "docs/ui-migration/url-registry.md",
  "docs/ui-migration/acceptance-matrix.md",
  "docs/ui-migration/phase-e-scope.md",
  "docs/ui-migration/phase-f-backlog.md",
];

for (const p of required) {
  if (!existsSync(join(root, p))) {
    errors.push(`必須ファイル欠落: ${p}`);
  }
}

if (existsSync(join(root, "public/lp/kaigo-care-dx.html"))) {
  errors.push(
    "public/lp/kaigo-care-dx.html が残っています。docs/archive/lp へ退避済みか確認してください。"
  );
}

if (existsSync(join(root, "public/lp/chuken-enterprise-v2.html"))) {
  errors.push(
    "public/lp/chuken-enterprise-v2.html が残っています。docs/archive/lp へ退避済みか確認してください。"
  );
}

if (existsSync(join(root, "src/components/services/consulting-page.module.css"))) {
  warnings.push(
    "consulting-page.module.css が src に残存。参照ゼロなら archive へ。"
  );
}

console.log("=== AXEON UI verify-ax-ui ===\n");
console.log("検証幅 (px):", VIEWPORTS.join(", "));
console.log("\n必須確認 URL:");
for (const u of CRITICAL_URLS) {
  console.log(`  - ${u}`);
}
console.log(
  "\nブラウザで: document.documentElement.scrollWidth <= document.documentElement.clientWidth"
);
console.log("マトリクス: docs/ui-migration/acceptance-matrix.md");
console.log("F バックログ: docs/ui-migration/phase-f-backlog.md\n");

if (warnings.length) {
  console.log(`warnings (${warnings.length}):`);
  warnings.slice(0, 30).forEach((w) => console.log("  !", w));
  if (warnings.length > 30) console.log(`  …他 ${warnings.length - 30} 件`);
  console.log();
}

if (errors.length) {
  console.log(`errors (${errors.length}):`);
  errors.forEach((e) => console.log("  x", e));
  process.exit(1);
}

console.log("静的チェック: OK");
process.exit(0);
