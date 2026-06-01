import type { Conversation, ChatMessage } from '@/features/export/types';
import { CHATGPT_SELECTORS as S } from './selectors';

export function extractConversation(doc: Document, url: string): Conversation {
  const nodes = Array.from(doc.querySelectorAll(`[${S.authorRoleAttr}]`));
  const messages: ChatMessage[] = [];
  for (const node of nodes) {
    const role = node.getAttribute(S.authorRoleAttr);
    if (role !== 'user' && role !== 'assistant') continue;
    const contentEl = node.querySelector(S.messageContent) ?? node;
    const content = (contentEl.textContent ?? '').trim();
    if (!content) continue;
    messages.push({ role, content });
  }
  const title = doc.title?.replace(/\s*[|-]\s*ChatGPT\s*$/i, '').trim() || undefined;
  return { title, url, capturedAt: Date.now(), messages };
}
