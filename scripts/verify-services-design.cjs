const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dir = 'docs/services-design-2026-10-06';
const url = process.argv[2] || 'http://127.0.0.1:3000';
const mode = process.argv[3] || 'after';
const widths = mode === 'quick' ? [1122,390] : [375,390,430,768,1023,1024,1025,1122,1280,1440];
(async () => {
  fs.mkdirSync(dir,{recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const results=[];
  for (const width of widths) {
    const page=await browser.newPage({viewport:{width,height:926},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto(`${url}/services`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    if(mode==='font-check') await page.addStyleTag({content:'.services-page {font-variation-settings:"wght" 400} .services-page :is(h1,h2,h3,dt,a,[class*="lead"],[class*="kicker"],[class*="stepLabel"]){font-variation-settings:"wght" 700}'});
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'main p'});
    const platformFonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    console.log(JSON.stringify({width,platformFonts}));
    const footerNode=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'body > footer > div'});
    const footerRules=await cdp.send('CSS.getMatchedStylesForNode',{nodeId:footerNode.nodeId});
    if(width===1122) console.log(JSON.stringify(footerRules.matchedCSSRules.map(({rule})=>({selector:rule.selectorList.text,media:rule.media,width:rule.style.cssProperties.filter(p=>p.name==='width')})).filter(r=>r.width.length)));
    await page.waitForTimeout(800);
    for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650) {
      await page.evaluate(y=>window.scrollTo(0,y),y); await page.waitForTimeout(650);
    }
    await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(700);
    if([390,1122,1440].includes(width)) await page.screenshot({path:`${dir}/${mode}-${width}-full.png`,fullPage:true});
    if(width===390) {
      await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1000);
      await page.screenshot({path:`${dir}/${mode}-sp-top.png`});
      for(const [name,selector] of [['middle','#insourcing'],['bottom','section[aria-labelledby="services-process-heading"]']]) {
        await page.evaluate(sel=>window.scrollTo(0,document.querySelector(sel).getBoundingClientRect().top+window.scrollY-56),selector);
        await page.waitForTimeout(750);await page.screenshot({path:`${dir}/${mode}-sp-${name}.png`});
      }
    }
    const data=await page.evaluate(()=>({
      width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      header:document.querySelector('body > header').getBoundingClientRect().height,
      headings:[...document.querySelectorAll('main h1, main h2,main h3')].map(e=>({text:e.textContent,size:getComputedStyle(e).fontSize,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
      sections:[...document.querySelectorAll('main section')].map(e=>({id:e.id,y:e.getBoundingClientRect().top+scrollY,height:e.getBoundingClientRect().height})),
      font:getComputedStyle(document.querySelector('main h1')).fontFamily,
      text:document.querySelector('main').innerText,
      links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.getAttribute('href')})),
      footerLogo:getComputedStyle(document.querySelector('.site-footer-brand')).display,
      headerTop:document.querySelector('body > header').getBoundingClientRect().top,
      headerPosition:getComputedStyle(document.querySelector('body > header')).position,
      container:document.querySelector('.services-page > div').getBoundingClientRect().toJSON(),
      footerContainer:document.querySelector('body > footer > div').getBoundingClientRect().toJSON(),
    }));
    if(data.scrollWidth>width)throw Error(`Overflow ${width}: ${data.scrollWidth}`);
    if(data.headings.filter(e=>e.text.includes('成功の大半')).length!==1)throw Error('Duplicate process');
    for(const source of ['src/lib/content/support-pillars.ts','src/lib/content/services-embedded-copy.ts']) {
      const matches=[...fs.readFileSync(source,'utf8').matchAll(/(?:body|description):\s*"([^"]+)"/g)];
      const expected=source.includes('embedded') ? matches.slice(0,5) : matches;
      for(const match of expected) if(!data.text.includes(match[1]))throw Error(`Missing copy: ${match[1]}`);
    }
    data.errors=errors;results.push(data);
    data.platformFonts=platformFonts;
    await page.close();
  }
  fs.writeFileSync(`${dir}/${mode}-metrics.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify(results.map(({width,scrollWidth,header,errors})=>({width,scrollWidth,header,errors}))));
  await browser.close();
})();
