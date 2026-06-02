export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id == null) return;
    try {
      await browser.tabs.sendMessage(tab.id, { type: 'AICF_TOGGLE' });
    } catch {
      // No content script on this tab (not chatgpt.com) — ignore.
    }
  });
});
