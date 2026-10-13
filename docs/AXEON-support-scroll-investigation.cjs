const fs=require('node:fs');
const {chromium,webkit}=require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const out='docs/archive/support-scroll-investigation-2026-10-13';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const results=[];
 for(const engine of process.argv[2]==='ready'?[chromium]:[chromium,webkit]){
 const browser=await engine.launch(engine===chromium?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}:{headless:true});
 try {for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__motions=[]; const orig=Element.prototype.animate;
  Element.prototype.animate=function(frames,options){window.__motions.push({tag:this.tagName,text:this.textContent?.trim().slice(0,60),checks:!!this.closest('#checks'),options,frames,time:performance.now()});return orig.call(this,frames,options)};
 });
 await page.goto('http://127.0.0.1:3104/services/insourcing-enablement',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 if(process.argv[2]==='ready') await page.waitForFunction(()=>document.querySelector('#checks')?.getAttribute('data-reveal-individual')==='true');
 const baseline=await page.locator('#checks').evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,html:e.outerHTML.slice(0,500)}));
 await page.evaluate(top=>scrollTo({top:top-innerHeight+180,behavior:'instant'}),baseline.top);
 await page.waitForTimeout(150);
 const samples=[];
 for(let i=0;i<12;i++){
  if(i===1&&width===390)await page.locator('#checks ul[aria-label]').evaluate(e=>e.scrollTo({left:600,behavior:'instant'}));
  samples.push(await page.locator('#checks').evaluate(e=>({time:performance.now(),scrollY,items:[e,...e.querySelectorAll('h2,.heading-with-accent-rule,ul,li,h3,p')].map(c=>{const s=getComputedStyle(c),r=c.getBoundingClientRect();return {tag:c.tagName,text:c.textContent.trim().slice(0,25),top:r.top+scrollY,h:r.height,translate:s.translate,transform:s.transform,opacity:s.opacity,entered:c.dataset.entered,ready:c.dataset.revealReady,animations:c.getAnimations().map(a=>({state:a.playState,timing:a.effect.getTiming()}))}}),scroll:e.querySelector('ul')?{left:e.querySelector('ul').scrollLeft,top:e.querySelector('ul').scrollTop}:null})));
  await page.waitForTimeout(100);
 }
 await page.locator('#checks').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
 const steadyBefore=await page.locator('#checks ul[aria-label] > li').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top+scrollY,h:e.getBoundingClientRect().height})));
 if(width===390){await page.locator('#checks ul[aria-label] > li').first().click({force:true});await page.locator('#checks ul[aria-label]').evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));await page.waitForTimeout(1100)}
 const steadyAfter=await page.locator('#checks ul[aria-label] > li').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top+scrollY,h:e.getBoundingClientRect().height})));
 const motions=await page.evaluate(()=>window.__motions);
 results.push({engine:engine.name(),width,baseline,samples,steadyBefore,steadyAfter,motions,errors});
 await page.locator('#checks').screenshot({path:`${out}/${engine.name()}-${width}.png`});
 await page.close();
 }}finally{await browser.close()}
 }
 fs.writeFileSync(`${out}/${process.argv[2]==='ready'?'hydrated-evidence':'evidence'}.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(r=>({engine:r.engine,width:r.width,checksMotions:r.motions.filter(m=>m.checks),stable:JSON.stringify(r.steadyBefore)===JSON.stringify(r.steadyAfter)})),null,2));
})().catch(e=>{console.error(e);process.exit(1)});
