import { Browser, expect, Page } from '@playwright/test';

const PROJECT_ID = 'demo-santa-app';

export const clearFirestore = async () => {
  const response = await fetch(
    `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  );
  expect(response.ok).toBe(true);
};

declare global {
  interface Window {
    __santaTest: { signIn: (sub: string, name: string) => Promise<string> };
  }
}

export type TestUser = { page: Page; name: string };

// A separate browser context per person, signed in through the emulator.
export const signedInUser = async (
  browser: Browser,
  sub: string,
  name: string,
  contextOptions: Parameters<Browser['newContext']>[0] = {},
): Promise<TestUser> => {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForFunction(() => window.__santaTest !== undefined);
  await page.evaluate(([s, n]) => window.__santaTest.signIn(s, n), [sub, name]);
  await expect(
    page.getByRole('heading', { name: 'Twoje losowania' }),
  ).toBeVisible();
  return { page, name };
};

// Opens a draw from the list, the way people do it.
export const openDraw = async (page: Page, drawName: string) => {
  const backButton = page.getByRole('button', { name: 'Powrót do losowań' });
  if (await backButton.isVisible()) await backButton.click();
  await expect(
    page.getByRole('heading', { name: 'Twoje losowania' }),
  ).toBeVisible();
  await page.getByRole('link', { name: new RegExp(drawName) }).click();
  await expect(page.getByRole('heading', { name: drawName })).toBeVisible();
};
