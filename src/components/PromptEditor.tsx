import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Prompt } from '@/features/prompts/types';

interface PromptEditorProps {
  initial?: Prompt;
  onSave: (data: { title: string; body: string }) => void;
  onCancel: () => void;
}

export function PromptEditor({ initial, onSave, onCancel }: PromptEditorProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const canSave = title.trim().length > 0;

  return (
    <form
      className="flex flex-col gap-2 rounded-md border border-black/10 bg-white p-2 dark:border-white/15 dark:bg-neutral-800"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSave) onSave({ title: title.trim(), body });
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('prompt.titlePlaceholder')}
        aria-label={t('prompt.titlePlaceholder')}
        className="rounded border border-black/10 px-2 py-1 text-sm text-neutral-900 dark:border-white/15 dark:bg-neutral-700 dark:text-neutral-100"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t('prompt.bodyPlaceholder')}
        aria-label={t('prompt.bodyPlaceholder')}
        rows={4}
        className="resize-y rounded border border-black/10 px-2 py-1 text-sm text-neutral-900 dark:border-white/15 dark:bg-neutral-700 dark:text-neutral-100"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1 text-sm text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
        >
          {t('actions.cancel')}
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-40"
        >
          {t('actions.save')}
        </button>
      </div>
    </form>
  );
}
