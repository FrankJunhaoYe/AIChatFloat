import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { fakeBrowser } from 'wxt/testing';
import { I18nProvider, useLanguage } from './I18nProvider';
import { getItem, setItem } from '@/storage/storage';

function Probe() {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={() => setLanguage('zh-CN')}>switch</button>
    </div>
  );
}

describe('I18nProvider', () => {
  beforeEach(() => { fakeBrowser.reset(); });

  it('provides the current language and persists changes to storage', async () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByText('switch'));

    await waitFor(() => expect(screen.getByTestId('lang').textContent).toBe('zh-CN'));
    expect(await getItem('lang', null)).toBe('zh-CN');
  });

  it('loads the persisted language on mount', async () => {
    await setItem('lang', 'zh-CN');
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('lang').textContent).toBe('zh-CN'));
  });
});
