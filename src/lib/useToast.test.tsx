import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './useToast';

function Probe() {
  const { toast } = useToast();
  return <button onClick={() => toast('Saved!')}>go</button>;
}

describe('useToast', () => {
  it('shows a toast message when triggered', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('go'));
    expect(screen.getByText('Saved!')).toBeTruthy();
  });
});
