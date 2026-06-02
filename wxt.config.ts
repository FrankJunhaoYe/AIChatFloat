import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage'],
    host_permissions: ['*://chatgpt.com/*'],
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
  },
  hooks: {
    // E2E build only: also inject into the local mock page so we never touch real chatgpt.com.
    'build:manifestGenerated'(_wxt, manifest) {
      if (!process.env.E2E) return;
      for (const cs of manifest.content_scripts ?? []) {
        if (cs.matches?.includes('*://chatgpt.com/*') && !cs.matches.includes('http://localhost/*')) {
          cs.matches.push('http://localhost/*');
        }
      }
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
