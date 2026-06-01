import { useTranslation } from 'react-i18next';

interface ExportPanelProps {
  onExport: (format: 'md' | 'json') => void;
}

const BTN =
  'rounded border border-black/10 px-2 py-0.5 text-xs text-neutral-700 hover:bg-black/5 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10';

export function ExportPanel({ onExport }: ExportPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500">{t('export.title')}</span>
      <button type="button" className={BTN} onClick={() => onExport('md')}>{t('export.markdown')}</button>
      <button type="button" className={BTN} onClick={() => onExport('json')}>{t('export.json')}</button>
    </div>
  );
}
