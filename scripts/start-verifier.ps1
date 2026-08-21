$log = Join-Path (Resolve-Path 'scripts').Path 'verify-slow.log'
if (Test-Path $log) { Remove-Item -LiteralPath $log -Force }
$wd = (Get-Location).Path
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
  CommandLine = 'node.exe scripts\verify-slow.mjs'
  CurrentDirectory = $wd
}
Write-Output "Created PID=$($r.ProcessId) ReturnValue=$($r.ReturnValue)"
Start-Sleep -Seconds 15
if (Test-Path $log) { Get-Content -LiteralPath $log } else { Write-Output 'no log yet' }
