import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n } from './config';

describe('i18n', () => {
  beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

  it('resolves English strings', () => {
    expect(initI18n('en').t('actions.copy')).toBe('Copy');
  });

  it('resolves Chinese strings after switching language', async () => {
    const i = initI18n('en');
    await i.changeLanguage('zh-CN');
    expect(i.t('actions.copy')).toBe('复制');
  });

  it('falls back to English for unknown languages', async () => {
    const i = initI18n('en');
    await i.changeLanguage('fr');
    expect(i.t('actions.save')).toBe('Save');
  });
});
