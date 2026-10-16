import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { getAllArticleSlugs, getAllThemeArticleSlugs } from '../src/data/articles';
import { getAllIndustryLpSlugs } from '../src/lib/content/industry-lp';
import { getAllIndustryShowcaseSlugs } from '../src/lib/content/industry-showcase';
import { FLAGSHIP_CASE_STUDY_SLUGS } from '../src/lib/content/implementation-showcase';
import { ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS } from '../src/lib/content/experience-gallery';
import { EXPERIENCE_PROTOTYPES } from '../src/lib/experience/prototype-registry';

async function main() {
const root = process.cwd();
const out = 'docs/page-media-audit-2026-10-16';
fs.mkdirSync(out, {recursive:true});
const cached=process.argv.includes('--reuse')?JSON.parse(fs.readFileSync(`${out}/audit.json`,'utf8')):null;
const slash = (s:string) => s.replaceAll('\\','/');
function walk(dir:string):string[] { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]); }
const sourceFiles = [...walk('src'),...walk('content'),...walk('public').filter(f=>/\.(html|css|js|json)$/.test(f))];
const texts = new Map(sourceFiles.filter(f=>/\.(tsx?|jsx?|css|html|json|svg)$/.test(f)).map(f=>[f,fs.readFileSync(f,'utf8')]));
const config = ts.readConfigFile('tsconfig.json',ts.sys.readFile).config;
const options = ts.parseJsonConfigFileContent(config,ts.sys,root).options;
const graph = new Map<string,string[]>();
const dynamicPatterns:{file:string,pattern:RegExp}[]=[];
for (const [file,body] of texts) {
 const deps:string[]=[];
 const ast=ts.createSourceFile(file,body,ts.ScriptTarget.Latest,true);
 function visit(n:ts.Node) {
  if(ts.isTemplateExpression(n) && /\/(images|media|lp)\//.test(n.head.text)) {
   const escape=(v:string)=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   dynamicPatterns.push({file,pattern:new RegExp(escape(n.head.text)+n.templateSpans.map(s=>'[^/]*'+escape(s.literal.text)).join(''))});
  }
  let spec:string|undefined;
  if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) spec=n.moduleSpecifier.text;
  if(ts.isCallExpression(n) && (n.expression.kind===ts.SyntaxKind.ImportKeyword || n.expression.getText(ast)==='require') && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) spec=n.arguments[0].text;
  if(spec && (spec.startsWith('.')||spec.startsWith('@/'))) {
   const resolved=ts.resolveModuleName(spec,path.resolve(file),options,ts.sys).resolvedModule?.resolvedFileName;
   if(resolved) deps.push(slash(path.relative(root,resolved)));
  }
  ts.forEachChild(n,visit);
 }
 visit(ast); graph.set(file,deps);
}
function closure(seeds:string[]) { const seen=new Set<string>(); function add(f:string) { if(seen.has(f))return;seen.add(f); for(const d of graph.get(f)??[])add(d); } seeds.forEach(add);return seen; }
const pages = [...texts.keys()].filter(f=>/\/page\.tsx$/.test(f));
const candidates = new Map<string,string>();
for(const f of pages) {const u='/'+f.replace(/^src\/app\/?/,'').replace(/\/?page\.tsx$/,'');if(!u.includes('['))candidates.set(u,f);}
function addSlugs(prefix:string,slugs:readonly string[],file:string) {for(const s of slugs)candidates.set(`${prefix}/${s}`,file);}
addSlugs('/articles',getAllArticleSlugs(),'src/app/articles/[slug]/page.tsx');
addSlugs('/articles/t',getAllThemeArticleSlugs(),'src/app/articles/t/[slug]/page.tsx');
addSlugs('/industries',getAllIndustryLpSlugs(),'src/app/industries/[slug]/page.tsx');
addSlugs('/solutions',getAllIndustryShowcaseSlugs(),'src/app/solutions/[slug]/page.tsx');
addSlugs('/experience',[...FLAGSHIP_CASE_STUDY_SLUGS,...ALLOWED_INTERACTIVE_EXPERIENCE_SLUGS,...EXPERIENCE_PROTOTYPES.map(x=>x.slug),'shift-auto','hr-evaluation-support'],'src/app/experience/[slug]/page.tsx');
addSlugs('/services',['insourcing-enablement','dx-strategy','industry-solutions','ai-apps','data-platform','continuous-improvement'],'src/app/services/[slug]/page.tsx');
for(const f of walk('public').filter(f=>f.endsWith('.html'))) candidates.set('/'+f.slice(7),f);
candidates.set('/lp/chuken-enterprise-v2','src/app/lp/chuken-enterprise-v2/page.tsx');
candidates.set('/lp/kaigo-care-dx','src/app/lp/kaigo-care-dx/page.tsx');
candidates.set('/studio','src/app/studio/[[...tool]]/page.tsx');
for(const u of ['/cases','/case-studies'])candidates.set(u,'next.config.ts');
const base=process.env.AUDIT_BASE_URL??'http://127.0.0.1:3000';
const results:any[]=cached?.pages??[]; const htmls=new Map<string,string>(); const links=new Map<string,Set<string>>();
const clean=(s:string)=>{try{return decodeURIComponent(s.replaceAll('&amp;','&').replaceAll('\\u0026','&').replaceAll('\\/','/'));}catch{return s;}};
function internal(v:string,u:string) {try{const url=new URL(clean(v),base+u);if(url.origin!==base)return null;return url.pathname.replace(/\/$/,'')||'/';}catch{return null;}}
const sitemap=await fetch(base+'/sitemap.xml').then(r=>r.text()).catch(()=>'');
for(const m of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){try {const u=new URL(m[1]).pathname;if(!candidates.has(u))candidates.set(u,u.startsWith('/demo/')?'src/app/demo/[slug]/page.tsx':'sitemap.xml');}catch{}}
const catalog=await fetch(base+'/api/demos/catalog').then(r=>r.json()).catch(()=>null);
fs.writeFileSync(`${out}/catalog-response.json`,JSON.stringify(catalog,null,2));
const queue=[...candidates.keys()];
for(let i=0;!cached&&i<queue.length;i++) {
 const u=queue[i];
 try {
  const r=await fetch(base+encodeURI(u),{redirect:'manual',signal:AbortSignal.timeout(45000)});const body=await r.text();const loc=r.headers.get('location')??'';
  const streamRedirect=body.match(/id="__next-page-redirect"[^>]*content="[^"]*url=([^";]+)/)?.[1]??'';
  const notFound=body.includes('NEXT_HTTP_ERROR_FALLBACK;404');
  const status=notFound?404:r.status;
  results.push({url:u,status,redirect:loc||streamRedirect,title:clean(body.match(/<title>([\s\S]*?)<\/title>/)?.[1]??''),source:candidates.get(u)??'リンクから検出',noindex:/name="robots" content="[^"]*noindex/.test(body)});
  if(status===200&&!loc&&!streamRedirect){htmls.set(u,body);const targets=new Set<string>();for(const m of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)){const t=internal(m[1],u);if(t&&!/\.[a-z0-9]{2,5}$/i.test(t)&&!t.startsWith('/api/')&&!t.startsWith('/studio')){targets.add(t);if(!queue.includes(t)&&queue.length<300)queue.push(t);}}links.set(u,targets);}
 }catch(e){results.push({url:u,status:'ERROR',redirect:'',source:candidates.get(u)??'',title:String(e)});}
 if(i%20===0)console.log(`pages ${i+1}/${queue.length}`);
}
const reachable=new Set<string>();function reach(u:string){if(reachable.has(u))return;reachable.add(u);const r=results.find(r=>r.url===u);if(r?.redirect){const t=internal(r.redirect,u);if(t)reach(t);}for(const t of links.get(u)??[])reach(t);}reach('/');
if(!cached)for(const r of results)r.classification=r.redirect?'転送（元のページは表示されない）':r.status!==200?'表示不可・エラー':reachable.has(r.url)?'表示可能・トップからリンクあり':'表示可能・トップからのHTMLリンク未検出';
for(const r of results)if(r.status===200&&r.title.startsWith('undefined'))r.classification='応答200だが内容不完全（デモデータ未取得）';
for(const r of results)if(r.url.startsWith('/demo/')&&r.source==='リンクから検出')r.source='src/app/demo/[slug]/page.tsx';
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html')))if(!results.some(r=>r.source===file))results.push({url:'—',source:file,status:'対象外',redirect:'',title:'',classification:'配信対象外（ルート直下のHTML）'});
const mediaExt=/\.(avif|webp|png|jpe?g|gif|svg|ico|bmp|mp4|webm|mov|m4v|ogv)$/i;
const media=walk('public').filter(f=>mediaExt.test(f));
const rows:any[]=[];
const pageDependencies=new Map(results.filter(r=>r.status===200&&!r.redirect&&r.source?.startsWith('src/')).map(r=>[r.url,closure([r.source,'src/app/layout.tsx'])]));
for(const file of media){
 const url='/'+file.slice(7);const variants=[url,encodeURI(url)];
 const refs=[...texts].filter(([,t])=>variants.some(v=>clean(t).includes(v))).map(([f])=>f);
 const responsePages=cached?.media.find((r:any)=>r.file===file)?.responsePages??[...htmls].filter(([,h])=>clean(h).includes(url)).map(([u])=>u);
 const elementPages=cached?.media.find((r:any)=>r.file===file)?.elementPages??[...htmls].filter(([,h])=>[...h.matchAll(/<(?:img|video|source|meta|link)\b[^>]*>|url\([^)]*\)/g)].some(m=>clean(m[0]).includes(url))).map(([u])=>u);
 const sourcePages=results.filter(r=>pageDependencies.has(r.url)).filter(r=>{const deps=pageDependencies.get(r.url)!;return refs.some(f=>deps.has(f)) || (r.url.startsWith('/articles/')&&refs.includes(`content${r.url}.html`));}).map(r=>r.url);
 // Dynamic filenames cannot be marked unused based on exact-string search alone.
 const dynamicRefs=dynamicPatterns.filter(p=>p.pattern.test(url)).map(p=>p.file);
 const classification=elementPages.length?'HTMLの画像・動画・メタ情報に使用':responsePages.length?'ページ応答内に参照（データ・遅延表示含む）':refs.length?'実装上に参照あり（表示未確認）':dynamicRefs.length?'動的パス候補・要確認':'未使用候補（実装内の参照なし）';
 rows.push({file,url,type:/\.(mp4|webm|mov|m4v|ogv)$/i.test(file)?'動画':'画像',bytes:fs.statSync(file).size,classification,elementPages,responsePages,sourcePages,refs,dynamicRefs});
}
const outside=[...walk('docs'),...fs.readdirSync('.').filter(f=>fs.statSync(f).isFile())].filter(f=>mediaExt.test(f)).map(file=>({file,bytes:fs.statSync(file).size,classification:'public外（サイト配信対象外。資料・検証・元素材を含む）'}));
function csv(file:string,headers:string[],records:any[]) {const q=(v:any)=>'"'+String(Array.isArray(v)?v.join(' | '):v??'').replaceAll('"','""')+'"';fs.writeFileSync(`${out}/${file}`,'\uFEFF'+[headers.map(q).join(','),...records.map(r=>headers.map(h=>q(r[h])).join(','))].join('\r\n'));}
csv('pages.csv',['url','classification','status','redirect','title','source','noindex'],results);
csv('media-all.csv',['file','type','bytes','classification','elementPages','responsePages','sourcePages','refs','dynamicRefs'],rows);
csv('media-unused-candidates.csv',['file','type','bytes','classification'],rows.filter(r=>r.classification.startsWith('未使用候補')));
csv('media-used-or-referenced.csv',['file','type','bytes','classification','elementPages','responsePages','sourcePages','refs','dynamicRefs'],rows.filter(r=>!r.classification.startsWith('未使用候補')));
csv('pages-not-displayed.csv',['url','classification','status','redirect','source'],results.filter(r=>r.redirect||r.classification.startsWith('配信対象外')||r.classification.startsWith('応答200')||r.classification.startsWith('表示不可')));
csv('media-outside-public.csv',['file','bytes','classification'],outside);
fs.writeFileSync(`${out}/audit.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),pages:results,media:rows,outside},null,2));
const count=(items:any[],key:string)=>Object.entries(items.reduce((a,r)=>(a[r[key]]=(a[r[key]]??0)+1,a),{} as Record<string,number>)).map(([k,v])=>`- ${k}: ${v}件`).join('\n');
const unused=rows.filter(r=>r.classification.startsWith('未使用候補'));
let md=`# ページ・画像・動画 利用状況一覧\n\n調査日: 2026-10-16\n\n対象: 現在の作業ツリーと ${base} のローカル応答。公開環境の確認ではありません。ファイルの削除・変更は行っていません。\n\n## ページ（${results.filter(r=>r.url!=='—').length} URL＋配信対象外HTML ${results.filter(r=>r.url==='—').length}ファイル）\n\n${count(results,'classification')}\n\n「表示可能」はHTTP応答とHTMLを確認した意味です。ブラウザ操作・全画面サイズでの目視確認は含みません。「トップからリンクあり」はHTMLのa要素を辿った結果で、操作後に出るリンクは含みません。noindexは検索非掲載の指定で、表示不可ではありません。動的URLはデータ定義・サイトマップ・検出リンクを対象とし、任意の未知slugは含みません。\n\n| URL | 判定 | HTTP | 転送先 |\n|---|---|---|---|\n`;
md+=results.map(r=>`| ${r.url==='—'?r.source:r.url} | ${r.classification} | ${r.status} | ${r.redirect} |`).join('\n');
md+=`\n\n## 画像・動画（public配下 ${rows.length}件）\n\n${count(rows,'classification')}\n\n全件と参照元・対応ページは [media-all.csv](media-all.csv)。画像タグ等に出現した素材と、データ内にのみ現れた素材を区別しています。OGP・アイコンも使用に含めます。コード上の参照は非表示機能や未使用データを含むため、実画面での表示を保証しません。sourcePagesはモジュール依存関係による候補で、条件分岐・共有データのため広めに出ます。外部CMSの画像・外部デモ内の素材はローカルファイル一覧に含みません。\n\n### 未使用候補 ${unused.length}件（${(unused.reduce((s,r)=>s+r.bytes,0)/1024/1024).toFixed(2)} MiB）\n\nsrc・content・publicのHTML/CSS/JS等に完全一致の参照がなく、動的パス候補にも該当しないファイルです。削除確定ではありません。CMS側の設定・外部からの直リンク・将来利用は判定対象外です。\n\n| ファイル | 種類 | サイズ KiB |\n|---|---|---|\n`;
md+=unused.map(r=>`| ${r.file} | ${r.type} | ${(r.bytes/1024).toFixed(1)} |`).join('\n');
md+=`\n\n## public外の素材 ${outside.length}件\n\n[media-outside-public.csv](media-outside-public.csv) に資料・検証画像・ルート直下の元素材を別記。サイトの未使用素材とは区別し、資料用途を理由に削除しないでください。node_modules・.next・.gitは集計対象外です。\n\n## 出力ファイル\n\n- [pages.csv](pages.csv): ページ全件、ステータス、転送先、実装ファイル\n- [media-all.csv](media-all.csv): 画像・動画全件、利用区分、ページ、参照元\n- [media-unused-candidates.csv](media-unused-candidates.csv): 未使用候補のみ\n- [media-outside-public.csv](media-outside-public.csv): サイト配信対象外の資料素材\n- [audit.json](audit.json): 全調査結果\n\n再実行: node node_modules/tsx/dist/cli.mjs scripts/audit-pages-media.ts （対象サーバーを起動済みにする。AUDIT_BASE_URLで対象変更可）\n`;
md+=`\n## 補足・確認範囲\n\n- [pages-not-displayed.csv](pages-not-displayed.csv): 元の内容が表示されないURL、内容不完全なデモ、配信対象外HTMLの抽出。転送用page.tsxは互換URL維持に使われるため未使用ファイルとは扱いません。\n- この環境の /api/demos/catalog は空配列でした。CMS側の非掲載デモ・外部保存画像の利用状況は確定できません。\n- /demo/driver-voice-incident-draft、/demo/delivery-photo-completion-report、/demo/delay-notice-template は200応答ですが、タイトルがundefinedとなり、正常表示とは区別しました。\n- src/app/studio/[[...tool]]/page.tsx はCMS管理用の /studio を定義しています。管理画面は今回の一般ページ巡回から除外しています。\n- SITE_CONCIERGE_ENABLED=false によりチャット相談は非表示です。参照ありの素材・コンポーネントも非表示機能内に存在する可能性があります。\n- public内の未使用候補でもURL直指定で配信できます。未使用候補とはサイト実装からの参照が見つからない意味です。\n`;
fs.writeFileSync(`${out}/README.md`,md);
fs.appendFileSync(`${out}/README.md`,`\n- [media-used-or-referenced.csv](media-used-or-referenced.csv): 使用確認・実装参照ありの素材81件（画像78件・動画3件）。表示確認の段階はclassification列を参照。\n- 内容不完全な /demo/* は合計${results.filter(r=>r.classification.startsWith('応答200')).length}件です。全URLはpages-not-displayed.csvで確認できます。\n- ページ表はURLと配信対象外HTMLを合わせた${results.length}レコードです。\n`);
console.log(JSON.stringify({pages:results.length,media:rows.length,unused:unused.length,outside:outside.length,pageCounts:count(results,'classification'),mediaCounts:count(rows,'classification')},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});

