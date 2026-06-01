import { browser } from 'wxt/browser';

export const STORAGE_PREFIX = 'aicf:';

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  const fullKey = STORAGE_PREFIX + key;
  const result = await browser.storage.local.get(fullKey);
  const value = result[fullKey];
  return value === undefined ? fallback : (value as T);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await browser.storage.local.set({ [STORAGE_PREFIX + key]: value });
}
