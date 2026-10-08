$ErrorActionPreference = 'Stop'
$settingsRoot = 'C:\Users\ryoji\.codex'
$configPath = Join-Path $settingsRoot 'config.toml'
$rulesPath = Join-Path $settingsRoot 'rules\default.rules'
$originalConfig = Get-Content -LiteralPath $configPath -Raw
$tableStart = [regex]::Match($originalConfig, '(?m)^\s*\[')
if (!$tableStart.Success) { throw '既存設定の構造が想定と異なるため停止しました' }
$rootConfig = $originalConfig.Substring(0, $tableStart.Index)
$tableConfig = $originalConfig.Substring($tableStart.Index)
if ($rootConfig -match '(?m)^\s*(approval_policy|sandbox_mode|approvals_reviewer|developer_instructions)\s*=') {
  throw '変更対象の既存値があるため、上書きせず停止しました'
}
$fragment = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'config-fragment.toml') -Raw
$ruleContent = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'default.rules') -Raw
# Before touching user settings, validate the prepared rules without executing any target command.
& codex execpolicy check --rules (Join-Path $PSScriptRoot 'default.rules') -- npm install zod | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'ルールの検証に失敗しました' }
$backupPath = Join-Path $settingsRoot ('backups\approval-settings-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
Copy-Item -LiteralPath $configPath -Destination (Join-Path $backupPath 'config.toml')
$hadRules = Test-Path -LiteralPath $rulesPath
if ($hadRules) { Copy-Item -LiteralPath $rulesPath -Destination (Join-Path $backupPath 'default.rules') }
New-Item -ItemType Directory -Path (Split-Path $rulesPath) -Force | Out-Null
if ($hadRules) { $ruleContent = (Get-Content -LiteralPath $rulesPath -Raw) + "`n" + $ruleContent }
[IO.File]::WriteAllText($rulesPath, $ruleContent, [Text.UTF8Encoding]::new($false))
[IO.File]::WriteAllText($configPath, $fragment + "`n" + $rootConfig + $tableConfig, [Text.UTF8Encoding]::new($false))
& codex execpolicy check --rules $rulesPath -- npm install zod | Out-Null
if ($LASTEXITCODE -ne 0) {
  Copy-Item -LiteralPath (Join-Path $backupPath 'config.toml') -Destination $configPath -Force
  throw "設定の検証に失敗したためconfig.tomlを復元しました。バックアップ：$backupPath"
}
Write-Output "設定を更新しました。バックアップ：$backupPath"
