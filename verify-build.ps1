$ErrorActionPreference = 'Continue'
$root = 'C:\Users\HP\OneDrive\Desktop\React\management'
Set-Location -LiteralPath $root

Write-Output "=== npm run lint ==="
npm run lint 2>$null
Write-Output "LINT_EXIT=$LASTEXITCODE"

Write-Output ""
Write-Output "=== npm run build ==="
$before = if (Test-Path -LiteralPath "$root\dist") { (Get-Date) } else { $null }
npm run build 2>$null
Write-Output "BUILD_EXIT=$LASTEXITCODE"

$dist = "$root\dist\index.html"
Write-Output ""
Write-Output "DIST_INDEX_EXISTS=$(Test-Path -LiteralPath $dist)"
if (Test-Path -LiteralPath $dist) {
  Write-Output ("DIST_INDEX_SIZE=" + (Get-Item -LiteralPath $dist).Length)
}
