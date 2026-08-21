$env:FILTER_BRANCH_SQUELCH_WARNING = '1'
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch scripts/test-deepseek.mjs" --prune-empty -- --all
if ($LASTEXITCODE -ne 0) { Write-Output 'FILTER FAILED'; exit 1 }
Remove-Item -LiteralPath 'scripts/test-deepseek.mjs' -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all
git gc --prune=now --aggressive
Write-Output 'SCRUB DONE'
