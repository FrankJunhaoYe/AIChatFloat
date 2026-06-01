export const CHATGPT_SELECTORS = {
  /** Each conversation turn carries this attribute (value: 'user' | 'assistant' | 'system'). */
  authorRoleAttr: 'data-message-author-role',
  /** Text container within a turn; falls back to the turn element itself. */
  messageContent: '.markdown, .whitespace-pre-wrap',
  /** ChatGPT's ProseMirror input editor (contenteditable). */
  editor: '#prompt-textarea',
} as const;
