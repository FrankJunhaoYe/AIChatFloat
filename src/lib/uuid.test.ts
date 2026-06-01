import { describe, it, expect } from 'vitest';
import { uuid } from './uuid';

describe('uuid', () => {
  it('generates a 36-char unique id', () => {
    const a = uuid();
    const b = uuid();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(a).not.toBe(b);
  });
});
