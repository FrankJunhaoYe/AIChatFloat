import { useTranslation } from 'react-i18next';
import type { Prompt } from '@/features/prompts/types';

interface PromptItemProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onInsert: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

const BTN =
  'rounded px-2 py-0.5 text-xs text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10';

export function PromptItem({ prompt, onCopy, onInsert, onEdit, onDelete }: PromptItemProps) {
  const { t } = useTranslation();
  return (
    <li className="rounded-md border border-black/5 bg-white p-2 dark:border-white/10 dark:bg-neutral-800">
      <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100" title={prompt.title}>
        {prompt.title}
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <button type="button" className={BTN} onClick={() => onInsert(prompt)}>{t('actions.insert')}</button>
        <button type="button" className={BTN} onClick={() => onCopy(prompt)}>{t('actions.copy')}</button>
        <button type="button" className={BTN} onClick={() => onEdit(prompt)}>{t('actions.edit')}</button>
        <button type="button" className={BTN} onClick={() => onDelete(prompt.id)}>{t('actions.delete')}</button>
      </div>
    </li>
  );
}
