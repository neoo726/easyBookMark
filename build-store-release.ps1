# EasyBookmark Google应用商店发布包构建脚本
# 修复权限问题 - 移除未使用的storage权限

Write-Host "开始构建 EasyBookmark 应用商店发布包..." -ForegroundColor Green

# 创建临时构建目录
$buildDir = "store-release"
if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null

# 复制必要的文件到构建目录（只包含运行时需要的文件）
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

# 验证manifest.json权限
$manifestPath = Join-Path $buildDir "manifest.json"
$manifest = Get-Content $manifestPath | ConvertFrom-Json
Write-Host "当前权限列表:" -ForegroundColor Cyan
$manifest.permissions | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

# 检查是否包含storage权限
if ($manifest.permissions -contains "storage") {
    Write-Host "错误: 仍然包含storage权限！" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✓ 权限检查通过，未包含storage权限" -ForegroundColor Green
}

# 创建压缩包
$version = $manifest.version
$zipPath = "EasyBookmark-v$version-store.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# 使用PowerShell压缩
Compress-Archive -Path "$buildDir\*" -DestinationPath $zipPath -Force

# 获取文件大小
$zipSize = (Get-Item $zipPath).Length
$zipSizeKB = [math]::Round($zipSize / 1KB, 2)

Write-Host "✓ 发布包构建完成!" -ForegroundColor Green
Write-Host "文件: $zipPath" -ForegroundColor Yellow
Write-Host "大小: $zipSizeKB KB" -ForegroundColor Yellow
Write-Host "版本: v$version" -ForegroundColor Yellow

# 显示包含的文件
Write-Host "`n包含的文件:" -ForegroundColor Cyan
Get-ChildItem $buildDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Item $buildDir).FullName, "").TrimStart("\")
    Write-Host "  $relativePath" -ForegroundColor White
}

# 清理临时目录
Remove-Item $buildDir -Recurse -Force

Write-Host "`n🚀 可以上传到Google应用商店了!" -ForegroundColor Green
Write-Host "修复内容:" -ForegroundColor Cyan
Write-Host "  ✓ 移除了未使用的storage权限" -ForegroundColor White
Write-Host "  ✓ 只保留必要的bookmarks和sidePanel权限" -ForegroundColor White
Write-Host "  ✓ 更新了相关文档" -ForegroundColor White
