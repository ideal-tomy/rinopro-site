$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class CodexConsoleProbe {
  [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
'@
$consoleHandle = [CodexConsoleProbe]::GetConsoleWindow()
$ownerId = [uint32]0
[void][CodexConsoleProbe]::GetWindowThreadProcessId($consoleHandle, [ref]$ownerId)
$currentProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$PID"
[pscustomobject]@{
  ShellPid = $PID
  ParentPid = $currentProcess.ParentProcessId
  ConsoleHandle = $consoleHandle.ToInt64()
  ConsoleVisible = [CodexConsoleProbe]::IsWindowVisible($consoleHandle)
  ConsoleOwnerPid = $ownerId
  InputRedirected = [Console]::IsInputRedirected
  OutputRedirected = [Console]::IsOutputRedirected
} | ConvertTo-Json -Compress
