$pidFile = "$env:TEMP\astro-dev.pid"
if (Test-Path $pidFile) {
  Stop-Process -Id (Get-Content $pidFile) -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $pidFile -ErrorAction SilentlyContinue
}
$conns = Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue
foreach ($c in $conns) {
  Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2
$proc = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','dev','--','--host','127.0.0.1','--port','4321') -WindowStyle Hidden -PassThru
$proc.Id | Out-File -FilePath $pidFile
Start-Sleep -Seconds 8
$ok = $false
for ($i = 0; $i -lt 20; $i++) {
  try {
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:4321/universities/peking-university/' -UseBasicParsing -TimeoutSec 3
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch {}
  Start-Sleep -Milliseconds 500
}
if ($ok) { Write-Output 'Dev ready, detail page 200' } else { Write-Output 'Not ready' }
