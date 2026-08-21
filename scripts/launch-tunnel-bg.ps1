$ws = (Get-Location).Path
$script = Join-Path $ws 'scripts\start-tunnel.ps1'
$logDir = Join-Path $env:TEMP 'cloudflared'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$out = Join-Path $logDir 'start-tunnel.out'
Remove-Item -LiteralPath $out -Force -ErrorAction SilentlyContinue
$inner = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "' + $script + '"'
$cmd = 'cmd.exe /c ' + $inner + ' > "' + $out + '" 2>&1'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
  CommandLine = $cmd
  CurrentDirectory = $ws
}
Write-Output "Launched PID=$($r.ProcessId) ReturnValue=$($r.ReturnValue)"
