import type { SiteAdapter } from '../SiteAdapter';
import type { Conversation } from '@/features/export/types';
import { extractConversation } from './extract';
import { insertPromptIntoEditor } from './insert';

export class ChatGPTAdapter implements SiteAdapter {
  matches(url: string): boolean {
    try {
      return /(^|\.)chatgpt\.com$/.test(new URL(url).hostname);
    } catch {
      return false;
    }
  }

  insertPrompt(text: string): boolean {
    return insertPromptIntoEditor(text, document);
  }

  extractConversation(): Conversation {
    return extractConversation(document, location.href);
  }
}
