import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { PromptList } from './PromptList';
import type { Prompt } from '@/features/prompts/types';

const noop = () => {};
const handlers = { onCopy: noop, onInsert: noop, onEdit: noop, onDelete: noop };
const make = (id: string, title: string): Prompt => ({ id, title, body: '', createdAt: 0, updatedAt: 0 });

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('PromptList', () => {
  it('shows the empty state when there are no prompts', () => {
    render(<PromptList prompts={[]} {...handlers} />);
    expect(screen.getByText('No prompts yet')).toBeTruthy();
  });

  it('renders a row per prompt', () => {
    render(<PromptList prompts={[make('1', 'Alpha'), make('2', 'Beta')]} {...handlers} />);
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Beta')).toBeTruthy();
  });
});
