import { describe, it, expect } from 'vitest';
import { getActionApi } from './browserAction';

const fakeAction = () => ({ onClicked: { addListener: () => {} } });

describe('getActionApi', () => {
  it('returns action (MV3: Chrome/Edge/Firefox-MV3) when present', () => {
    const action = fakeAction();
    expect(getActionApi({ action })).toBe(action);
  });

  it('falls back to browserAction (MV2: Firefox) when action is absent', () => {
    const browserAction = fakeAction();
    expect(getActionApi({ browserAction })).toBe(browserAction);
  });

  it('prefers action over browserAction when both exist', () => {
    const action = fakeAction();
    const browserAction = fakeAction();
    expect(getActionApi({ action, browserAction })).toBe(action);
  });

  it('throws when neither action nor browserAction exists', () => {
    expect(() => getActionApi({})).toThrow(/action API/i);
  });
});
