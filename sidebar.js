// EasyBookmark 侧边栏主逻辑
class BookmarkSidebar {
    constructor() {
        this.bookmarks = [];
        this.filteredBookmarks = [];
        this.selectedIndex = -1;
        this.searchInput = null;
        this.bookmarksTree = null;
        this.loading = null;
        this.noResults = null;
        this.searchTips = null;
        
        this.init();
    }

    async init() {
        // 获取DOM元素
        this.searchInput = document.getElementById('searchInput');
        this.bookmarksTree = document.getElementById('bookmarksTree');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('noResults');
        this.searchTips = document.getElementById('searchTips');
        // this.closeButton = document.getElementById('closeButton'); // 已隐藏标题栏

        // 绑定事件
        this.bindEvents();

        // 加载书签
        await this.loadBookmarks();

        // 默认聚焦搜索框
        this.searchInput.focus();
    }

    bindEvents() {
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // 键盘事件
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // 点击事件委托
        this.bookmarksTree.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // 右键菜单事件
        this.bookmarksTree.addEventListener('contextmenu', (e) => {
            this.handleContextMenu(e);
        });



        // 关闭按钮事件已隐藏
        /*
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        */
    }

    async loadBookmarks() {
        try {
            this.showLoading(true);
            
            // 获取所有书签
            const bookmarkTree = await chrome.bookmarks.getTree();
            this.bookmarks = this.flattenBookmarks(bookmarkTree[0]);
            
            // 渲染书签树
            this.renderBookmarkTree(bookmarkTree[0]);
            
            this.showLoading(false);
        } catch (error) {
            console.error('加载书签失败:', error);
            this.showError('加载书签失败，请刷新重试');
        }
    }

    // 扁平化书签树，用于搜索（优化版）
    flattenBookmarks(node, result = []) {
        if (node.url) {
            // 这是一个书签，生成搜索索引
            const searchIndex = PinyinHelper.generateSearchIndex(node.title);
            result.push({
                id: node.id,
                title: node.title,
                url: node.url,
                parentId: node.parentId,
                dateAdded: node.dateAdded,
                dateLastUsed: node.dateLastUsed,
                searchIndex: searchIndex  // 预生成的搜索索引
            });
        }

        if (node.children) {
            // 这是一个文件夹，递归处理子项
            node.children.forEach(child => {
                this.flattenBookmarks(child, result);
            });
        }

        return result;
    }

    // 渲染书签树
    renderBookmarkTree(node, container = this.bookmarksTree) {
        container.innerHTML = '';

        if (node.children) {
            node.children.forEach(child => {
                const element = this.createBookmarkElement(child, 0); // 从0级开始
                container.appendChild(element);
            });
        }
    }

    // 创建书签元素
    createBookmarkElement(node, level = 0) {
        const div = document.createElement('div');
        div.className = 'bookmark-item';
        div.dataset.id = node.id;

        if (node.children) {
            // 文件夹
            div.className += ' folder';

            // 所有文件夹默认折叠状态（不添加expanded类）
            // 用户需要手动点击展开

            div.innerHTML = `
                <div class="folder-header" data-id="${node.id}">
                    <span class="folder-toggle">▶</span>
                    <span class="folder-icon">📁</span>
                    <span class="folder-title">${this.escapeHtml(node.title)}</span>
                    <div class="bookmark-actions">
                        <button class="action-btn edit-btn" title="编辑文件夹" data-action="edit" data-id="${node.id}">✏️</button>
                        <button class="action-btn delete-btn" title="删除文件夹" data-action="delete" data-id="${node.id}">🗑️</button>
                    </div>
                </div>
                <div class="folder-content"></div>
            `;

            // 递归渲染子项，传递层级信息
            const folderContent = div.querySelector('.folder-content');
            if (node.children.length > 0) {
                node.children.forEach(child => {
                    const childElement = this.createBookmarkElement(child, level + 1);
                    folderContent.appendChild(childElement);
                });
            }
        } else if (node.url) {
            // 书签链接
            const faviconUrl = this.getFaviconUrl(node.url);
            div.innerHTML = `
                <div class="bookmark-container" data-id="${node.id}">
                    <a class="bookmark-link" href="${node.url}" data-id="${node.id}" data-url="${node.url}">
                        <span class="bookmark-icon" style="background-image: url('${faviconUrl}')"></span>
                        <span class="bookmark-title">${this.escapeHtml(node.title)}</span>
                        <span class="bookmark-url">${this.getDomain(node.url)}</span>
                    </a>
                    <div class="bookmark-actions">
                        <button class="action-btn edit-btn" title="编辑书签" data-action="edit" data-id="${node.id}">✏️</button>
                        <button class="action-btn delete-btn" title="删除书签" data-action="delete" data-id="${node.id}">🗑️</button>
                    </div>
                </div>
            `;
        }

        return div;
    }

    // 处理搜索
    handleSearch(query) {
        if (!query.trim()) {
            // 清空搜索，显示完整树
            this.loadBookmarks();
            this.selectedIndex = -1;
            this.updateSearchTips('支持智能搜索：拼音首字母、多关键词、模糊匹配');
            return;
        }

        // 搜索书签
        const results = this.searchBookmarks(query);
        this.filteredBookmarks = results;
        this.renderSearchResults(results);
        this.selectedIndex = -1;
        
        // 更新提示
        if (results.length > 0) {
            this.updateSearchTips(`找到 ${results.length} 个匹配结果 - 支持↑↓选择，回车打开`);
        } else {
            this.updateSearchTips('未找到匹配结果，尝试：拼音首字母、多关键词、模糊匹配');
        }
    }

    // 搜索书签（仅搜索标题）
    searchBookmarks(query) {
        if (!query || !query.trim()) return [];

        let results = this.bookmarks.filter(bookmark => {
            // 使用预生成的搜索索引进行匹配
            if (bookmark.searchIndex && PinyinHelper.matchesWithIndex(bookmark.searchIndex, query)) {
                return true;
            }

            // 兜底：直接使用标题匹配（适用于没有搜索索引的情况）
            if (PinyinHelper.matches(bookmark.title, query)) {
                return true;
            }

            return false;
        });

        // 按最近访问时间排序（如果有的话）
        results.sort((a, b) => {
            const timeA = a.dateLastUsed || a.dateAdded || 0;
            const timeB = b.dateLastUsed || b.dateAdded || 0;
            return timeB - timeA; // 降序，最近的在前面
        });

        return results;
    }

    // 渲染搜索结果
    renderSearchResults(results) {
        this.bookmarksTree.innerHTML = '';
        
        if (results.length === 0) {
            this.showNoResults(true);
            return;
        }
        
        this.showNoResults(false);
        
        results.forEach((bookmark, index) => {
            const div = document.createElement('div');
            div.className = 'bookmark-item';
            div.dataset.index = index;
            div.dataset.id = bookmark.id; // 添加data-id到bookmark-item

            const faviconUrl = this.getFaviconUrl(bookmark.url);
            div.innerHTML = `
                <div class="bookmark-container" data-id="${bookmark.id}">
                    <a class="bookmark-link" href="${bookmark.url}" data-id="${bookmark.id}" data-url="${bookmark.url}">
                        <span class="bookmark-icon" style="background-image: url('${faviconUrl}')"></span>
                        <span class="bookmark-title">${this.highlightMatch(bookmark.title, this.searchInput.value)}</span>
                        <span class="bookmark-url">${this.getDomain(bookmark.url)}</span>
                    </a>
                    <div class="bookmark-actions">
                        <button class="action-btn edit-btn" title="编辑书签" data-action="edit" data-id="${bookmark.id}">✏️</button>
                        <button class="action-btn delete-btn" title="删除书签" data-action="delete" data-id="${bookmark.id}">🗑️</button>
                    </div>
                </div>
            `;

            this.bookmarksTree.appendChild(div);
        });

        // 默认选中第一个结果
        if (results.length > 0) {
            this.selectedIndex = 0;
            this.updateSelection();
        }
    }

    // 高亮匹配文本（改进版，支持拼音匹配高亮）
    highlightMatch(text, query) {
        if (!query) return this.escapeHtml(text);

        const keywords = PinyinHelper.parseKeywords(query);
        let result = this.escapeHtml(text);

        // 为了避免重复高亮，我们需要记录哪些字符已经被高亮了
        const highlightedChars = new Set();

        keywords.forEach(keyword => {
            // 1. 直接文字匹配高亮
            const directMatches = this.findDirectMatches(text, keyword);
            directMatches.forEach(match => {
                for (let i = match.start; i < match.end; i++) {
                    highlightedChars.add(i);
                }
            });

            // 2. 拼音匹配高亮
            if (/^[a-z]+$/.test(keyword)) {
                const pinyinMatches = this.findPinyinMatches(text, keyword);
                pinyinMatches.forEach(match => {
                    if (!highlightedChars.has(match.index)) {
                        highlightedChars.add(match.index);
                    }
                });
            }
        });

        // 根据高亮位置重新构建HTML
        return this.buildHighlightedText(text, highlightedChars);
    }

    // 查找直接匹配的位置
    findDirectMatches(text, keyword) {
        const matches = [];
        const lowerText = text.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();
        let index = 0;

        while ((index = lowerText.indexOf(lowerKeyword, index)) !== -1) {
            matches.push({
                start: index,
                end: index + keyword.length
            });
            index += keyword.length;
        }

        return matches;
    }

    // 查找拼音匹配的位置
    findPinyinMatches(text, keyword) {
        const matches = [];

        // 方法1: 拼音全拼匹配
        const fullPinyin = PinyinHelper.getFullPinyin(text);
        if (fullPinyin.includes(keyword)) {
            // 找到拼音全拼中匹配的位置，然后映射回原文字符
            const matchedChars = this.mapPinyinToChars(text, keyword, fullPinyin);
            matches.push(...matchedChars);
        }

        // 方法2: 检查拼音首字母序列匹配
        const initials = PinyinHelper.getFirstLetters(text);
        if (this.isSubsequenceMatch(keyword, initials)) {
            // 找到匹配的字符位置
            let keywordIndex = 0;
            for (let i = 0; i < text.length && keywordIndex < keyword.length; i++) {
                const char = text[i];
                if (/[\u4e00-\u9fff]/.test(char)) {
                    const initial = PinyinHelper.getPinyin(char).charAt(0);
                    if (initial === keyword[keywordIndex]) {
                        matches.push({ index: i, char: char });
                        keywordIndex++;
                    }
                }
            }
        }

        // 方法3: 检查单个字符的拼音匹配
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (/[\u4e00-\u9fff]/.test(char)) {
                const pinyin = PinyinHelper.getPinyin(char);
                const initial = pinyin.charAt(0);

                // 检查是否匹配拼音全拼或首字母
                if (pinyin === keyword || initial === keyword) {
                    matches.push({ index: i, char: char });
                }
            }
        }

        return matches;
    }

    // 将拼音匹配映射回原文字符位置
    mapPinyinToChars(text, keyword, fullPinyin) {
        const matches = [];
        let currentPinyinPos = 0;

        // 找到所有匹配的拼音位置
        const matchPositions = [];
        let searchPos = 0;
        while ((searchPos = fullPinyin.indexOf(keyword, searchPos)) !== -1) {
            matchPositions.push({
                start: searchPos,
                end: searchPos + keyword.length
            });
            searchPos += 1; // 允许重叠匹配
        }

        // 将拼音位置映射回字符位置
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (/[\u4e00-\u9fff]/.test(char)) {
                const pinyin = PinyinHelper.getPinyin(char);
                const charPinyinStart = currentPinyinPos;
                const charPinyinEnd = currentPinyinPos + pinyin.length;

                // 检查这个字符的拼音是否与任何匹配区域重叠
                for (const match of matchPositions) {
                    if (charPinyinStart < match.end && charPinyinEnd > match.start) {
                        matches.push({ index: i, char: char });
                        break; // 避免重复添加
                    }
                }

                currentPinyinPos += pinyin.length;
            } else {
                // 非中文字符，在拼音中保持原样
                currentPinyinPos += 1;
            }
        }

        return matches;
    }

    // 检查子序列匹配
    isSubsequenceMatch(keyword, initials) {
        let keywordIndex = 0;
        for (let i = 0; i < initials.length && keywordIndex < keyword.length; i++) {
            if (initials[i] === keyword[keywordIndex]) {
                keywordIndex++;
            }
        }
        return keywordIndex === keyword.length;
    }

    // 构建高亮文本
    buildHighlightedText(text, highlightedChars) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const escapedChar = this.escapeHtml(char);

            if (highlightedChars.has(i)) {
                result += `<span class="highlight">${escapedChar}</span>`;
            } else {
                result += escapedChar;
            }
        }
        return result;
    }

    // 处理键盘事件
    handleKeydown(e) {
        const results = this.filteredBookmarks.length > 0 ? this.filteredBookmarks : [];
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
                    this.openBookmark(results[this.selectedIndex].url);
                } else if (results.length > 0) {
                    this.openBookmark(results[0].url);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.searchInput.value = '';
                this.handleSearch('');
                break;
        }
    }

    // 更新选中状态
    updateSelection() {
        // 清除所有选中状态
        this.bookmarksTree.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // 设置当前选中
        if (this.selectedIndex >= 0) {
            const items = this.bookmarksTree.querySelectorAll('.bookmark-link');
            if (items[this.selectedIndex]) {
                items[this.selectedIndex].classList.add('selected');
                items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }

    // 处理点击事件
    handleClick(e) {
        // 处理操作按钮点击
        if (e.target.closest('.action-btn')) {
            e.preventDefault();
            e.stopPropagation();

            const btn = e.target.closest('.action-btn');
            const action = btn.dataset.action;
            const id = btn.dataset.id;

            this.handleBookmarkAction(action, id);
            return;
        }

        // 文件夹切换
        if (e.target.closest('.folder-header')) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡

            const folderHeader = e.target.closest('.folder-header');
            const folder = folderHeader.closest('.folder');

            // 确保只切换直接点击的文件夹，不影响子文件夹
            this.toggleFolder(folder);
            return;
        }

        // 书签点击
        if (e.target.closest('.bookmark-link')) {
            e.preventDefault();
            const link = e.target.closest('.bookmark-link');
            const url = link.dataset.url;
            if (url) {
                this.openBookmark(url);
            }
            return;
        }
    }

    // 切换文件夹展开/折叠
    toggleFolder(folder) {
        const isExpanded = folder.classList.contains('expanded');
        const toggle = folder.querySelector('.folder-toggle');

        if (isExpanded) {
            // 当前是展开状态，要折叠
            folder.classList.remove('expanded');
            if (toggle) toggle.textContent = '▶';
        } else {
            // 当前是折叠状态，要展开
            folder.classList.add('expanded');
            if (toggle) toggle.textContent = '▼';
        }
    }

    // 打开书签
    openBookmark(url) {
        chrome.tabs.create({ url: url });
    }

    // 显示/隐藏加载状态
    showLoading(show) {
        this.loading.style.display = show ? 'flex' : 'none';
        this.bookmarksTree.style.display = show ? 'none' : 'block';
    }

    // 显示/隐藏无结果状态
    showNoResults(show) {
        this.noResults.style.display = show ? 'flex' : 'none';
    }

    // 更新搜索提示
    updateSearchTips(text) {
        this.searchTips.textContent = text;
    }

    // 显示错误
    showError(message) {
        this.showLoading(false);
        this.bookmarksTree.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #ef4444;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div>${message}</div>
            </div>
        `;
    }

    // 工具函数
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    // 获取网站图标URL
    getFaviconUrl(url) {
        try {
            const domain = new URL(url).origin;
            return `${domain}/favicon.ico`;
        } catch {
            // 如果URL无效，返回默认图标
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/><path fill="%23666" d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>';
        }
    }

    // 关闭侧边栏
    closeSidebar() {
        // 对于侧边栏扩展，我们可以尝试关闭当前窗口
        // 或者发送消息给background script来关闭侧边栏
        try {
            // 方法1: 尝试关闭当前窗口（可能不会成功，因为安全限制）
            window.close();
        } catch (error) {
            console.log('无法直接关闭窗口，尝试其他方法');

            // 方法2: 发送消息给background script
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage({ action: 'closeSidePanel' }).catch(() => {
                    // 如果消息发送失败，显示提示
                    this.showCloseHint();
                });
            } else {
                this.showCloseHint();
            }
        }
    }

    // 显示关闭提示
    showCloseHint() {
        // 创建一个临时提示
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #374151;
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        hint.textContent = '请点击浏览器侧边栏的关闭按钮';

        document.body.appendChild(hint);

        // 2秒后自动移除提示
        setTimeout(() => {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 2000);
    }

    // 处理书签操作
    async handleBookmarkAction(action, id) {
        try {
            switch (action) {
                case 'edit':
                    await this.editBookmark(id);
                    break;
                case 'delete':
                    await this.deleteBookmark(id);
                    break;
            }
        } catch (error) {
            console.error('书签操作失败:', error);
            this.showMessage('操作失败: ' + error.message, 'error');
        }
    }

    // 编辑书签
    async editBookmark(id) {
        const bookmark = await chrome.bookmarks.get(id);
        if (!bookmark || bookmark.length === 0) return;

        const item = bookmark[0];
        const isFolder = !item.url;

        const title = prompt(
            isFolder ? '编辑文件夹名称:' : '编辑书签标题:',
            item.title
        );

        if (title === null || title.trim() === '') return;

        const updateData = { title: title.trim() };

        if (!isFolder) {
            const url = prompt('编辑书签URL:', item.url);
            if (url === null || url.trim() === '') return;
            updateData.url = url.trim();
        }

        await chrome.bookmarks.update(id, updateData);
        await this.loadBookmarks();
        this.showMessage(isFolder ? '文件夹已更新' : '书签已更新', 'success');
    }

    // 删除书签
    async deleteBookmark(id) {
        console.log('删除书签，ID:', id); // 调试信息

        if (!id) {
            this.showMessage('书签ID无效', 'error');
            return;
        }

        try {
            const bookmark = await chrome.bookmarks.get(id);
            if (!bookmark || bookmark.length === 0) {
                this.showMessage('找不到指定的书签', 'error');
                return;
            }

            const item = bookmark[0];
            const isFolder = !item.url;

            const confirmMsg = isFolder
                ? `确定要删除文件夹 "${item.title}" 及其所有内容吗？`
                : `确定要删除书签 "${item.title}" 吗？`;

            if (!confirm(confirmMsg)) return;

            if (isFolder) {
                await chrome.bookmarks.removeTree(id);
            } else {
                await chrome.bookmarks.remove(id);
            }

            // 使用局部刷新而不是全量刷新
            this.removeBookmarkElement(id);
            this.showMessage(isFolder ? '文件夹已删除' : '书签已删除', 'success');
        } catch (error) {
            console.error('删除书签失败:', error);
            this.showMessage('删除失败: ' + error.message, 'error');
        }
    }



    // 显示消息提示
    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // 处理右键菜单
    handleContextMenu(e) {
        e.preventDefault();

        const bookmarkItem = e.target.closest('.bookmark-item');
        if (!bookmarkItem) {
            console.log('未找到bookmark-item元素');
            return;
        }

        const id = bookmarkItem.dataset.id;
        console.log('右键菜单，获取到的ID:', id); // 调试信息

        if (!id) {
            console.log('bookmark-item没有data-id属性');
            return;
        }

        this.showContextMenu(e.clientX, e.clientY, id);
    }

    // 显示右键菜单
    showContextMenu(x, y, id) {
        // 移除已存在的菜单
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        menu.innerHTML = `
            <div class="context-menu-item" data-action="edit" data-id="${id}">✏️ 编辑</div>
            <div class="context-menu-item" data-action="delete" data-id="${id}">🗑️ 删除</div>
        `;

        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (item) {
                const action = item.dataset.action;
                const itemId = item.dataset.id;
                this.handleBookmarkAction(action, itemId);
            }
            menu.remove();
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', () => {
            menu.remove();
        }, { once: true });

        document.body.appendChild(menu);
    }





    // 局部删除书签元素（避免全量刷新）
    removeBookmarkElement(id) {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            // 添加删除动画
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '0';
            element.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                element.remove();
            }, 300);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new BookmarkSidebar();
});
