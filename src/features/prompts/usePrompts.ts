import { useCallback, useEffect, useState } from 'react';
import type { Prompt } from './types';
import type { PromptRepository } from './PromptRepository';
import { filterPrompts } from './search';

export interface UsePrompts {
  /** Prompts already filtered by the current `search`. */
  prompts: Prompt[];
  loading: boolean;
  search: string;
  setSearch: (query: string) => void;
  create: (input: { title: string; body: string }) => Promise<void>;
  update: (id: string, patch: { title?: string; body?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function usePrompts(repo: PromptRepository): UsePrompts {
  const [all, setAll] = useState<Prompt[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setAll(await repo.findAll());
    setLoading(false);
  }, [repo]);

  useEffect(() => { void reload(); }, [reload]);

  const create = useCallback(
    async (input: { title: string; body: string }) => { await repo.create(input); await reload(); },
    [repo, reload],
  );

  const update = useCallback(
    async (id: string, patch: { title?: string; body?: string }) => { await repo.update(id, patch); await reload(); },
    [repo, reload],
  );

  const remove = useCallback(
    async (id: string) => { await repo.remove(id); await reload(); },
    [repo, reload],
  );

  return { prompts: filterPrompts(all, search), loading, search, setSearch, create, update, remove, reload };
}
