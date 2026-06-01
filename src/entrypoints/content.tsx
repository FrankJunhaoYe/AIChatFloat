export default defineContentScript({
  matches: ['*://chatgpt.com/*'],
  main() {
    console.log('[AIChatFloat] content script loaded');
  },
});
