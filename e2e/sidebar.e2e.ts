import { test, expect } from './fixtures';

const PROMPT_TITLE = 'My greeting';
const PROMPT_BODY = 'Hello from AIChatFloat E2E';

test.beforeEach(async ({ page }) => {
  await page.goto('/mock-chatgpt.html');
  // Content script mounts the FAB asynchronously inside the shadow root.
  await expect(page.getByRole('button', { name: 'Open AIChatFloat' })).toBeVisible();
});

test('FAB toggles the panel open and closed', async ({ page }) => {
  const search = page.getByPlaceholder('Search prompts…');
  await expect(search).toBeHidden();
  await page.getByRole('button', { name: 'Open AIChatFloat' }).click();
  await expect(search).toBeVisible();
  // Two buttons share aria-label "Close" (the FAB + the panel ✕); the panel ✕ is last.
  await page.getByRole('button', { name: 'Close' }).last().click();
  await expect(search).toBeHidden();
});

test('inserting a prompt fills the ChatGPT input', async ({ page }) => {
  await page.getByRole('button', { name: 'Open AIChatFloat' }).click();
  await page.getByRole('button', { name: 'Add prompt' }).click();
  await page.getByLabel('Title').fill(PROMPT_TITLE);
  await page.getByLabel('Prompt text').fill(PROMPT_BODY);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Insert' }).click();
  await expect(page.locator('#prompt-textarea')).toHaveText(PROMPT_BODY);
});

test('exporting the conversation triggers a Markdown download', async ({ page }) => {
  await page.getByRole('button', { name: 'Open AIChatFloat' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Markdown' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.md$/);
});
