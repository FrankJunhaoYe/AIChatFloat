import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { initI18n } from '@/i18n/config';
import { ExportPanel } from './ExportPanel';

beforeEach(async () => { await initI18n('en').changeLanguage('en'); });

describe('ExportPanel', () => {
  it('fires onExport with the chosen format', () => {
    const onExport = vi.fn();
    render(<ExportPanel onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: 'Markdown' }));
    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));
    expect(onExport).toHaveBeenNthCalledWith(1, 'md');
    expect(onExport).toHaveBeenNthCalledWith(2, 'json');
  });
});
