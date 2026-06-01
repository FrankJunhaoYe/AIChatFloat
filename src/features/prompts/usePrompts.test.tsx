import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { fakeBrowser } from 'wxt/testing';
import { usePrompts } from './usePrompts';
import { LocalPromptRepository } from './PromptRepository';

describe('usePrompts', () => {
  beforeEach(() => { fakeBrowser.reset(); });

  it('loads empty, creates, filters by search, and removes', async () => {
    const repo = new LocalPromptRepository();
    const { result } = renderHook(() => usePrompts(repo));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prompts).toEqual([]);

    await act(async () => { await result.current.create({ title: 'Summarize', body: 'sum' }); });
    await act(async () => { await result.current.create({ title: 'Translate', body: 'tr' }); });
    expect(result.current.prompts).toHaveLength(2);

    act(() => { result.current.setSearch('summ'); });
    expect(result.current.prompts.map((p) => p.title)).toEqual(['Summarize']);

    act(() => { result.current.setSearch(''); });
    const id = result.current.prompts[0].id;
    await act(async () => { await result.current.remove(id); });
    expect(result.current.prompts).toHaveLength(1);
  });
});
