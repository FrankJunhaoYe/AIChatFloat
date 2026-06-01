import { describe, it, expect } from 'vitest';
import { ChatGPTAdapter } from './ChatGPTAdapter';

describe('ChatGPTAdapter', () => {
  const adapter = new ChatGPTAdapter();

  it('matches chatgpt.com and its subdomains only', () => {
    expect(adapter.matches('https://chatgpt.com/c/1')).toBe(true);
    expect(adapter.matches('https://chat.chatgpt.com/')).toBe(true);
    expect(adapter.matches('https://claude.ai/chat')).toBe(false);
    expect(adapter.matches('https://notchatgpt.com.evil.com/')).toBe(false);
    expect(adapter.matches('not a url')).toBe(false);
  });

  it('extractConversation reads the live document', () => {
    document.body.innerHTML =
      '<div data-message-author-role="user"><div class="markdown">Hi</div></div>';
    expect(adapter.extractConversation().messages).toEqual([{ role: 'user', content: 'Hi' }]);
  });

  it('insertPrompt writes into the live editor', () => {
    document.body.innerHTML = '<div id="prompt-textarea" contenteditable="true"></div>';
    expect(adapter.insertPrompt('Hello')).toBe(true);
    expect(document.getElementById('prompt-textarea')!.textContent).toBe('Hello');
  });
});
