import { describe, it, expect } from 'vitest';
import { toMarkdown } from './markdown';

describe('toMarkdown', () => {
  it('renders the title and role headings with content', () => {
    const md = toMarkdown({
      url: 'https://chatgpt.com/c/1', capturedAt: 0, title: 'My Chat',
      messages: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
      ],
    });
    expect(md).toContain('# My Chat');
    expect(md).toContain('## 🧑 User');
    expect(md).toContain('Hello');
    expect(md).toContain('## 🤖 Assistant');
    expect(md).toContain('Hi there');
  });

  it('starts with the first role heading when there is no title', () => {
    const md = toMarkdown({ url: 'u', capturedAt: 0, messages: [{ role: 'user', content: 'x' }] });
    expect(md.startsWith('## 🧑 User')).toBe(true);
  });
});
