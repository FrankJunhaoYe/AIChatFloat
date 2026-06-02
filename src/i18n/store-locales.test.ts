import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const load = (locale: string): Record<string, { message: string }> =>
  JSON.parse(
    readFileSync(resolve(here, `../../public/_locales/${locale}/messages.json`), 'utf8'),
  );

describe('store _locales', () => {
  it('en and zh_CN expose identical message keys', () => {
    expect(Object.keys(load('zh_CN')).sort()).toEqual(Object.keys(load('en')).sort());
  });

  it('every message has a non-empty string', () => {
    for (const locale of ['en', 'zh_CN']) {
      for (const [key, entry] of Object.entries(load(locale))) {
        expect(entry.message, `${locale}.${key}`).toBeTruthy();
      }
    }
  });
});
