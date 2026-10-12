$ErrorActionPreference = 'Continue'
$root = 'C:\Users\HP\OneDrive\Desktop\React\management'
$out = Join-Path $env:TEMP 'REALBUILD.txt'
Set-Location -LiteralPath $root
function Now { Get-Date -Format 'HH:mm:ss' }

$lines = @()
$lines += "RUN_AT=$(Now)"
$lines += "PWD=$(Get-Location)"

'--- lint ---' | Add-Content -LiteralPath $out
$lintOut = npm run lint 2>&1
$lines += "LINT_EXIT=$LASTEXITCODE"

'--- build ---' | Add-Content -LiteralPath $out
$buildOut = npm run build 2>&1
$lines += "BUILD_EXIT=$LASTEXITCODE"

$lines += "DIST= $(Test-Path -LiteralPath (Join-Path $root 'dist\index.html'))"
if (Test-Path -LiteralPath (Join-Path $root 'dist\index.html')) {
  $lines += "DIST_BYTES=$(Get-Item -LiteralPath (Join-Path $root 'dist\index.html')).Length"
}

$lines | Add-Content -LiteralPath $out
Write-Output "WROTE=$out"
