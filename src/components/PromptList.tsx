import { useTranslation } from 'react-i18next';
import type { Prompt } from '@/features/prompts/types';
import { PromptItem } from './PromptItem';

interface PromptListProps {
  prompts: Prompt[];
  onCopy: (prompt: Prompt) => void;
  onInsert: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptList({ prompts, ...handlers }: PromptListProps) {
  const { t } = useTranslation();
  if (prompts.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-500">{t('sidebar.empty')}</p>;
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {prompts.map((prompt) => (
        <PromptItem key={prompt.id} prompt={prompt} {...handlers} />
      ))}
    </ul>
  );
}
