param([string]$BaseUrl='http://127.0.0.1:3100', [switch]$MotionOnly)
$ErrorActionPreference='Stop'
$results=[System.Collections.Generic.List[object]]::new()
function Invoke-Browser { if($args[0] -eq "click"){ & npx --yes --package agent-browser agent-browser --session axeon-clean scrollintoview $args[1] | Out-Null; if($LASTEXITCODE -ne 0){throw "Scroll failed"} }; & npx --yes --package agent-browser agent-browser --session axeon-clean @args; if($LASTEXITCODE -ne 0){throw "Browser command failed: $args"} }
function Read-Page([string]$Code) { $output=$Code | & npx --yes --package agent-browser agent-browser --session axeon-clean eval --stdin; if($LASTEXITCODE -ne 0){throw 'Evaluation failed'}; return ($output -join "`n" | ConvertFrom-Json) }
function Assert-Page([string]$Name,[string]$Code) { $actual=Read-Page $Code; $results.Add([pscustomobject]@{name=$Name;passed=($actual -eq $true)}); $results | ConvertTo-Json | Set-Content -Encoding utf8 docs/uiux-2026-10-06/operations-after.json; if($actual -ne $true){throw "Check failed: $Name"}; Write-Output "PASS: $Name" }
if($MotionOnly){foreach($r in (Get-Content docs/uiux-2026-10-06/operations-after.json -Raw | ConvertFrom-Json)){if($r.passed){$results.Add($r)}}}
if(-not $MotionOnly){
Invoke-Browser set viewport 390 900 | Out-Null
Invoke-Browser open "$BaseUrl/" | Out-Null
Invoke-Browser press Escape | Out-Null
Invoke-Browser focus 'header button' | Out-Null
Invoke-Browser press Enter | Out-Null
Invoke-Browser wait '[role=dialog]' | Out-Null
Assert-Page 'Mobile menu opens by keyboard' "!!document.querySelector('[role=dialog]')"
Invoke-Browser press Escape | Out-Null
Assert-Page 'Mobile menu closes with Escape' "!document.querySelector('[role=dialog]')"
Invoke-Browser focus '#faq li:first-child summary' | Out-Null
Invoke-Browser press Enter | Out-Null
Assert-Page 'FAQ expands by keyboard' "document.querySelector('#faq details').open"
Invoke-Browser press Enter | Out-Null
Assert-Page 'FAQ collapses by keyboard' "!document.querySelector('#faq details').open"
Invoke-Browser click '#values a:first-of-type' | Out-Null
Assert-Page 'Demo anchor navigates' "location.hash === '#industry'"
Invoke-Browser click '#cta .inline-flex' | Out-Null
Assert-Page 'Contact CTA navigates' "location.pathname === '/contact'"
Invoke-Browser fill '#contact-name' 検証用 | Out-Null
Invoke-Browser fill '#contact-email' ui-check@example.invalid | Out-Null
Assert-Page 'Contact fields are editable' "document.querySelector('#contact-name').value === '検証用' && document.querySelector('#contact-email').value === 'ui-check@example.invalid'"
Invoke-Browser open "$BaseUrl/" | Out-Null
Invoke-Browser click '#cta p a' | Out-Null
Assert-Page 'Estimate CTA navigates' "location.pathname === '/estimate-detailed'"
Invoke-Browser open "$BaseUrl/" | Out-Null
Invoke-Browser click '#demos > div:last-child a' | Out-Null
Assert-Page 'Demo catalogue link navigates' "location.pathname === '/experience'"
Invoke-Browser open "$BaseUrl/" | Out-Null
}
Invoke-Browser open "$BaseUrl/" | Out-Null
# Hero has one image: inspect its live React hook state to verify media subscriptions.
$motionState = "(()=>{const el=document.querySelector('#hero img');const key=Object.getOwnPropertyNames(el).find(k=>k.startsWith('__reactFiber'));let n=el[key];while(n.return)n=n.return;const stack=[n.stateNode.current];while(stack.length){const f=stack.pop();if(typeof f.type==='function'&&Array.isArray(f.memoizedProps?.slides)&&f.memoizedProps.slides.some(s=>s.src?.startsWith('/images/top/')))return f.memoizedState?.memoizedState;if(f.child)stack.push(f.child);if(f.sibling)stack.push(f.sibling)}throw Error('Hero fiber not found')})()"
Invoke-Browser set media light --reduced-motion no-preference | Out-Null
Assert-Page 'Normal motion is reflected in the Hero hook' "!matchMedia('(prefers-reduced-motion: reduce)').matches && ($motionState) === false"
Invoke-Browser set media reduced-motion | Out-Null
Assert-Page 'Reduced motion is reflected in the Hero hook' "matchMedia('(prefers-reduced-motion: reduce)').matches && ($motionState) === true"
Invoke-Browser set media light --reduced-motion no-preference | Out-Null
Assert-Page 'Motion setting changes are subscribed' "!matchMedia('(prefers-reduced-motion: reduce)').matches && ($motionState) === false"
Assert-Page 'No Next error overlay' "!document.querySelector('[data-nextjs-dialog]')"
$results | ConvertTo-Json | Set-Content -Encoding utf8 docs/uiux-2026-10-06/operations-after.json
Invoke-Browser errors --json | Set-Content -Encoding utf8 docs/uiux-2026-10-06/browser-errors.txt


