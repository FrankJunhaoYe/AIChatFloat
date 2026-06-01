import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { PromptEditor } from './PromptEditor';

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('PromptEditor', () => {
  it('disables Save until a title is entered, then saves trimmed values', () => {
    const onSave = vi.fn();
    render(<PromptEditor onSave={onSave} onCancel={() => {}} />);

    const save = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: '  Greeting  ' } });
    fireEvent.change(screen.getByPlaceholderText('Prompt text'), { target: { value: 'Say hi' } });
    expect(save.disabled).toBe(false);

    fireEvent.click(save);
    expect(onSave).toHaveBeenCalledWith({ title: 'Greeting', body: 'Say hi' });
  });

  it('prefills from initial and cancels', () => {
    const onCancel = vi.fn();
    render(
      <PromptEditor
        initial={{ id: '1', title: 'T', body: 'B', createdAt: 0, updatedAt: 0 }}
        onSave={() => {}}
        onCancel={onCancel}
      />,
    );
    expect((screen.getByPlaceholderText('Title') as HTMLInputElement).value).toBe('T');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
