import type { Conversation } from './types';

export function toJson(conversation: Conversation): string {
  return JSON.stringify(conversation, null, 2);
}
