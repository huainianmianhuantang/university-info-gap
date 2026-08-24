param(
  [int]$MaxAttempts = 20,
  [int]$IntervalSeconds = 20
)

# Usage: powershell -ExecutionPolicy Bypass -File scripts/push-retry.ps1
# Retries "git push origin main" until it succeeds (or max attempts reached).

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root

try {
  for ($i = 1; $i -le $MaxAttempts; $i++) {
    Write-Host "Push attempt $i / $MaxAttempts ..."
    git push origin main 2>&1 | Out-String | Write-Host
    if ($LASTEXITCODE -eq 0) {
      Write-Host ''
      Write-Host 'Push succeeded!'
      exit 0
    }
    if ($i -lt $MaxAttempts) {
      Write-Host "Retrying in $IntervalSeconds seconds ..."
      Start-Sleep -Seconds $IntervalSeconds
    }
  }
  Write-Host ''
  Write-Host 'All attempts failed. Check network access to github.com and re-run.'
  exit 1
} finally {
  Pop-Location
}
