import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { fakeBrowser } from 'wxt/testing';
import { I18nProvider } from '@/i18n/I18nProvider';
import { ToastProvider } from '@/lib/useToast';
import { LocalPromptRepository } from '@/features/prompts/PromptRepository';
import type { SiteAdapter } from '@/features/sites/SiteAdapter';
import type { Conversation } from '@/features/export/types';
import { Sidebar } from './Sidebar';

function fakeAdapter(conv: Conversation) {
  return {
    matches: () => true,
    insertPrompt: vi.fn(() => true),
    extractConversation: () => conv,
  } satisfies SiteAdapter;
}

function renderSidebar(adapter: SiteAdapter) {
  return render(
    <I18nProvider>
      <ToastProvider>
        <Sidebar adapter={adapter} repo={new LocalPromptRepository()} />
      </ToastProvider>
    </I18nProvider>,
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    (URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(() => 'blob:x');
    (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();
  });

  it('opens, adds a prompt, inserts it, and exports the conversation', async () => {
    const adapter = fakeAdapter({ url: 'u', capturedAt: 1, messages: [{ role: 'user', content: 'hi' }] });
    renderSidebar(adapter);

    fireEvent.click(screen.getByRole('button', { name: /Open AIChatFloat/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Add prompt' }));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Greet' } });
    fireEvent.change(screen.getByPlaceholderText('Prompt text'), { target: { value: 'Say hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByText('Greet')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
    expect(adapter.insertPrompt).toHaveBeenCalledWith('Say hi');

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Markdown' }));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
