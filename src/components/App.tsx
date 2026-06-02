import { I18nProvider } from '@/i18n/I18nProvider';
import { ToastProvider } from '@/lib/useToast';
import { ChatGPTAdapter } from '@/features/sites/chatgpt/ChatGPTAdapter';
import { Sidebar } from './Sidebar';

const adapter = new ChatGPTAdapter();

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <Sidebar adapter={adapter} />
      </ToastProvider>
    </I18nProvider>
  );
}
