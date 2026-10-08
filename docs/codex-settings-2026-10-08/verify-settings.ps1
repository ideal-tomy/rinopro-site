$ErrorActionPreference = 'Stop'
$rulesPath = 'C:\Users\ryoji\.codex\rules\default.rules'
$cases = @(
  @{ Args = @('npm', 'install', 'zod'); Expected = 'prompt' },
  @{ Args = @('npm', 'ci'); Expected = 'prompt' },
  @{ Args = @('pnpm', 'add', 'zod'); Expected = 'prompt' },
  @{ Args = @('yarn', 'add', 'zod'); Expected = 'prompt' },
  @{ Args = @('bun', 'install'); Expected = 'prompt' },
  @{ Args = @('npx', 'eslint', '.'); Expected = 'prompt' },
  @{ Args = @('winget', 'install', 'Example.Package'); Expected = 'prompt' },
  @{ Args = @('python', '-m', 'pip', 'install', 'example'); Expected = 'prompt' },
  @{ Args = @('git', 'reset', '--hard', 'HEAD~1'); Expected = 'prompt' },
  @{ Args = @('git', 'clean', '-fd'); Expected = 'prompt' },
  @{ Args = @('git', 'rebase', 'main'); Expected = 'prompt' },
  @{ Args = @('git', 'commit', '--amend'); Expected = 'prompt' },
  @{ Args = @('git', 'push', '--force'); Expected = 'prompt' },
  @{ Args = @('git', 'push', 'origin', 'main', '--force-with-lease'); Expected = 'prompt' },
  @{ Args = @('Remove-Item', '-Recurse', '-Force', 'example'); Expected = 'prompt' },
  @{ Args = @('npm', 'run', 'build'); Expected = 'no-extra-rule' },
  @{ Args = @('npm', 'run', 'dev'); Expected = 'no-extra-rule' },
  @{ Args = @('npm', 'test'); Expected = 'no-extra-rule' },
  @{ Args = @('git', 'status'); Expected = 'no-extra-rule' },
  @{ Args = @('git', 'diff'); Expected = 'no-extra-rule' },
  @{ Args = @('git', 'add', '.'); Expected = 'no-extra-rule' },
  @{ Args = @('git', 'commit', '-m', 'example'); Expected = 'no-extra-rule' },
  @{ Args = @('git', 'push', 'origin', 'main'); Expected = 'no-extra-rule' }
)
$results = foreach ($case in $cases) {
  $commandArgs = $case.Args
  # Only evaluate policy: none of the example commands is executed.
  $raw = & codex execpolicy check --rules $rulesPath -- @commandArgs
  if ($LASTEXITCODE -ne 0) { throw "検証エラー：$commandArgs" }
  $result = ($raw -join "`n") | ConvertFrom-Json
  $decision = if ($result.decision -and $result.decision -ne 'allow') { $result.decision } else { 'no-extra-rule' }
  if ($decision -ne $case.Expected) { throw "期待と異なる判定：$commandArgs => $decision" }
  [pscustomobject]@{ Command = $commandArgs -join ' '; Decision = $decision }
}
$results | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'verification.json') -Encoding utf8
Write-Output "PASS: $($results.Count)件。対象コマンドは実行せず、判定のみ検証しました。"
