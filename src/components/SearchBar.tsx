import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('sidebar.search')}
      aria-label={t('sidebar.search')}
      className="w-full rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black/30 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-100"
    />
  );
}
