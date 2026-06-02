import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  // Firefox data collection is declared via the build:manifestGenerated hook below
  // (gecko.data_collection_permissions = none); silence WXT's generic reminder.
  suppressWarnings: { firefoxDataCollection: true },
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
    // Toolbar button. WXT maps `action` to `browser_action` for MV2 (Firefox) builds.
    action: {},
  },
  hooks: {
    'build:manifestGenerated'(wxt, manifest) {
      // E2E build only: also inject into the local mock page so we never touch real chatgpt.com.
      if (process.env.E2E) {
        for (const cs of manifest.content_scripts ?? []) {
          if (cs.matches?.includes('*://chatgpt.com/*') && !cs.matches.includes('http://localhost/*')) {
            cs.matches.push('http://localhost/*');
          }
        }
      }
      // Firefox (gecko) needs an add-on id for AMO + a data-collection declaration (we collect none).
      if (wxt.config.browser === 'firefox') {
        manifest.browser_specific_settings = {
          ...manifest.browser_specific_settings,
          gecko: {
            ...manifest.browser_specific_settings?.gecko,
            id: 'aichatfloat@franklybuilds',
            data_collection_permissions: { required: ['none'] },
          },
        };
      }
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
