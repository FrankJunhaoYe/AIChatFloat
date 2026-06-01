import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'AIChatFloat',
    description: 'A floating workspace for AI prompts, conversations, and exports.',
    permissions: ['storage'],
    host_permissions: ['*://chatgpt.com/*'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
