// Inject content.js automatically on supported pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js']
  }).catch(() => {});
});
