const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url=process.argv[2]||'http://127.0.0.1:3102';
(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:926}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  const checks=[];
  await page.goto(`${url}/services`);await page.evaluate(()=>document.fonts.ready);
  for(const id of ['consulting','insourcing']) {
    await page.locator(`a[href="#${id}"]`).click();await page.waitForTimeout(750);
    const position=await page.locator(`#${id}-heading`).boundingBox();
    const header=await page.locator('body > header').boundingBox();
    if(position.y<header.y+header.height)throw Error('Anchor hidden by header');
    checks.push({anchor:id,headingTop:position.y,headerBottom:header.y+header.height});
  }
  for(const route of ['/services/consulting','/services/insourcing-enablement','/contact']) {
    const link=page.locator(`main a[href="${route}"]`);
    await link.scrollIntoViewIfNeeded();await page.waitForTimeout(750);
    await link.click();
    console.log(JSON.stringify({requested:route,url:page.url()}));
    try {await page.waitForURL(`**${route}`,{waitUntil:'domcontentloaded',timeout:60000});}
    catch(error) {
      await page.screenshot({path:'docs/services-design-2026-10-06/navigation-failure.png'});
      fs.writeFileSync('docs/services-design-2026-10-06/navigation-failure.json',JSON.stringify({requested:route,url:page.url(),errors,text:await page.locator('body').innerText()},null,2));
      throw error;
    }
    if(!await page.locator('main').isVisible())throw Error(`Route missing ${route}`);
    checks.push({route,status:'pass'});await page.goto(`${url}/services`,{waitUntil:'networkidle'});
  }
  await page.getByRole('button',{name:'メニューを開く'}).click();
  await page.getByRole('heading',{name:'メニュー',exact:true}).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('heading',{name:'メニュー',exact:true}).waitFor({state:'hidden'});
  checks.push({menu:'open/Escape close pass'});
  await page.goto(`${url}/services`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.keyboard.press('Tab');
  const focused=await page.evaluate(()=>({text:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineStyle}));
  if(focused.outline==='none')throw Error('Keyboard focus invisible');
  checks.push({keyboard:focused});
  await page.locator('a[href="#consulting"]').focus();
  const anchorFocus=await page.evaluate(()=>({outline:getComputedStyle(document.activeElement).outlineStyle,width:getComputedStyle(document.activeElement).outlineWidth}));
  if(anchorFocus.outline!=='solid'||anchorFocus.width!=='2px')throw Error('Anchor focus invisible');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>{
    const rect=document.querySelector('#consulting-heading').getBoundingClientRect();
    return scrollY>0 && rect.top>=57 && rect.top<300;
  });
  checks.push({keyboardAnchor:anchorFocus,enter:'target visible',hash:new URL(page.url()).hash});
  await page.setViewportSize({width:1122,height:926});
  await page.locator('header a[href="/about"]').click();await page.waitForURL('**/about');
  const other=await page.evaluate(()=>({headerHeight:document.querySelector('body > header').getBoundingClientRect().height,brandDisplay:getComputedStyle(document.querySelector('.site-footer-brand')).display}));
  if(other.headerHeight!==65||other.brandDisplay!=='none')throw Error('Services chrome leaked');
  checks.push({otherPage:other});
  if(errors.length)throw Error(JSON.stringify(errors));
  fs.writeFileSync('docs/services-design-2026-10-06/operations.json',JSON.stringify({checks,errors},null,2));
  console.log(JSON.stringify(checks));await browser.close();
})();
