import type { Prompt } from './types';
import { getItem, setItem } from '@/storage/storage';
import { uuid } from '@/lib/uuid';

const PROMPTS_KEY = 'prompts';

export type CreatePromptInput = { title: string; body: string; tags?: string[] };
export type UpdatePromptPatch = Partial<Pick<Prompt, 'title' | 'body' | 'tags'>>;

export interface PromptRepository {
  findAll(): Promise<Prompt[]>;
  create(input: CreatePromptInput): Promise<Prompt>;
  update(id: string, patch: UpdatePromptPatch): Promise<Prompt>;
  remove(id: string): Promise<void>;
}

export class LocalPromptRepository implements PromptRepository {
  findAll(): Promise<Prompt[]> {
    return getItem<Prompt[]>(PROMPTS_KEY, []);
  }

  async create(input: CreatePromptInput): Promise<Prompt> {
    const now = Date.now();
    const prompt: Prompt = {
      id: uuid(),
      title: input.title,
      body: input.body,
      tags: input.tags,
      createdAt: now,
      updatedAt: now,
    };
    const all = await this.findAll();
    await setItem(PROMPTS_KEY, [prompt, ...all]);
    return prompt;
  }

  async update(id: string, patch: UpdatePromptPatch): Promise<Prompt> {
    const all = await this.findAll();
    const existing = all.find((p) => p.id === id);
    if (!existing) throw new Error(`Prompt not found: ${id}`);
    const updated: Prompt = { ...existing, ...patch, updatedAt: Date.now() };
    await setItem(PROMPTS_KEY, all.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  async remove(id: string): Promise<void> {
    const all = await this.findAll();
    await setItem(PROMPTS_KEY, all.filter((p) => p.id !== id));
  }
}
