$targets = Get-ChildItem -Path 'public/images' -Filter 'logo-*.webp' | Where-Object { $_.Name -notmatch '-512\.webp$' }
$removed = 0
$locked = 0
foreach ($f in $targets) {
  try {
    Remove-Item -LiteralPath $f.FullName -Force -ErrorAction Stop
    $removed++
  } catch {
    $locked++
  }
}
Write-Output "removed=$removed locked=$locked"
