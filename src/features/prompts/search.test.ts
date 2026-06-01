import { describe, it, expect } from 'vitest';
import { filterPrompts } from './search';
import type { Prompt } from './types';

const make = (over: Partial<Prompt>): Prompt =>
  ({ id: '1', title: '', body: '', createdAt: 0, updatedAt: 0, ...over });

describe('filterPrompts', () => {
  it('returns all prompts when the query is blank', () => {
    const prompts = [make({ title: 'a' }), make({ title: 'b' })];
    expect(filterPrompts(prompts, '   ')).toHaveLength(2);
  });

  it('matches title case-insensitively', () => {
    const prompts = [make({ id: '1', title: 'Summarize' }), make({ id: '2', title: 'Translate' })];
    expect(filterPrompts(prompts, 'summ').map((p) => p.id)).toEqual(['1']);
  });

  it('matches body and tags', () => {
    const prompts = [make({ id: '1', body: 'in English' }), make({ id: '2', tags: ['email'] })];
    expect(filterPrompts(prompts, 'english').map((p) => p.id)).toEqual(['1']);
    expect(filterPrompts(prompts, 'email').map((p) => p.id)).toEqual(['2']);
  });
});
