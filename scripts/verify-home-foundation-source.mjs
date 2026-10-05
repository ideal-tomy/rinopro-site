import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='docs/ui-foundation-2026-10-05/';
const before=JSON.parse(fs.readFileSync(root+'source-before.json','utf8'));
const groups={};for(const m of fs.readFileSync('src/components/home/home-presentation.ts','utf8').matchAll(/export const (\w+) = (\{[\s\S]*?\}) as const;/g))groups[m[1]]=JSON.parse(m[2]);
let checked=0;
for(const [file,original]of Object.entries(before)){
if(file==='src/lib/content/home-landing-styles.ts')continue;
let current=fs.readFileSync(file,'utf8').replace(/^import \{ \w+_STYLES \} from "\.\/home-presentation";\r?\n/,'');
for(const [name,values]of Object.entries(groups))for(const [key,value]of Object.entries(values)){
current=current.replaceAll('className={'+name+'.'+key+'}','className='+JSON.stringify(value));
current=current.replaceAll(name+'.'+key,JSON.stringify(value));
}
current=current.replaceAll('LANDING_CTA_BUTTON_CLASS','homeLandingCtaButtonClass').replaceAll('@/lib/ui/landing-cta-styles','@/lib/content/home-landing-styles');
assert.equal(current.replaceAll('\r\n','\n'),original.replaceAll('\r\n','\n'),file);
checked++;
}
const oldCta=before['src/lib/content/home-landing-styles.ts'].match(/=\s*"([^"]+)"/)[1];
assert.ok(fs.readFileSync('src/lib/ui/landing-cta-styles.ts','utf8').includes(JSON.stringify(oldCta)));
console.log(`PASS: ${checked} files preserve JSX, class strings, copy and links; shared CTA value unchanged.`);
