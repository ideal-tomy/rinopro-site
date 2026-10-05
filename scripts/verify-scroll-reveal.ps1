param([string]$BaseUrl='http://127.0.0.1:3100', [string[]]$Routes=@('','services','about','articles/construction','contact','estimate-detailed','experience'), [switch]$Append, [string]$BrowserBinary)
$ErrorActionPreference='Stop'
$dir='docs/scroll-reveal-2026-10-06'
$BrowserCommand=if($BrowserBinary){$BrowserBinary}else{'npx'}
$BrowserPrefix=if($BrowserBinary){@()}else{@('--yes','--package','agent-browser','agent-browser')}
function Browser { & $BrowserCommand @BrowserPrefix --session sr6 @args; if($LASTEXITCODE -ne 0){throw "Browser failed: $args"} }
function Eval([string]$Code){$out=$Code | & $BrowserCommand @BrowserPrefix --session sr6 eval --stdin; if($LASTEXITCODE -ne 0){throw 'Eval failed'}; return ($out -join "`n" | ConvertFrom-Json)}
$results=[System.Collections.Generic.List[object]]::new()
Browser open "$BaseUrl/" | Out-Null
Browser set viewport 390 900 | Out-Null
Browser set media light --reduced-motion no-preference | Out-Null
if($Append){foreach($previous in (Get-Content "$dir/results.json" -Raw | ConvertFrom-Json)){if($previous.route -ne 'reduced-motion' -and $previous.route.TrimStart('/') -notin $Routes){$results.Add($previous)}}}
foreach($route in $Routes){
 Browser open "$BaseUrl/$route" | Out-Null
 $check=Eval @"
(async()=>{await document.fonts.ready;await new Promise(r=>setTimeout(r,300));const delay=ms=>new Promise(r=>setTimeout(r,ms));const ours=a=>a.effect?.getTiming().duration===600&&a.effect.getKeyframes().some(k=>k.translate==='0px 14px');const noAttributes=!document.querySelector('[data-scroll-reveal]');let animation;for(let y=400;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await delay(60);animation=document.getAnimations().find(ours);if(animation)break}if(!animation)return {route:location.pathname,passed:false,noAttributes,reason:'No animation observed'};await delay(90);const target=animation.effect.target,opacity=Number(getComputedStyle(target).opacity);const playing=animation.playState==='running';await delay(650);const finished=getComputedStyle(target).opacity==='1'&&!target.getAnimations().some(ours);scrollTo(0,0);await delay(60);target.scrollIntoView({block:'center'});await delay(90);const once=!target.getAnimations().some(ours);return {route:location.pathname,noAttributes,playing,opacity,finished,once,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,passed:noAttributes&&playing&&opacity>0&&opacity<1&&finished&&once}})()
"@
 $results.Add($check)
 $results | ConvertTo-Json -Depth 8 | Set-Content "$dir/results.json" -Encoding utf8
 if(-not $check.passed){throw "Reveal failed: $route"}
 Write-Output "PASS: /$route scroll reveal"
}
Browser set media reduced-motion | Out-Null
Browser open "$BaseUrl/" | Out-Null
$reduced=Eval "(async()=>{await new Promise(r=>setTimeout(r,300));const ours=a=>a.effect?.getTiming().duration===600&&a.effect.getKeyframes().some(k=>k.translate==='0px 14px');let playing=false;for(let y=400;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));playing ||=document.getAnimations().some(ours)}return {route:'reduced-motion',passed:!document.querySelector('[data-scroll-reveal]')&&!playing}})()"
$results.Add($reduced)
$results | ConvertTo-Json -Depth 8 | Set-Content "$dir/results.json" -Encoding utf8
if(-not $reduced.passed){throw 'Reduced motion failed'}
Browser errors --json | Set-Content "$dir/browser-errors.json" -Encoding utf8
$errors=Get-Content "$dir/browser-errors.json" -Raw | ConvertFrom-Json
if(@($errors.data.errors).Count -ne 0){throw 'Browser errors found'}
Write-Output 'PASS: reduced motion and no browser errors'
Browser set media light --reduced-motion no-preference | Out-Null








