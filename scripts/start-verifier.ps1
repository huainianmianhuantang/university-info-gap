$log = Join-Path (Resolve-Path 'scripts').Path 'verify-slow.log'
if (Test-Path $log) { Remove-Item -LiteralPath $log -Force }
$psi = [System.Diagnostics.ProcessStartInfo]::new()
$psi.FileName = 'node.exe'
$psi.Arguments = 'scripts/verify-slow.mjs'
$psi.WorkingDirectory = (Get-Location).Path
$psi.UseShellExecute = $true
$psi.CreateNoWindow = $true
$p = [System.Diagnostics.Process]::Start($psi)
Write-Output "Started PID=$($p.Id)"
Start-Sleep -Seconds 25
if (Test-Path $log) { Get-Content -LiteralPath $log } else { Write-Output 'no log yet' }
