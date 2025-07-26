// 背景脚本 - 处理侧边栏打开
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 打开侧边栏
    await chrome.sidePanel.open({ windowId: tab.windowId });
    console.log('侧边栏已打开');
  } catch (error) {
    console.error('打开侧边栏失败:', error);
  }
});

// 安装时的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('EasyBookmark 插件已安装');

  // 设置侧边栏为默认启用
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// 处理来自侧边栏的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'closeSidePanel') {
    // 尝试关闭侧边栏
    // 注意：Chrome扩展API可能不支持程序化关闭侧边栏
    // 这里我们记录日志，实际关闭需要用户手动操作
    console.log('收到关闭侧边栏请求');
    sendResponse({ success: false, message: '请手动关闭侧边栏' });
  }
});
