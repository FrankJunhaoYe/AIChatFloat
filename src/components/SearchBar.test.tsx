import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { SearchBar } from './SearchBar';

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('SearchBar', () => {
  it('renders the localized placeholder and reports changes', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search prompts…');
    fireEvent.change(input, { target: { value: 'sum' } });
    expect(onChange).toHaveBeenCalledWith('sum');
  });
});
