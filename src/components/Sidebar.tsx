import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { browser } from 'wxt/browser';
import type { SiteAdapter } from '@/features/sites/SiteAdapter';
import { LocalPromptRepository, type PromptRepository } from '@/features/prompts/PromptRepository';
import { usePrompts } from '@/features/prompts/usePrompts';
import type { Prompt } from '@/features/prompts/types';
import { toMarkdown } from '@/features/export/markdown';
import { toJson } from '@/features/export/json';
import { downloadText } from '@/features/export/download';
import { exportFilename } from '@/features/export/filename';
import { useToast } from '@/lib/useToast';
import { useLanguage } from '@/i18n/I18nProvider';
import { SearchBar } from './SearchBar';
import { PromptList } from './PromptList';
import { PromptEditor } from './PromptEditor';
import { ExportPanel } from './ExportPanel';
import { Settings } from './Settings';

interface SidebarProps {
  adapter: SiteAdapter;
  /** Injectable for tests; defaults to a shared local repository. */
  repo?: PromptRepository;
}

const defaultRepo = new LocalPromptRepository();
const Z = 'z-[2147483646]';

export function Sidebar({ adapter, repo = defaultRepo }: SidebarProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const { prompts, search, setSearch, create, update, remove } = usePrompts(repo);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Prompt | null>(null);

  // Toggle from the toolbar icon (background sends AICF_TOGGLE to the tab).
  useEffect(() => {
    const listener = (message: unknown): void => {
      if (typeof message === 'object' && message !== null && (message as { type?: string }).type === 'AICF_TOGGLE') {
        setOpen((value) => !value);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const closeEditor = () => { setAdding(false); setEditing(null); };

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard?.writeText(prompt.body).catch(() => {});
    toast(t('toast.copied'));
  };

  const handleInsert = (prompt: Prompt) => {
    toast(adapter.insertPrompt(prompt.body) ? t('toast.inserted') : t('toast.insertFailed'));
  };

  const handleExport = (format: 'md' | 'json') => {
    const conversation = adapter.extractConversation();
    if (conversation.messages.length === 0) {
      toast(t('export.empty'));
      return;
    }
    const text = format === 'md' ? toMarkdown(conversation) : toJson(conversation);
    const mime = format === 'md' ? 'text/markdown' : 'application/json';
    downloadText(exportFilename(conversation, format), text, mime);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? t('sidebar.close') : t('sidebar.open')}
        onClick={() => setOpen((value) => !value)}
        className={`fixed bottom-4 right-4 ${Z} flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl text-white shadow-lg transition-colors hover:bg-emerald-700`}
      >
        💬
      </button>

      {open && (
        <div
          className={`fixed bottom-20 right-4 ${Z} flex max-h-[70vh] w-80 flex-col gap-2 overflow-hidden rounded-xl border border-black/10 bg-white p-3 text-neutral-900 shadow-2xl dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t('sidebar.title')}</span>
            <button
              type="button"
              aria-label={t('sidebar.close')}
              onClick={() => setOpen(false)}
              className="rounded px-1.5 text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <SearchBar value={search} onChange={setSearch} />

          {adding || editing ? (
            <PromptEditor
              initial={editing ?? undefined}
              onSave={async (data) => {
                if (editing) await update(editing.id, data);
                else await create(data);
                closeEditor();
              }}
              onCancel={closeEditor}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-md border border-dashed border-black/15 py-1.5 text-sm text-neutral-600 hover:bg-black/5 dark:border-white/20 dark:text-neutral-300 dark:hover:bg-white/10"
            >
              {t('actions.add')}
            </button>
          )}

          <div className="flex-1 overflow-y-auto">
            <PromptList
              prompts={prompts}
              onCopy={handleCopy}
              onInsert={handleInsert}
              onEdit={(prompt) => { setAdding(false); setEditing(prompt); }}
              onDelete={remove}
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-black/5 pt-2 dark:border-white/10">
            <ExportPanel onExport={handleExport} />
            <Settings language={language} onChange={setLanguage} />
          </div>
        </div>
      )}
    </>
  );
}
