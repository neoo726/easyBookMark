# EasyBookmark 发布包构建脚本

Write-Host "开始构建 EasyBookmark 发布包..." -ForegroundColor Green

# 创建临时构建目录
$buildDir = "build-release"
if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null

# 复制必要的文件到构建目录
$filesToCopy = @(
    "manifest.json",
    "background.js",
    "sidebar.html",
    "sidebar.css", 
    "sidebar.js",
    "pinyin.js",
    "icons"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $buildDir -Recurse
        Write-Host "已复制: $file" -ForegroundColor Yellow
    } else {
        Write-Host "警告: 文件不存在 $file" -ForegroundColor Red
    }
}

# 创建压缩包
$zipPath = "EasyBookmark-v1.0.0.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# 使用PowerShell压缩
Compress-Archive -Path "$buildDir\*" -DestinationPath $zipPath

Write-Host "发布包已创建: $zipPath" -ForegroundColor Green
Write-Host "文件大小: $((Get-Item $zipPath).Length / 1KB) KB" -ForegroundColor Cyan

# 清理临时目录
Remove-Item $buildDir -Recurse -Force

Write-Host ""
Write-Host "Build completed!" -ForegroundColor Green
Write-Host "Please upload $zipPath to Chrome Web Store" -ForegroundColor Yellow
