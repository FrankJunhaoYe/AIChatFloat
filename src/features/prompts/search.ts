import type { Prompt } from './types';

export function filterPrompts(prompts: Prompt[], query: string): Prompt[] {
  const q = query.trim().toLowerCase();
  if (!q) return prompts;
  return prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );
}
