$env:PORT = '4322'
$p = Start-Process -FilePath 'node.exe' -ArgumentList 'dist/server/entry.mjs' -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 4
$ok = $false
for ($i = 0; $i -lt 12; $i++) {
  try {
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:4322/' -UseBasicParsing -TimeoutSec 3
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch {}
  Start-Sleep -Milliseconds 500
}
Write-Output "prod home 200: $ok"
if ($ok) {
  $tmpBody = Join-Path $env:TEMP 'advice-test.json'
  [System.IO.File]::WriteAllText($tmpBody, '{"answers":{},"result":{"dims":[{"dim":"\u5de5","score":5}],"majors":["\u8ba1\u7b97\u673a"],"schools":[{"name":"\u6e05\u534e\u5927\u5b66","majors":["\u8ba1\u7b97\u673a"]}]}}', (New-Object System.Text.UTF8Encoding($false)))
  $out = & curl.exe -s -w "`nHTTP_STATUS:%{http_code}" -X POST 'http://127.0.0.1:4322/api/advice' -H 'Content-Type: application/json' --data-binary "@$tmpBody" 2>&1
  Write-Output $out
  $tmpDebug = Join-Path $env:TEMP 'advice-debug.json'
  [System.IO.File]::WriteAllText($tmpDebug, '{"debugFetch":true}', (New-Object System.Text.UTF8Encoding($false)))
  $out2 = & curl.exe -s -X POST 'http://127.0.0.1:4322/api/advice' -H 'Content-Type: application/json' --data-binary "@$tmpDebug" 2>&1
  Write-Output "DEBUG: $out2"
}
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
Write-Output 'prod server stopped'
