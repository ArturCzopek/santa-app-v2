import { expect, test } from '@playwright/test';
import { clearFirestore, openDraw, signedInUser, TestUser } from './helpers';

test.beforeEach(async () => {
  await clearFirestore();
});

test('a whole Secret Santa: create, invite, join, wishes, draw, results', async ({
  browser,
  browserName,
}, testInfo) => {
  const device = testInfo.project.use;
  const contextOptions = {
    viewport: device.viewport,
    userAgent: device.userAgent,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    deviceScaleFactor: device.deviceScaleFactor,
  };
  test.skip(browserName !== 'chromium');
  test.fixme(
    testInfo.project.name === 'mobile',
    'Mobile M1-M7: the page is wider than the phone, so it is zoomed out and taps miss. Enable when fixing mobile.',
  );

  // Owner creates the draw.
  const owner = await signedInUser(browser, 'owner', 'Olga Owner', contextOptions);
  await owner.page.getByRole('button', { name: 'Stwórz nowe losowanie' }).click();
  await owner.page.getByLabel('Nazwa Losowania').fill('Wigilia E2E');
  await owner.page.getByLabel('Opis').fill('Prezenty do 80 zł');
  await owner.page.getByLabel('Budżet').fill('80');
  await owner.page.getByLabel('Hasło', { exact: true }).fill('abc12');
  await owner.page.getByRole('button', { name: 'Stwórz Losowanie' }).click();
  await expect(owner.page.getByText(/przynajmniej 6 znaków/)).toBeVisible();
  await owner.page.getByLabel('Hasło', { exact: true }).fill('sekret1');
  await owner.page.getByRole('button', { name: 'Stwórz Losowanie' }).click();
  await owner.page.waitForURL(/#\/draw\//, { timeout: 10_000 });
  const drawId = owner.page.url().split('/draw/')[1];

  await owner.page.getByRole('button', { name: 'Edytuj życzenie' }).click();
  await owner.page.getByPlaceholder(/Wpisz swoje życzenie/).fill('Książka o górach');
  await owner.page.getByRole('button', { name: 'Zapisz życzenie' }).click();
  await expect(owner.page.getByText(/zostało zapisane pomyślnie/)).toBeVisible();

  // Two people join with the invite link; the first tries a wrong password.
  const joiners: TestUser[] = [];
  for (const [sub, name] of [
    ['alice', 'Ania Test'],
    ['bob', 'Bartek Test'],
  ]) {
    const joiner = await signedInUser(browser, sub, name, contextOptions);
    await joiner.page.goto(`/#/join/${drawId}`);
    await expect(joiner.page.getByText('Utworzone przez Olga Owner')).toBeVisible();
    if (sub === 'alice') {
      await joiner.page.getByLabel('Hasło', { exact: true }).fill('zlehaslo');
      await joiner.page.getByRole('button', { name: 'Dołącz do Losowania' }).click();
      await expect(joiner.page.getByText(/Nieprawidłowe hasło/)).toBeVisible();
    }
    await joiner.page.getByLabel('Hasło', { exact: true }).fill('sekret1');
    await joiner.page.getByRole('button', { name: 'Dołącz do Losowania' }).click();
    await joiner.page.waitForURL(/#\/draw\//, { timeout: 10_000 });
    await expect(joiner.page.getByText('Olga Owner').last()).toBeVisible();
    joiners.push(joiner);
  }

  await joiners[0].page.getByRole('button', { name: 'Edytuj życzenie' }).click();
  await joiners[0].page.getByPlaceholder(/Wpisz swoje życzenie/).fill('Skarpetki');
  await joiners[0].page.getByRole('button', { name: 'Zapisz życzenie' }).click();
  await expect(joiners[0].page.getByText(/zostało zapisane pomyślnie/)).toBeVisible();

  // Owner starts the draw (refreshing the page to see everyone who joined).
  await openDraw(owner.page, 'Wigilia E2E');
  await expect(owner.page.getByText('Bartek Test')).toBeVisible();
  await owner.page.getByRole('button', { name: 'Rozpocznij Losowanie' }).click();
  const dialog = owner.page.getByRole('dialog');
  await dialog.getByLabel('Hasło', { exact: true }).fill('zlehaslo');
  await dialog.getByRole('button', { name: 'Losuj' }).click();
  await expect(dialog.getByText('Nieprawidłowe hasło')).toBeVisible();
  await dialog.getByLabel('Hasło', { exact: true }).fill('sekret1');
  await dialog.getByRole('button', { name: 'Losuj' }).click();
  await expect(owner.page.getByRole('heading', { name: 'Twój Los' })).toBeVisible();
  // Participants are still listed (the result may show one of them again).
  await expect(owner.page.getByText('Bartek Test').last()).toBeVisible();
  await expect(owner.page.getByText('Ania Test').last()).toBeVisible();

  // Everybody sees exactly one other person, and the whole thing is a valid draw.
  const everyone = [owner, ...joiners];
  const recipients = new Map<string, string>();
  for (const person of everyone) {
    await openDraw(person.page, 'Wigilia E2E');
    const result = person.page
      .getByRole('heading', { name: 'Twój Los' })
      .locator('xpath=..');
    await expect(result).toBeVisible();
    const text = await result.innerText();
    const shown = everyone.map((p) => p.name).filter((n) => text.includes(n));
    expect(shown).toHaveLength(1);
    expect(shown[0]).not.toBe(person.name);
    recipients.set(person.name, shown[0]);
  }
  expect(new Set(recipients.values()).size).toBe(3);

  // Wishes travel with the result.
  const ownerSanta = [...recipients].find(([, to]) => to === 'Olga Owner')![0];
  const santaPage = everyone.find((p) => p.name === ownerSanta)!.page;
  await expect(
    santaPage.getByRole('heading', { name: 'Twój Los' }).locator('xpath=..'),
  ).toContainText('Książka o górach');
});

test('reloading a draw page keeps you on it', async ({ browser }) => {
  test.fail(true, 'Bug B1: protected routes redirect before Firebase restores the session');
  const owner = await signedInUser(browser, 'owner', 'Olga Owner');
  await owner.page.getByRole('button', { name: 'Stwórz nowe losowanie' }).click();
  await owner.page.getByLabel('Nazwa Losowania').fill('Reload test');
  await owner.page.getByLabel('Opis').fill('x');
  await owner.page.getByLabel('Hasło', { exact: true }).fill('sekret1');
  await owner.page.getByRole('button', { name: 'Stwórz Losowanie' }).click();
  await owner.page.waitForURL(/#\/draw\//, { timeout: 10_000 });

  await owner.page.reload();
  // Only the draw page has this section (the list also shows the draw name).
  await expect(owner.page.getByRole('heading', { name: 'Twoje Życzenie' })).toBeVisible({
    timeout: 5_000,
  });
  await expect(owner.page).toHaveURL(/#\/draw\//);
});

test('pages fit the phone screen without horizontal scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  test.fail(true, 'Mobile M1-M7: fixed widths overflow on phones');

  await page.goto('/#/join/some-draw');
  await expect(page.getByText(/Musisz się zalogować/)).toBeVisible();
  // On phones the layout viewport grows to fit wide content, so compare with
  // the device width rather than window.innerWidth.
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
});
