import { expect, test } from '@playwright/test';
import { guest } from './helpers';

// The Auth emulator does not send email; it lists the links it would send.
const latestSignInLink = async (email: string) => {
  const response = await fetch(
    'http://127.0.0.1:9099/emulator/v1/projects/demo-santa-app/oobCodes',
  );
  const { oobCodes } = (await response.json()) as {
    oobCodes: { email: string; oobLink: string; requestType: string }[];
  };
  const code = oobCodes
    .filter((c) => c.email === email && c.requestType === 'EMAIL_SIGNIN')
    .at(-1);
  expect(code).toBeDefined();
  // The same parameters Firebase adds to the app's address in a real email.
  const params = new URL(code!.oobLink).searchParams;
  params.delete('continueUrl');
  return `/?${params}`;
};

test('signs in with a link from an email and asks for a name once', async ({
  browser,
}) => {
  const email = `e2e-${Date.now()}@example.com`;
  const page = await guest(browser);
  await page.goto('/');

  await page
    .getByRole('button', {
      name: 'Nie masz konta Google? Zaloguj się e-mailem',
    })
    .click();
  await page.getByLabel('Adres e-mail').fill(email);
  await page.getByRole('button', { name: 'Wyślij link do logowania' }).click();
  await expect(
    page.getByText(`Wysłaliśmy link do logowania na ${email}`),
  ).toBeVisible();

  // Opening the link in the same browser signs in straight away.
  await page.goto(await latestSignInLink(email));
  await expect(
    page.getByRole('heading', { name: 'Jak masz na imię?' }),
  ).toBeVisible();
  // The one-time code is gone from the address bar.
  expect(page.url()).not.toContain('oobCode');

  await page.getByLabel('Twoje imię').fill('Ewa Mailowa');
  await page.getByRole('button', { name: 'Zapisz' }).click();
  await expect(
    page.getByRole('heading', { name: 'Twoje losowania' }),
  ).toBeVisible();

  // The name is on the account, so the next visit goes straight in.
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Twoje losowania' }),
  ).toBeVisible();

  // The rules take the name from the token: creating a draw proves the
  // refreshed token carries it.
  await page.getByRole('button', { name: 'Stwórz nowe losowanie' }).click();
  await page.getByLabel('Nazwa losowania').fill('Losowanie z maila');
  await page.getByLabel('Hasło do rozpoczęcia losowania').fill('sekret1');
  await page.getByRole('button', { name: 'Stwórz losowanie' }).click();
  await page.waitForURL(/#\/draw\//, { timeout: 10_000 });
  await expect(page.getByText('Organizator: Ewa Mailowa')).toBeVisible();
});
