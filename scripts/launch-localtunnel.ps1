$ws = (Get-Location).Path
$logDir = Join-Path $env:TEMP 'localtunnel'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$out = Join-Path $logDir 'lt.out'
Remove-Item -LiteralPath $out -Force -ErrorAction SilentlyContinue
$inner = 'npx.cmd -y localtunnel --port 4321'
$cmd = 'cmd.exe /c ' + $inner + ' > "' + $out + '" 2>&1'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
  CommandLine = $cmd
  CurrentDirectory = $ws
}
Write-Output "Launched PID=$($r.ProcessId) ReturnValue=$($r.ReturnValue)"
