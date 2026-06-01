import { describe, it, expect } from 'vitest';
import { toJson } from './json';

describe('toJson', () => {
  it('serializes a conversation as pretty-printed JSON', () => {
    const conversation = { url: 'u', capturedAt: 1, messages: [{ role: 'user' as const, content: 'x' }] };
    const json = toJson(conversation);
    expect(JSON.parse(json)).toEqual(conversation);
    expect(json).toContain('\n'); // indented / pretty
  });
});
