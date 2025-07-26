@echo off
echo 正在提交 EasyBookmark 插件到 Git 仓库...

echo.
echo 1. 添加所有文件到暂存区...
git add .

echo.
echo 2. 提交更改...
git commit -m "重大改进 EasyBookmark 用户体验和搜索功能

用户体验改进:
- ✅ 添加图标标题栏 (🔖 EasyBookmark)
- ✅ 显示真实网站图标 (favicon)
- ✅ 搜索结果默认选中第一个
- ✅ 按最近使用时间智能排序
- ✅ 优化搜索提示语显示

搜索功能优化:
- ✅ 仅搜索书签标题，移除URL搜索
- ✅ 拼音匹配智能高亮显示
- ✅ 改进高亮算法支持拼音匹配
- ✅ 通用拼音首字母匹配算法
- ✅ 多关键词空格分隔搜索

搜索功能:
- 原始标题模糊匹配
- 拼音全拼搜索 (zhihu → 知乎)
- 拼音首字母搜索 (jkz → 监控组知识库)
- 多关键词搜索 (监控 知识 → 监控组知识库)
- URL内容搜索
- 智能高亮显示

技术改进:
- 重构拼音匹配算法，支持所有中文字符
- 优化搜索性能，预生成搜索索引
- 完善错误处理和用户体验

文件结构:
- manifest.json: 插件配置和权限
- sidebar.html/css/js: 侧边栏界面和逻辑
- pinyin.js: 拼音搜索支持
- background.js: 后台脚本
- INSTALL.md: 安装测试指南
- test.html: 功能测试清单"

echo.
echo 3. 推送到远程仓库...
git push origin main

echo.
echo ✅ Git 提交完成！
echo 仓库地址: https://github.com/neoo726/easyBookMark.git
echo.
pause
