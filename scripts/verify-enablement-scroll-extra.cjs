const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:3105',out='docs/archive/support-scroll-fix-2026-10-13';
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const records=[];
 try{
 const p=await b.newPage({viewport:{width:390,height:500}}),client=await p.context().newCDPSession(p);
 await client.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.route('**/*.js',async route=>{await new Promise(r=>setTimeout(r,100));await route.continue()});
 const response=await p.goto(base+'/services/insourcing-enablement',{waitUntil:'domcontentloaded'});
 const html=await response.text();assert(html.includes('data-scroll-reveal="off"'));
 await p.locator('#checks').scrollIntoViewIfNeeded();
 const early=await p.locator('#checks').evaluate(e=>({opacity:getComputedStyle(e).opacity,translate:getComputedStyle(e).translate}));
 assert.equal(early.translate,'none');
 await p.waitForFunction(()=>document.querySelector('#checks')?.dataset.sectionEntered==='true');
 await p.waitForTimeout(700);
 assert.equal(await p.locator('#checks').evaluate(e=>getComputedStyle(e).opacity),'1');
 records.push({scenario:'CPU4x, JS delayed, early scroll',SSRExcluded:true,early});
 await client.send('Emulation.setCPUThrottlingRate',{rate:1});await p.unroute('**/*.js');
 await p.goto(base+'/services/insourcing-enablement',{waitUntil:'networkidle'});
 await p.locator('#checks').scrollIntoViewIfNeeded();await p.waitForTimeout(100);
 await p.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await p.locator('#checks').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.equal(await p.locator('#checks').evaluate(e=>e.getAnimations().filter(a=>a.playState==='running').length),0);
 records.push({scenario:'reduce during fade',visible:true,running:0});
 const buttons=p.locator('#checks button');await buttons.last().click();await p.waitForTimeout(100);
 assert.equal(await buttons.last().getAttribute('aria-current'),'true');
 for(const width of [768,1024,1099,1100,390]){
  await p.setViewportSize({width,height:600});await p.waitForTimeout(200);
  if(width<1100) assert.equal(await buttons.last().getAttribute('aria-current'),'true');
 }
 records.push({scenario:'resize preserves selected final card',widths:[768,1024,1099,1100,390]});
 await p.locator('#development').scrollIntoViewIfNeeded();
 const flip=p.locator('#development button[aria-label$="の説明を表示"]').first();
 const before=await flip.getAttribute('aria-label');assert(before);
 await flip.click();await p.waitForTimeout(1700);
 assert(await p.locator('#development button[aria-label$="の表面に戻る"]').count()>0);
 assert(await p.locator('a[href="/contact"]').count()>0);
 const broken=await p.locator('a[href^="#"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))));assert.deepEqual(broken,[]);
 assert(!/月額支援|月額の伴走|3か月ごとの更新/.test(await p.locator('[data-service-page]').innerText()));
 records.push({scenario:'flip, contact, anchors, contract copy',passed:true});
 fs.writeFileSync(out+'/extra-results.json',JSON.stringify(records,null,2));console.log('extra: passed');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
