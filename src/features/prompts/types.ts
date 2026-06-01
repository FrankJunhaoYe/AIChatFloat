export interface Prompt {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
