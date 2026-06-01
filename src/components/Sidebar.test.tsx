import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { fakeBrowser } from 'wxt/testing';
import { I18nProvider } from '@/i18n/I18nProvider';
import { ToastProvider } from '@/lib/useToast';
import { LocalPromptRepository } from '@/features/prompts/PromptRepository';
import type { SiteAdapter } from '@/features/sites/SiteAdapter';
import type { Conversation } from '@/features/export/types';
import { Sidebar } from './Sidebar';

function renderSidebar(adapter: SiteAdapter) {
  return render(
    <I18nProvider>
      <ToastProvider>
        <Sidebar adapter={adapter} repo={new LocalPromptRepository()} />
      </ToastProvider>
    </I18nProvider>,
  );
}

async function addPrompt(title: string, body: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Add prompt' }));
  fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: title } });
  fireEvent.change(screen.getByPlaceholderText('Prompt text'), { target: { value: body } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByText(title)).toBeTruthy());
}

describe('Sidebar', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    (URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(() => 'blob:x');
    (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();
  });

  it('opens, adds a prompt, inserts it, and exports the conversation', async () => {
    const adapter = {
      matches: () => true,
      insertPrompt: vi.fn(() => true),
      extractConversation: (): Conversation => ({ url: 'u', capturedAt: 1, messages: [{ role: 'user', content: 'hi' }] }),
    } satisfies SiteAdapter;
    renderSidebar(adapter);

    fireEvent.click(screen.getByRole('button', { name: /Open AIChatFloat/i }));
    await addPrompt('Greet', 'Say hi');

    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
    expect(adapter.insertPrompt).toHaveBeenCalledWith('Say hi');

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Markdown' }));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('handles copy, failed insert, empty export, and editing', async () => {
    const adapter = {
      matches: () => true,
      insertPrompt: vi.fn(() => false),
      extractConversation: (): Conversation => ({ url: 'u', capturedAt: 0, messages: [] }),
    } satisfies SiteAdapter;
    renderSidebar(adapter);

    fireEvent.click(screen.getByRole('button', { name: /Open AIChatFloat/i }));
    await addPrompt('P', 'body');

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(screen.getByText('Copied to clipboard')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
    await waitFor(() => expect(screen.getByText("Couldn't find the ChatGPT input")).toBeTruthy());

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Markdown' }));
    await waitFor(() => expect(screen.getByText('No conversation to export')).toBeTruthy());
    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const title = screen.getByPlaceholderText('Title') as HTMLInputElement;
    expect(title.value).toBe('P');
    fireEvent.change(title, { target: { value: 'P2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.getByText('P2')).toBeTruthy());
  });
});
