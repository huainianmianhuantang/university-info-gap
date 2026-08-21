$logDir = Join-Path $env:TEMP 'cloudflared'
$logFile = Join-Path $logDir 'tunnel.log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

Get-Process -Name cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
Remove-Item -LiteralPath $logFile -Force -ErrorAction SilentlyContinue

$runExe = Join-Path $logDir ('cf-' + [guid]::NewGuid().ToString('N').Substring(0, 12) + '.exe')
Write-Output 'Downloading cloudflared (about 60MB)...'
& curl.exe -L -sS --retry 3 -o $runExe 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
if (-not (Test-Path $runExe) -or (Get-Item $runExe).Length -lt 50000000) {
  Write-Output 'DOWNLOAD_FAILED'
  exit 1
}

$p = Start-Process -FilePath $runExe -ArgumentList @('tunnel','--url','http://localhost:4321','--no-autoupdate','--logfile',$logFile) -WindowStyle Hidden -PassThru
Write-Output "Tunnel PID=$($p.Id)"

$url = $null
for ($i = 0; $i -lt 90; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $logFile) {
    $content = Get-Content -LiteralPath $logFile -Raw -ErrorAction SilentlyContinue
    $m = [regex]::Match($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
    if ($m.Success) { $url = $m.Value; break }
  }
  if ($p.HasExited) { break }
}

if ($url) {
  Write-Output "URL=$url"
  Write-Output "PID=$($p.Id)"
} else {
  Write-Output 'NO_URL'
  if (Test-Path $logFile) { Get-Content -LiteralPath $logFile -Tail 20 }
}
