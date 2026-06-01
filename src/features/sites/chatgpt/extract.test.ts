import { describe, it, expect } from 'vitest';
import fixtureHtml from './__fixtures__/conversation.html?raw';
import { extractConversation } from './extract';

const parse = (html: string): Document =>
  new DOMParser().parseFromString(html, 'text/html');

describe('extractConversation', () => {
  it('extracts user/assistant turns in order from the ChatGPT DOM', () => {
    const conv = extractConversation(parse(fixtureHtml), 'https://chatgpt.com/c/abc');
    expect(conv.url).toBe('https://chatgpt.com/c/abc');
    expect(conv.messages).toEqual([
      { role: 'user', content: 'Translate "hello" to French' },
      { role: 'assistant', content: '"Bonjour"' },
      { role: 'user', content: 'Thanks!' },
    ]);
    expect(conv.capturedAt).toBeGreaterThan(0);
  });

  it('skips unknown roles and empty content', () => {
    const doc = parse(
      '<div data-message-author-role="system"><div class="markdown">sys</div></div>' +
      '<div data-message-author-role="user"><div class="markdown">   </div></div>' +
      '<div data-message-author-role="assistant"><div class="markdown">Hi</div></div>',
    );
    expect(extractConversation(doc, 'u').messages).toEqual([{ role: 'assistant', content: 'Hi' }]);
  });
});
