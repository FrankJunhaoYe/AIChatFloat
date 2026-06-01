import { describe, it, expect, beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { LocalPromptRepository } from './PromptRepository';

describe('LocalPromptRepository', () => {
  let repo: LocalPromptRepository;
  beforeEach(() => { fakeBrowser.reset(); repo = new LocalPromptRepository(); });

  it('starts empty', async () => {
    expect(await repo.findAll()).toEqual([]);
  });

  it('creates a prompt with id + timestamps, newest first', async () => {
    const p = await repo.create({ title: 'Greet', body: 'Say hi' });
    expect(p.id).toBeTruthy();
    expect(p.createdAt).toBeGreaterThan(0);
    expect(p.updatedAt).toBe(p.createdAt);
    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('Greet');
  });

  it('keeps newest prompts first', async () => {
    await repo.create({ title: 'first', body: 'x' });
    await repo.create({ title: 'second', body: 'y' });
    const all = await repo.findAll();
    expect(all.map((p) => p.title)).toEqual(['second', 'first']);
  });

  it('updates immutably and bumps updatedAt', async () => {
    const p = await repo.create({ title: 'A', body: 'x' });
    const updated = await repo.update(p.id, { title: 'B' });
    expect(updated.title).toBe('B');
    expect(updated.body).toBe('x');
    expect(updated.updatedAt).toBeGreaterThanOrEqual(p.updatedAt);
    expect((await repo.findAll())[0].title).toBe('B');
  });

  it('throws when updating a missing prompt', async () => {
    await expect(repo.update('nope', { title: 'x' })).rejects.toThrow('Prompt not found');
  });

  it('removes a prompt', async () => {
    const p = await repo.create({ title: 'A', body: 'x' });
    await repo.remove(p.id);
    expect(await repo.findAll()).toEqual([]);
  });
});
