import { describe, it, expect, vi } from 'vitest';
import { insertPromptIntoEditor } from './insert';

describe('insertPromptIntoEditor', () => {
  it('returns false when the editor is not present', () => {
    document.body.innerHTML = '<div></div>';
    expect(insertPromptIntoEditor('hi', document)).toBe(false);
  });

  it('inserts text and emits an input event (fallback path in jsdom)', () => {
    document.body.innerHTML = '<div id="prompt-textarea" contenteditable="true"></div>';
    const editor = document.getElementById('prompt-textarea')!;
    const onInput = vi.fn();
    editor.addEventListener('input', onInput);

    const ok = insertPromptIntoEditor('Summarize this', document);

    expect(ok).toBe(true);
    expect(editor.textContent).toBe('Summarize this');
    expect(onInput).toHaveBeenCalledOnce();
  });
});
