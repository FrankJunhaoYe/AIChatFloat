# AIChatFloat

English | [中文](./README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![CI](https://github.com/FrankJunhaoYe/AIChatFloat/actions/workflows/ci.yml/badge.svg)](https://github.com/FrankJunhaoYe/AIChatFloat/actions/workflows/ci.yml)

A floating sidebar for **chatgpt.com** that helps you manage prompts and export conversations — entirely in your browser.

## Features

- **Save & manage prompts** — keep a personal library of reusable prompts.
- **Search** prompts instantly.
- **One-click copy** a prompt to the clipboard.
- **One-click insert** a prompt straight into the ChatGPT input box.
- **Export** the current conversation as **Markdown** or **JSON**.
- **Bilingual UI** — English / 中文, switchable in-app (defaults to your browser language).

## Screenshots

<img src="docs/screenshots/panel.png" alt="AIChatFloat panel" width="380" />

Save, search, and manage prompts; one-click copy / insert; export the conversation as Markdown or JSON.

<img src="docs/screenshots/insert-in-context.png" alt="Inserting a prompt into ChatGPT" width="820" />

One click drops a saved prompt straight into the ChatGPT input box.

## Privacy

AIChatFloat is **pure frontend**: no server, no account, no API keys, and it **never calls an AI API**. Your prompts live only in your browser's local storage (`chrome.storage.local`). The "AI" is the ChatGPT page you're already on.

## Install (from source)

> Store listing: _coming soon._

```bash
git clone https://github.com/FrankJunhaoYe/AIChatFloat.git
cd AIChatFloat
npm install
npm run build
```

Then load the unpacked extension:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `.output/chrome-mv3`.
4. Open <https://chatgpt.com> — a floating 💬 button appears at the bottom-right.

## Usage

- Click the **💬** button to open the panel.
- **Add prompt** to save a new prompt; use **Insert** / **Copy** / **Edit** / **Delete** on each.
- Use **Export conversation → Markdown / JSON** to download the current chat.
- Switch language in **Settings**.

## Development

```bash
npm run dev          # WXT dev server (Chrome, hot-reload)
npm run compile      # type-check (tsc --noEmit)
npm run test:run     # unit tests (Vitest)
npm run test:e2e     # Playwright E2E against a local mock page (headed)
npm run build        # production build -> .output/chrome-mv3
npm run zip          # package for store submission
```

## Tech stack

WXT · React 19 · TypeScript · Tailwind CSS v4 · react-i18next · Vitest · Playwright.

## Security

Runtime dependencies (`react`, `react-dom`, `i18next`, `react-i18next`) carry no known advisories (`npm audit --omit=dev`). Any remaining `npm audit` findings are in the dev/build toolchain and are **not** shipped in the packaged extension.

## Project status

This is the free, open-source **v1**. It is intentionally scoped to chatgpt.com with local-only storage. Future paid features (cloud sync, more sites, advanced export) are out of scope here; the architecture only leaves clean seams for them.

## License

[MIT](./LICENSE) © FranklyBuilds
