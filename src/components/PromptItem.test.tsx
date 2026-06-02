import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { PromptItem } from './PromptItem';
import type { Prompt } from '@/features/prompts/types';

const prompt: Prompt = { id: 'p1', title: 'Summarize', body: 'Summarize this', createdAt: 1, updatedAt: 1 };

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('PromptItem', () => {
  it('renders the title and fires the right callback per action', () => {
    const onCopy = vi.fn();
    const onInsert = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <PromptItem prompt={prompt} onCopy={onCopy} onInsert={onInsert} onEdit={onEdit} onDelete={onDelete} />,
    );

    expect(screen.getByText('Summarize')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onInsert).toHaveBeenCalledWith(prompt);
    expect(onCopy).toHaveBeenCalledWith(prompt);
    expect(onEdit).toHaveBeenCalledWith(prompt);
    expect(onDelete).toHaveBeenCalledWith('p1');
  });
});
