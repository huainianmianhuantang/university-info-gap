$out = Join-Path $env:TEMP 'cloudflared\start-tunnel.out'
$err = Join-Path $env:TEMP 'cloudflared\start-tunnel.err'
$script = Join-Path (Resolve-Path 'scripts').Path 'start-tunnel.ps1'
$psi = [System.Diagnostics.ProcessStartInfo]::new()
$psi.FileName = 'powershell.exe'
$psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $script + '"'
$psi.WorkingDirectory = (Get-Location).Path
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$p = [System.Diagnostics.Process]::Start($psi)
$p.StandardOutput.ReadToEnd() | Set-Content -LiteralPath $out -Encoding UTF8
$p.StandardError.ReadToEnd() | Set-Content -LiteralPath $err -Encoding UTF8
Write-Output "done exit=$($p.ExitCode)"
