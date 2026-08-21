param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl
)

# 用法：powershell -ExecutionPolicy Bypass -File scripts/push-to-github.ps1 "https://github.com/用户名/仓库名.git"
# 前提：先在 github.com 新建一个空仓库（不要勾选初始化 README）。

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root

try {
  $existing = git remote get-url origin 2>$null
  if ($existing) {
    Write-Host "检测到已存在的远程仓库：$existing"
    $answer = Read-Host '是否替换为新的地址？(y/N)'
    if ($answer -notmatch '^y') {
      Write-Host '已取消，未做任何修改。'
      exit 0
    }
    git remote remove origin
  }

  git remote add origin $RepoUrl

  $branch = git branch --show-current
  if ($branch -ne 'main') {
    Write-Host "当前分支为 $branch ，将重命名为 main（Cloudflare Pages 默认监听 main）。"
    git branch -M main
  }

  git push -u origin main

  Write-Host ''
  Write-Host '推送成功！接下来：'
  Write-Host '1. 打开 https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git，选择本仓库。'
  Write-Host '2. 构建设置：Build command = npm run build，Build output directory = dist，环境变量加 NODE_VERSION=22。'
  Write-Host '3. 项目 Settings → Environment variables 配置 AI_API_KEY / AI_BASE_URL / AI_MODEL / PUBLIC_SITE_URL。'
  Write-Host '4. 点击 Deploy，等待构建完成即可获得 xxx.pages.dev 公网地址。'
} finally {
  Pop-Location
}
