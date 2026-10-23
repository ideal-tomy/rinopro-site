const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../ideal_official/node_modules/playwright'));
const entries = [
  ['manufacturing-quality', 'https://axeonmanufacturing02.vercel.app/'],
  ['approval', 'https://approval-diagram.vercel.app/'],
  ['childcare', 'https://childcare-demo-six.vercel.app/'],
  ['manufacturing-hub', 'https://product-flow-jet.vercel.app/manufacturing'],
  ['knowledge', 'https://internal-knowledge-demo.vercel.app/'],
  ['genpo', 'https://kanri-kensetsu.vercel.app/'],
  ['recruit', 'https://saiyou-demo0420.vercel.app/'],
  ['building-os', 'https://obs-demo.vercel.app/'],
  ['agriculture', 'https://oriza-copilot.vercel.app/'],
  ['care', 'https://kaigo-operation-demo.vercel.app/'],
  ['dd', 'https://dd-demo-red.vercel.app/'],
  ['estate', 'https://openestate-demo.gembashift.com/'],
  ['handover', 'https://lambent-smakager-7bcf0a.netlify.app/'],
  ['matching', 'https://candid-salmiakki-22e9c7.netlify.app/'],
];
const results = [];
const output = path.resolve(__dirname, '../docs/demo-brand-verification/other-external-audit.json');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    async function audit([id, entry]) {
      const page = await browser.newPage();
      const pages = [];
      async function inspect(url) {
        try {
          const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
          const data = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a')).map(a => {
              const raw = a.getAttribute('href') || '';
              let href = raw;
              try { href = new URL(raw, location.href).href; } catch {}
              return { text: a.textContent.trim().slice(0, 160), href };
            });
            return {
              title: document.title,
              links: anchors,
              logoImages: Array.from(document.querySelectorAll('img')).map(x => ({ alt: x.alt, src: x.src })).filter(x => /logo|brand|axeon|ideal/i.test(x.alt + x.src)),
              idealVisible: (document.body.innerText.match(/.{0,30}\bideal\b.{0,60}/gi) || []).slice(0, 8),
            };
          });
          const origin = new URL(page.url()).origin;
          pages.push({ url, finalUrl: page.url(), status: response?.status(), title: data.title, externalLinks: data.links.filter(a => /^(https?:|mailto:)/.test(a.href) && !a.href.startsWith(origin + '/')), logoImages: data.logoImages, idealVisible: data.idealVisible });
          return data.links.filter(a => {
            try { const u = new URL(a.href); return u.origin === origin && u.pathname !== new URL(page.url()).pathname && !/\.(png|jpg|svg|pdf|zip)$/.test(u.pathname) && !/logout|signout|delete|remove|api\//i.test(u.pathname); } catch { return false; }
          }).map(a => a.href);
        } catch (error) {
          pages.push({ url, error: error.message });
          return [];
        }
      }
      try {
        const next = await inspect(entry);
        const routes = Array.from(new Set(next.map(url => { const u = new URL(url); u.hash = ''; return u.href; }))).slice(0, 2);
        for (const route of routes) await inspect(route);
        results.push({ id, entry, pages });
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, JSON.stringify(results, null, 2) + '\n');
        console.log(`${id}: ${pages.length} pages, ${pages.reduce((n, p) => n + (p.externalLinks?.length || 0), 0)} external links`);
      } finally {
        await page.close();
      }
    }
    for (let i = 0; i < entries.length; i += 3) await Promise.all(entries.slice(i, i + 3).map(audit));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
