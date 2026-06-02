import { getActionApi } from '@/lib/browserAction';

export default defineBackground(() => {
  // `action` (MV3) or `browserAction` (MV2/Firefox) — toolbar icon toggles the panel.
  getActionApi(browser).onClicked.addListener(async (tab) => {
    if (tab.id == null) return;
    try {
      await browser.tabs.sendMessage(tab.id, { type: 'AICF_TOGGLE' });
    } catch {
      // No content script on this tab (not chatgpt.com) — ignore.
    }
  });
});
