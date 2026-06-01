import type { Conversation } from '@/features/export/types';

export interface SiteAdapter {
  /** True if this adapter handles the given page URL. */
  matches(url: string): boolean;
  /** Insert text into the site's chat input. Returns true on success. */
  insertPrompt(text: string): boolean;
  /** Extract the current conversation from the page. */
  extractConversation(): Conversation;
}
