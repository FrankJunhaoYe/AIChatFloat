import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from './useToast';

function Probe() {
  const { toast } = useToast();
  return (
    <button onClick={() => { toast('A'); toast('B'); }}>go</button>
  );
}

describe('useToast', () => {
  it('shows each toast message when triggered', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('go'));
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('auto-dismisses toasts after the timeout', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Probe />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByText('go'));
      expect(screen.getByText('A')).toBeTruthy();
      act(() => { vi.advanceTimersByTime(3000); });
      expect(screen.queryByText('A')).toBeNull();
      expect(screen.queryByText('B')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
