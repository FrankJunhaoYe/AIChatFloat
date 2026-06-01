import type { Conversation } from './types';

export function toMarkdown(conversation: Conversation): string {
  const lines: string[] = [];
  if (conversation.title) lines.push(`# ${conversation.title}`, '');
  for (const msg of conversation.messages) {
    const heading = msg.role === 'user' ? '## 🧑 User' : '## 🤖 Assistant';
    lines.push(heading, '', msg.content.trim(), '');
  }
  return lines.join('\n').trimEnd() + '\n';
}
