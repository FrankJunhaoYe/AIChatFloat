import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fakeBrowser } from 'wxt/testing';
import App from './App';

describe('App', () => {
  beforeEach(() => { fakeBrowser.reset(); });

  it('renders the floating action button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Open AIChatFloat/i })).toBeTruthy();
  });
});
