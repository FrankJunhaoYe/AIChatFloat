import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { Settings } from './Settings';

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('Settings', () => {
  it('shows the current language and reports a change', () => {
    const onChange = vi.fn();
    render(<Settings language="en" onChange={onChange} />);
    const select = screen.getByLabelText('Language') as HTMLSelectElement;
    expect(select.value).toBe('en');
    fireEvent.change(select, { target: { value: 'zh-CN' } });
    expect(onChange).toHaveBeenCalledWith('zh-CN');
  });
});
