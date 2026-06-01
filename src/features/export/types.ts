export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  title?: string;
  url: string;
  capturedAt: number;
  messages: ChatMessage[];
}
