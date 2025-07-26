# EasyBookmark - 智能书签侧边栏插件

> 仓库地址：https://github.com/neoo726/easyBookMark.git

一个功能强大的Edge浏览器侧边栏书签插件，支持智能拼音搜索和快捷键操作。

## ✨ 特性

- 🎯 **侧边栏布局** - 浅色模式，完美适配Edge浏览器，带图标标题栏
- 🌳 **书签树展示** - 递归显示所有书签，保持原生层级结构，显示真实网站图标
- 🔍 **智能搜索** - 仅搜索标题，支持拼音全拼、首字母缩写、多关键词、模糊匹配
- ⌨️ **快捷键支持** - ↑/↓选择，回车打开，Esc清空，自动选中第一个结果
- ⚡ **实时过滤** - 输入即搜索，智能高亮匹配结果（包括拼音匹配）
- 📊 **智能排序** - 搜索结果按最近使用时间排序

## 🚀 快速开始

### 安装插件

1. 下载或克隆此仓库
2. 打开Edge浏览器，访问 `edge://extensions/`
3. 开启"开发人员模式"
4. 点击"加载解压缩的扩展"，选择项目文件夹
5. 启用插件并在侧边栏中使用

详细安装说明请查看 [INSTALL.md](INSTALL.md)

### 使用方法

1. **打开侧边栏** - 点击插件图标或启用侧边栏显示
2. **浏览书签** - 点击文件夹展开/折叠，点击书签打开链接
3. **智能搜索** - 在搜索框中输入关键词、拼音或首字母
4. **快捷操作** - 使用↑/↓键选择，回车打开，Esc清空

## 🔍 搜索功能演示

| 输入 | 匹配示例 | 说明 |
|------|----------|------|
| `github` | GitHub | 英文关键词匹配 |
| `知乎` | 知乎 | 中文关键词匹配 |
| `zhihu` | 知乎 | 拼音全拼匹配 |
| `zh` | 知乎 | 拼音首字母匹配 |
| `git` | GitHub | 首字母缩写匹配 |
| `bai du` | 百度 | 多关键词匹配 |
| `jkz` | 监控组知识库 | **通用拼音首字母匹配** |
| `jswdgl` | 技术文档管理 | **通用拼音首字母匹配** |
| `监控 知识` | 监控组知识库 | **多关键词智能匹配** |
| `git 技术` | GitHub技术文档 | **中英文混合搜索** |

## 📁 项目结构

```
EasyBookmark/
├── manifest.json      # Manifest V3 配置文件
├── background.js      # 后台脚本
├── sidebar.html       # 侧边栏主界面
├── sidebar.css        # 浅色模式样式
├── sidebar.js         # 书签加载与搜索逻辑
├── pinyin.js          # 拼音转换模块
├── icons/             # 插件图标目录
├── INSTALL.md         # 安装和测试指南
├── test.html          # 功能测试清单
├── pinyin-test.html   # 拼音搜索测试页面
├── SEARCH_GUIDE.md    # 智能搜索功能指南
├── DEBUG.md           # 调试和故障排除指南
└── README.md          # 项目说明文档
```

## 🛠️ 技术实现

### 核心技术栈
- **Manifest V3** - 最新的浏览器扩展标准
- **Chrome Bookmarks API** - 获取浏览器书签数据
- **纯HTML/CSS/JS** - 无框架依赖，轻量高效
- **自定义拼音库** - 支持中文拼音搜索

### 关键功能实现

#### 书签树渲染
```javascript
// 递归渲染书签树结构
function createBookmarkElement(node) {
    if (node.children) {
        // 文件夹节点
        return createFolderElement(node);
    } else if (node.url) {
        // 书签链接节点
        return createBookmarkLink(node);
    }
}
```

#### 智能搜索算法
```javascript
// 多维度匹配：关键词 > 拼音全拼 > 拼音首字母
function searchBookmarks(query) {
    return bookmarks.filter(bookmark => {
        return keywords.every(keyword => {
            return PinyinHelper.matches(bookmark.title, keyword) ||
                   bookmark.url.toLowerCase().includes(keyword);
        });
    });
}
```

## 🧪 测试

项目包含完整的测试清单，请查看 [test.html](test.html) 进行功能验证。

### 验收标准
- ✅ 在Edge浏览器中成功加载侧边栏插件
- ✅ 书签树完整展示且层级正确
- ✅ 输入 `git` 能匹配到 "GitHub"（拼音首字母）
- ✅ 输入 `wang` 能匹配到 "网易云音乐"（拼音全拼）
- ✅ 回车键直接打开第一条结果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 文档](https://developer.chrome.com/docs/extensions/mv3/)
- [Edge 扩展开发](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/)