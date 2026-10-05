param([ValidateSet('before','after')] [string]$Phase, [string]$Route)
$ErrorActionPreference='Stop'
function Invoke-Browser { & npx --yes --package agent-browser agent-browser --session axeon-refactor @args; if($LASTEXITCODE -ne 0){throw "Browser command failed: $args"} }
$measure = @"
(async()=>{await document.fonts.ready;for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0);await new Promise(r=>setTimeout(r,1800));const selectors='.home-landing-copy section[id],.home-landing-copy h1,.home-landing-copy h2,.home-landing-copy h3,#about p,#cta p,#values article,.home-landing-copy a,header nav,footer';return {url:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,overlay:!!document.querySelector('[data-nextjs-dialog]'),images:[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.getAttribute('src')),elements:[...document.querySelectorAll(selectors)].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,id:e.id,text:e.matches('section,article,footer,nav')?'':e.textContent.trim(),href:e.getAttribute('href'),x:r.x,y:r.y+scrollY,w:r.width,h:r.height,font:s.fontSize,line:s.lineHeight,align:s.textAlign,padding:s.padding,margin:s.margin}})}})()
"@
$widths = if($Route){@()}else{@(375,390,430,640,767,768,1024,1280,1440)}
foreach($width in $widths){
Invoke-Browser set viewport $width 900 | Out-Null
Invoke-Browser open http://127.0.0.1:3100/ | Out-Null
Invoke-Browser scroll down 20000 | Out-Null
Invoke-Browser scroll up 20000 | Out-Null
$measure | & npx --yes --package agent-browser agent-browser --session axeon-refactor eval --stdin | Set-Content -Encoding utf8 "docs/uiux-2026-10-06/$Phase-$width.json"
if($LASTEXITCODE -ne 0){throw 'Measure failed'}
Invoke-Browser screenshot "docs/uiux-2026-10-06/$Phase-$width.png" --full | Out-Null
Write-Output "$Phase $width captured"
}
$routes = if($Route){@($Route)}else{@('services/consulting','prototype-showroom','services/insourcing-enablement')}
foreach($route in $routes){
Invoke-Browser set viewport 390 900 | Out-Null
Invoke-Browser open "http://127.0.0.1:3100/$route" | Out-Null
$measure | & npx --yes --package agent-browser agent-browser --session axeon-refactor eval --stdin | Set-Content -Encoding utf8 "docs/uiux-2026-10-06/$Phase-$($route.Replace('/','-')).json"
if($LASTEXITCODE -ne 0){throw 'Measure failed'}
Invoke-Browser screenshot "docs/uiux-2026-10-06/$Phase-$($route.Replace('/','-')).png" --full | Out-Null
Write-Output "$Phase $route captured"
}


