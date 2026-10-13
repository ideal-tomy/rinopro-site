const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium,webkit}=require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:3105';
const phase=process.argv[3]||'after';
const out='docs/archive/support-scroll-fix-2026-10-13';
fs.mkdirSync(out,{recursive:true});
const route='/services/insourcing-enablement';
const results=[];
async function geometry(page){return page.locator('#checks').evaluate(s=>{const track=s.querySelector('ul[aria-label]'),tr=track.getBoundingClientRect();return {scrollY,trackTop:tr.top+scrollY,trackHeight:tr.height,scrollLeft:track.scrollLeft,scrollTop:track.scrollTop,cards:[...track.children].map(c=>{const r=c.getBoundingClientRect(),style=getComputedStyle(c);return {top:r.top+scrollY,relativeTop:r.top-tr.top,height:r.height,translate:style.translate,transform:style.transform,opacity:style.opacity}})}})}
async function touch(page,client,axis){
 const box=await page.locator('#checks ul[aria-label]').boundingBox();
 const y=Math.min(450,Math.max(180,box.y+90)),x=Math.min(290,box.width-30);
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let d=20;d<=180;d+=20){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:axis==='x'?x-d:x,y:axis==='y'?y-d:y}]});await page.waitForTimeout(16)}
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.waitForTimeout(450);
}
(async()=>{
 for(const engine of phase==='before'?[chromium]:[chromium,webkit]){
  const browser=await engine.launch(engine===chromium?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}:{headless:true});
  try{
   for(const width of phase==='before'?[390,1440]:[375,390,430,768,1024,1099,1100,1280,1440]){
    const context=await browser.newContext({viewport:{width,height:600},recordVideo:width===390?{dir:out,size:{width:390,height:600}}:undefined});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      window.__revealCalls=[];window.__samples=[];
      const animate=Element.prototype.animate;
      Element.prototype.animate=function(frames,options){window.__revealCalls.push({tag:this.tagName,id:this.id,inPage:!!this.closest('[data-service-page]'),frames,options,time:performance.now()});return animate.call(this,frames,options)};
      window.__trace=()=>{const e=document.querySelector('#checks'),track=e.querySelector('ul[aria-label]');const t=track.getBoundingClientRect();window.__samples.push({time:performance.now(),scrollY,scrollLeft:track.scrollLeft,scrollTop:track.scrollTop,trackTop:t.top+scrollY,trackHeight:t.height,sectionOpacity:getComputedStyle(e).opacity,cards:[...track.children].map(c=>{const r=c.getBoundingClientRect();return {top:r.top+scrollY,relativeTop:r.top-t.top,height:r.height}})});if(window.__record)requestAnimationFrame(window.__trace)};
    });
    await page.goto(base+route,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    if(phase==='before'){
      await page.locator('#checks').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
      await page.locator('#checks').screenshot({path:`${out}/before-${width}.png`});
      await context.close();continue;
    }
    assert.equal(await page.locator('[data-service-page]').getAttribute('data-scroll-reveal'),'off');
    assert.equal(await page.locator('#approach').count(),0);
    assert.equal(await page.locator('#checks [data-reveal-ready]').count(),0);
    assert.equal(await page.locator('#checks ul[aria-label] > li').count(),5);
    await page.evaluate(()=>{window.__record=true;window.__trace();const e=document.querySelector('#checks');scrollTo({top:e.getBoundingClientRect().top+scrollY-130,behavior:'instant'})});
    await page.waitForTimeout(80);
    const start=await geometry(page);
    if(width<1100){
      if(engine===chromium && width===390){const client=await context.newCDPSession(page);await touch(page,client,'x');assert((await geometry(page)).scrollLeft>start.scrollLeft);await client.detach()}
      else{const box=await page.locator('#checks ul[aria-label]').boundingBox();await page.mouse.move(box.x+80,Math.min(550,box.y+60));await page.mouse.wheel(450,0);await page.waitForTimeout(150)}
    }
    await page.waitForTimeout(750);
    await page.evaluate(()=>{window.__record=false});
    const samples=await page.evaluate(()=>window.__samples);
    for(const sample of samples){
      assert.equal(sample.scrollTop,0);
      for(let i=0;i<5;i++){
        assert(Math.abs(sample.cards[i].relativeTop-start.cards[i].relativeTop)<=1);
        assert(Math.abs(sample.cards[i].height-start.cards[i].height)<=1);
        assert(Math.abs(sample.cards[i].top-start.cards[i].top)<=1);
      }
    }
    const track=page.locator('#checks ul[aria-label]'),buttons=page.locator('#checks button');
    if(width<1100){
      for(let i=0;i<5;i++){
        await buttons.nth(i).click();
        await page.waitForFunction(i=>document.querySelectorAll('#checks button')[i].getAttribute('aria-current')==='true',i);
        await page.waitForTimeout(650);
        const now=await geometry(page);
        assert(Math.abs(now.trackTop-start.trackTop)<=1);
        assert(Math.abs(now.trackHeight-start.trackHeight)<=1);
        assert.equal(await buttons.nth(i).evaluate(e=>e.getBoundingClientRect().height),44);
      }
      await track.focus();await page.keyboard.press('Home');await page.waitForTimeout(650);
      assert.equal(await buttons.first().getAttribute('aria-current'),'true');
      await page.keyboard.press('End');await page.waitForTimeout(650);
      assert.equal(await buttons.last().getAttribute('aria-current'),'true');
      await buttons.first().click();await page.waitForTimeout(650);
      await page.locator('#checks ul[aria-label] > li').first().click();
      const tapped=await geometry(page);assert(Math.abs(tapped.trackTop-start.trackTop)<=1);
      if(engine===chromium && width===390){
        const client=await context.newCDPSession(page);await touch(page,client,'x');
        const beforeY=await page.evaluate(()=>scrollY);await touch(page,client,'y');
        assert(await page.evaluate(()=>scrollY)>beforeY);await client.detach();
      }
    }
    const count=await page.evaluate(()=>window.__revealCalls.filter(x=>x.id==='checks').length);
    assert(count<=1);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.locator('#checks').scrollIntoViewIfNeeded();await page.waitForTimeout(750);
    assert.equal(await page.evaluate(()=>window.__revealCalls.filter(x=>x.id==='checks').length),count);
    const calls=await page.evaluate(()=>window.__revealCalls.filter(x=>x.inPage));
    assert(calls.every(x=>['checks','support','development'].includes(x.id)||x.tag==='SECTION'),JSON.stringify(calls));
    assert(calls.every(x=>x.frames.every(f=>!('translate' in f)&&!('transform' in f))));
    assert(calls.every(x=>x.options.duration===600));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if([375,390,430,1280,1440].includes(width)){
      const hideHeader=await page.addStyleTag({content:'header.sticky {visibility:hidden !important}'});
      await page.locator('#checks').screenshot({path:`${out}/after-${engine.name()}-${width}.png`});
      await hideHeader.evaluate(e=>e.remove());
    }
    const unrelated=errors.filter(e=>e.includes('due to access control checks.'));
    assert.deepEqual(errors.filter(e=>!unrelated.includes(e)),[]);
    results.push({engine:engine.name(),width,samples,calls,unrelatedPrefetchErrors:unrelated});
    fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
    const video=page.video();await context.close();if(video)await video.saveAs(`${out}/${phase}-${engine.name()}-${width}.webm`);
   }
   if(phase!=='before'){
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),p=await nojs.newPage();
    await p.goto(base+route);assert.equal(await p.locator('#checks').evaluate(e=>getComputedStyle(e).opacity),'1');await nojs.close();
    const p2=await browser.newPage({viewport:{width:390,height:600},reducedMotion:'reduce'});
    await p2.goto(base+route,{waitUntil:'networkidle'});await p2.locator('#checks').scrollIntoViewIfNeeded();assert.equal(await p2.locator('#checks').evaluate(e=>getComputedStyle(e).opacity),'1');await p2.close();
   }
  }finally{await browser.close()}
 }
 console.log(`${phase}: ${results.length} viewport and operation sequences passed`);
})().catch(e=>{console.error(e);process.exit(1)});
