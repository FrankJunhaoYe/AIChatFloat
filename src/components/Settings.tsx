import { useTranslation } from 'react-i18next';
import type { Language } from '@/i18n/config';

interface SettingsProps {
  language: Language;
  onChange: (language: Language) => void;
}

export function Settings({ language, onChange }: SettingsProps) {
  const { t } = useTranslation();
  return (
    <label className="flex items-center gap-2 whitespace-nowrap text-xs text-neutral-500">
      {t('settings.language')}
      <select
        value={language}
        onChange={(e) => onChange(e.target.value as Language)}
        aria-label={t('settings.language')}
        className="rounded border border-black/10 bg-white px-1.5 py-0.5 text-xs text-neutral-800 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-100"
      >
        <option value="en">English</option>
        <option value="zh-CN">中文</option>
      </select>
    </label>
  );
}
