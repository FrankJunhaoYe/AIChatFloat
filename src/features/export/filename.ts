import type { Conversation } from './types';

export function exportFilename(conversation: Conversation, ext: 'md' | 'json'): string {
  const slug =
    (conversation.title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'conversation';
  return `${slug}-${conversation.capturedAt || Date.now()}.${ext}`;
}
