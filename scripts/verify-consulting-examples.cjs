const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium, webkit } = require('C:/Users/ryoji/AppData/Local/npm-cache/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const phase = process.argv[2] || 'after';
const base = process.argv[3] || 'http://127.0.0.1:3000';
const out = 'docs/consulting-examples-2026-10-13';
fs.mkdirSync(out, {recursive:true});
(async () => {
  const results = [];
  for (const engine of phase === 'before' ? [chromium] : [chromium, webkit]) {
    const browser = await engine.launch(engine === chromium ? {executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true} : {headless:true});
    try {
      const page = await browser.newPage({reducedMotion:'reduce'});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      for (const width of phase === 'before' ? [390,1440] : [375,390,430,768,899,900,1024,1280,1440]) {
        await page.setViewportSize({width,height:1000});
        await page.goto(base+'/services/consulting', {waitUntil:'networkidle'});
        await page.evaluate(() => document.fonts.ready);
        const section = page.locator('#consulting-examples');
        await section.scrollIntoViewIfNeeded();
        if (phase !== 'before') {
          assert.equal(await section.getByRole('tab').count(),0);
          assert.equal(await section.locator('article').count(),3);
          assert.equal((await section.innerText()).split('').length-1,1);
          const geometry = await section.evaluate(e => ({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,items:[...e.querySelectorAll('li')].map(c=>({x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,h:c.getBoundingClientRect().height,w:c.getBoundingClientRect().width})), clipped:[...e.querySelectorAll('h2,h3,p,dd')].filter(c=>getComputedStyle(c).position!=='absolute').some(c=>c.scrollWidth>c.clientWidth+1 || c.scrollHeight>c.clientHeight+1)}));
          assert(geometry.pageWidth<=width,JSON.stringify(geometry));
          assert(!geometry.clipped,JSON.stringify(geometry));
          if(width<900){
            assert.equal(geometry.items[0].y,geometry.items[1].y);
            assert.equal(geometry.items[0].h,geometry.items[2].h);
            assert(geometry.items[1].x<width);
            const track=section.locator('ol'), dots=section.getByRole('button');
            assert.equal(await dots.count(),3);
            for(let i=0;i<3;i++){
              await dots.nth(i).click();
              await page.waitForTimeout(100);
              assert.equal(await dots.nth(i).getAttribute('aria-current'),'true');
              const box=await section.locator('li').nth(i).boundingBox();
              assert(Math.abs(box.x-20)<2,JSON.stringify(box));
            }
            await track.focus();
            await page.keyboard.press('Home');
            await page.waitForTimeout(100);
            assert.equal(await dots.first().getAttribute('aria-current'),'true');
            await track.evaluate(e=>e.scrollTo({left:e.scrollWidth,behavior:'instant'}));
            await page.waitForTimeout(100);
            assert.equal(await dots.last().getAttribute('aria-current'),'true');
            await dots.first().click();
            await page.waitForTimeout(100);
          }else{
            assert(geometry.items[1].y>geometry.items[0].y);
            assert.equal(geometry.items[0].x,geometry.items[2].x);
          }
          assert.equal(await page.locator('a[href="/contact"]').count()>0,true);
          results.push({engine:engine.name(),width,geometry});
          fs.writeFileSync(`${out}/${phase}-results.json`,JSON.stringify(results,null,2));
        }
        if([375,390,430,900,1280,1440].includes(width)) await section.screenshot({path:`${out}/${phase}-${engine.name()}-${width}.png`});
      }
      const unrelatedPrefetchErrors=errors.filter(e=>e.includes('due to access control checks.') && /\/(contact|about)\?_rsc=/.test(e));
      assert.deepEqual(errors.filter(e=>!unrelatedPrefetchErrors.includes(e)),[]);
      if(unrelatedPrefetchErrors.length) results.push({engine:engine.name(),unrelatedPrefetchErrors});
      if(phase !== 'before') {
        await page.emulateMedia({reducedMotion:'no-preference'});
        await page.setViewportSize({width:390,height:900});
        await page.goto(base+'/services/consulting',{waitUntil:'networkidle'});
        const section=page.locator('#consulting-examples'), track=section.locator('ol');
        await page.waitForFunction(()=>document.querySelector('#consulting-examples')?.getAttribute('data-reveal-ready')==='true');
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        await section.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-200,behavior:"instant"}));
        await track.evaluate(e=>e.scrollTo({left:e.children[1].offsetLeft-20,behavior:'instant'}));
        await page.waitForTimeout(100);
        assert.equal(await section.getByRole('button').nth(1).getAttribute('aria-current'),'true');
        const height=await track.evaluate(e=>e.clientHeight);
        await page.waitForTimeout(1000);
        await track.evaluate(e=>e.scrollTo({left:e.scrollWidth,behavior:'instant'}));
        await page.waitForTimeout(100);
        assert.equal(await section.getByRole('button').last().getAttribute('aria-current'),'true');
        assert.equal(await track.evaluate(e=>e.clientHeight),height);
        assert.equal(await section.getAttribute('data-entered'),'true');
        assert.equal(await section.locator('[data-reveal-ready]').count(),0);
        if(engine===chromium){
          await track.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
          await page.waitForTimeout(100);
          const client=await page.context().newCDPSession(page);
          const box=await track.boundingBox(), y=Math.max(50,box.y+60);
          await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:290,y}]});
          for(let x=270;x>=70;x-=20) {
            await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});
            await page.waitForTimeout(16);
          }
          await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          await page.waitForTimeout(500);
          assert(await track.evaluate(e=>e.scrollLeft)>0);
          const before=await page.evaluate(()=>scrollY);
          await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y}]});
          for(let dy=20;dy<=160;dy+=20) {
            await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150,y:y-dy}]});
            await page.waitForTimeout(16);
          }
          await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          await page.waitForTimeout(300);
          assert(await page.evaluate(()=>scrollY)>before);
          await section.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-200,behavior:"instant"}));
          await client.detach();
        }
        await page.waitForTimeout(200);
        const box=await track.boundingBox(), beforeY=await page.evaluate(()=>scrollY);
        await page.mouse.move(box.x+80,Math.max(10,box.y+40));
        await page.mouse.wheel(0,200);
        await page.waitForTimeout(300);
        const verticalWheelPassed=await page.evaluate(()=>scrollY)>beforeY;
        if(engine===chromium) assert(verticalWheelPassed);
        results.push({engine:engine.name(),motion:'single section',horizontalScrollPassed:true,verticalWheelPassed,touchGestures:engine===chromium?'horizontal and vertical passed':'not tested',verticalWheelBefore:beforeY,verticalWheelAfter:await page.evaluate(()=>scrollY)});
      }
    } finally {await browser.close();}
  }
  fs.writeFileSync(`${out}/${phase}-results.json`,JSON.stringify(results,null,2));
  console.log(`${phase}: passed ${results.length} viewport checks`);
})().catch(e=>{console.error(e);process.exit(1)});
