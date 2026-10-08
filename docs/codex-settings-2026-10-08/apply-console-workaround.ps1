$ErrorActionPreference = 'Stop'
$configPath = Join-Path $env:USERPROFILE '.codex/config.toml'
$original = [IO.File]::ReadAllText($configPath)
$marker = 'Windowsのコンソール表示回避：'
if ($original.Contains($marker)) {
  Write-Output 'Already applied; no changes.'
  exit 0
}
$pattern = '(?ms)(^developer_instructions\s*=\s*"""\r?\n)(.*?)(^""")'
$match = [regex]::Match($original, $pattern)
if (-not $match.Success) { throw 'Expected developer_instructions block not found; no changes.' }
$lineEnding = if ($original.Contains("`r`n")) { "`r`n" } else { "`n" }
$instruction = @'
Windowsのコンソール表示回避：exec_commandによる通常のコマンド実行はtty=trueを明示し、PowerShellではlogin=falseを使用してください。この環境ではtty=falseのパイプ実行で可視コンソールが生成され、tty=trueのPTY実行では非表示になることを実測済みです。単にpwshに-WindowStyle Hiddenを渡す方法やcodex --no-daemonだけを解決策として扱わないでください。バックグラウンドの補助プロセスをStart-Processで起動する場合は-WindowStyle Hiddenを指定してください。PTYで実行できない操作が必要な場合は、無断で通常のパイプ実行に戻さず、その操作に限った非表示起動方法を確認してください。この指示は実行方式だけを変更し、既存の承認方針・作業範囲を変更しません。
'@
$insertion = $match.Groups[3].Index
$updated = $original.Insert($insertion, $instruction + $lineEnding)
if ($updated.Replace($instruction + $lineEnding, '') -cne $original) {
  throw 'Preservation check failed; no changes.'
}
$backupDir = Join-Path $env:USERPROFILE ('.codex/backups/console-workaround-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backupDir | Out-Null
Copy-Item -LiteralPath $configPath -Destination (Join-Path $backupDir 'config.toml')
[IO.File]::WriteAllText($configPath, $updated, [Text.UTF8Encoding]::new($false))
Write-Output "Updated: $configPath"
Write-Output "Backup: $backupDir/config.toml"
