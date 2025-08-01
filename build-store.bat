@echo off
echo 开始构建 EasyBookmark 应用商店发布包...

REM 清理旧的构建目录
if exist store-release rmdir /s /q store-release
mkdir store-release

REM 复制必要文件
echo 复制文件...
copy manifest.json store-release\
copy background.js store-release\
copy sidebar.html store-release\
copy sidebar.css store-release\
copy sidebar.js store-release\
copy pinyin.js store-release\
xcopy icons store-release\icons\ /e /i

REM 验证manifest.json权限
echo.
echo 验证权限设置...
findstr /c:"storage" store-release\manifest.json >nul
if %errorlevel% equ 0 (
    echo 错误: 仍然包含storage权限！
    pause
    exit /b 1
) else (
    echo ✓ 权限检查通过，未包含storage权限
)

echo.
echo ✓ 发布包构建完成！
echo 文件位置: store-release\
echo.
echo 请手动压缩store-release文件夹为zip文件
echo 然后上传到Google应用商店
echo.
pause
