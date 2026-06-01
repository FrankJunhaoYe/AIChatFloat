import { CHATGPT_SELECTORS as S } from './selectors';

/**
 * Insert `text` into ChatGPT's input editor.
 *
 * Primary path uses `execCommand('insertText')` so ProseMirror/React register the
 * change; falls back to setting textContent + dispatching an input event (this is
 * also the path exercised by jsdom tests). Returns false only when the editor is absent.
 */
export function insertPromptIntoEditor(text: string, root: ParentNode = document): boolean {
  const editor = root.querySelector<HTMLElement>(S.editor);
  if (!editor) return false;

  editor.focus();

  let inserted = false;
  try {
    inserted = typeof document.execCommand === 'function' && document.execCommand('insertText', false, text);
  } catch {
    inserted = false;
  }

  if (!inserted) {
    editor.textContent = text;
    editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
  }
  return true;
}
