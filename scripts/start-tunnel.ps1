$exe = Join-Path $env:TEMP 'cloudflared\cloudflared.exe'
$logDir = Join-Path $env:TEMP 'cloudflared'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

if (-not (Test-Path $exe) -or (Get-Item $exe).Length -lt 50000000) {
  Write-Output 'Downloading cloudflared (about 60MB)...'
  Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile $exe -UseBasicParsing -TimeoutSec 600
}

$stdout = Join-Path $logDir 'tunnel.log'
$stderr = Join-Path $logDir 'tunnel.err'
Remove-Item -LiteralPath $stdout, $stderr -Force -ErrorAction SilentlyContinue

$p = Start-Process -FilePath $exe -ArgumentList @('tunnel','--url','http://localhost:4321','--no-autoupdate') -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
Write-Output "Tunnel PID=$($p.Id)"

$url = $null
for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $stdout) {
    $content = Get-Content -LiteralPath $stdout -Raw -ErrorAction SilentlyContinue
    $m = [regex]::Match($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
    if ($m.Success) { $url = $m.Value; break }
  }
  if ($p.HasExited) { break }
}

if ($url) {
  Write-Output "URL=$url"
} else {
  Write-Output 'NO_URL'
  if (Test-Path $stderr) { Get-Content -LiteralPath $stderr -Tail 10 }
}
