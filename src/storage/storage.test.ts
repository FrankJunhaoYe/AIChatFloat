import { describe, it, expect, beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { getItem, setItem, STORAGE_PREFIX } from './storage';

describe('storage', () => {
  beforeEach(() => { fakeBrowser.reset(); });

  it('returns the fallback when a key is absent', async () => {
    expect(await getItem('missing', [])).toEqual([]);
  });

  it('persists and retrieves a value under the aicf: prefix', async () => {
    await setItem('prompts', [{ id: '1' }]);
    expect(await getItem('prompts', [])).toEqual([{ id: '1' }]);
  });

  it('namespaces keys with STORAGE_PREFIX', async () => {
    await setItem('foo', 42);
    const raw = await fakeBrowser.storage.local.get(`${STORAGE_PREFIX}foo`);
    expect(raw[`${STORAGE_PREFIX}foo`]).toBe(42);
  });
});
