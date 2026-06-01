import { describe, it, expect } from 'vitest';
import { exportFilename } from './filename';

describe('exportFilename', () => {
  it('builds a slugified name from the conversation title', () => {
    const name = exportFilename({ title: 'My Chat: Ideas!', url: 'u', capturedAt: 1717200000000, messages: [] }, 'md');
    expect(name).toBe('my-chat-ideas-1717200000000.md');
  });

  it('falls back to "conversation" when there is no title', () => {
    const name = exportFilename({ url: 'u', capturedAt: 1717200000000, messages: [] }, 'json');
    expect(name).toBe('conversation-1717200000000.json');
  });

  it('falls back to "conversation" when the title has no slug-able chars', () => {
    const name = exportFilename({ title: '！！！', url: 'u', capturedAt: 5, messages: [] }, 'md');
    expect(name).toBe('conversation-5.md');
  });
});
