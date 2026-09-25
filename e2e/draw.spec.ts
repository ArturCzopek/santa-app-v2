import { expect, Page, test } from '@playwright/test';
import {
  clearFirestore,
  expectNoHorizontalScroll,
  guest,
  openDraw,
  signedInUser,
  signInHere,
  TestUser,
} from './helpers';

test.beforeEach(async () => {
  await clearFirestore();
});

// The result section, once its envelope is open.
const openResult = async (page: Page) => {
  const result = page
    .getByRole('heading', { name: 'Twój wynik losowania' })
    .locator('xpath=..');
  const envelope = result.getByRole('button', {
    name: 'Otwórz kopertę z wynikiem losowania',
  });
  const letter = result.getByText('Kupujesz prezent dla');
  // The result loads after the page; the envelope stays open once opened.
  await expect(envelope.or(letter)).toBeVisible();
  if (await envelope.isVisible()) await envelope.click();
  await expect(letter).toBeVisible();
  return result;
};

const writeLetter = async (page: Page, wish: string) => {
  await page.getByLabel('Co chcesz dostać?').fill(wish);
  await page.getByRole('button', { name: 'Zapisz list' }).click();
  await expect(page.getByText(/List zapisany/)).toBeVisible();
};

test('a whole Secret Santa: create, invite, join, letters, draw, results', async ({
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

  // Owner creates the draw.
  const owner = await signedInUser(
    browser,
    'owner',
    'Olga Owner',
    contextOptions,
  );
  await expectNoHorizontalScroll(owner.page);
  await owner.page
    .getByRole('button', { name: 'Stwórz nowe losowanie' })
    .click();
  await owner.page.getByLabel('Nazwa losowania').fill('Wigilia E2E');
  await owner.page.getByLabel('Opis').fill('Prezenty do 80 zł');
  await owner.page.getByLabel('Budżet').fill('80');
  await owner.page.getByLabel('Hasło do rozpoczęcia losowania').fill('abc12');
  await owner.page.getByRole('button', { name: 'Stwórz losowanie' }).click();
  await expect(owner.page.getByText(/przynajmniej 6 znaków/)).toBeVisible();
  await expectNoHorizontalScroll(owner.page);
  await owner.page.getByLabel('Hasło do rozpoczęcia losowania').fill('sekret1');
  await owner.page.getByRole('button', { name: 'Stwórz losowanie' }).click();
  await owner.page.waitForURL(/#\/draw\//, { timeout: 10_000 });
  const drawId = owner.page.url().split('/draw/')[1];

  // The invite opens by itself; its link carries a key instead of the password.
  const invite = owner.page.getByRole('dialog', { name: 'Wyślij zaproszenie' });
  await expect(invite).toContainText('?k=');
  await expect(invite).toContainText('Budżet na prezent: 80 PLN');
  await expect(invite).not.toContainText('sekret1');
  const inviteLink = (await invite.innerText()).match(/\S*#\/join\/\S+/)![0];
  await invite.getByRole('button', { name: 'Zamknij' }).click();

  // The owner is a participant too and lands in the letter editor.
  await writeLetter(owner.page, 'Książka o górach');
  await expectNoHorizontalScroll(owner.page);

  // One person joins with the bare link and the password, trying a wrong one first.
  const alice = await signedInUser(
    browser,
    'alice',
    'Ania Test',
    contextOptions,
  );
  await alice.page.goto(`/#/join/${drawId}`);
  await expect(alice.page.getByText('Od: Olga Owner')).toBeVisible();
  await alice.page.getByLabel('Hasło do losowania').fill('zlehaslo');
  await alice.page.getByRole('button', { name: 'Dołącz do losowania' }).click();
  await expect(alice.page.getByText(/Nieprawidłowe hasło/)).toBeVisible();
  await alice.page.getByLabel('Hasło do losowania').fill('sekret1');
  await alice.page.getByRole('button', { name: 'Dołącz do losowania' }).click();
  await alice.page.waitForURL(/#\/draw\//, { timeout: 10_000 });
  await writeLetter(alice.page, 'Skarpetki');

  // The other opens the invite link before signing in, stays on the invite
  // and joins without the password.
  const bobPage = await guest(browser, contextOptions);
  await bobPage.goto(inviteLink);
  await expect(
    bobPage.getByRole('button', { name: /Zaloguj przez Google/ }),
  ).toBeVisible();
  await expectNoHorizontalScroll(bobPage);
  await signInHere(bobPage, 'bob', 'Bartek Test');
  await expect(bobPage.getByText('Od: Olga Owner')).toBeVisible();
  await expect(bobPage.getByLabel('Hasło do losowania')).toHaveCount(0);
  await bobPage.getByRole('button', { name: 'Dołącz do losowania' }).click();
  await bobPage.waitForURL(/#\/draw\//, { timeout: 10_000 });
  await expect(
    bobPage.getByRole('button', { name: 'Zapisz list' }),
  ).toBeVisible();
  const bob: TestUser = { page: bobPage, name: 'Bartek Test' };

  // Owner sees who wrote a letter and starts the draw.
  await openDraw(owner.page, 'Wigilia E2E');
  await expect(owner.page.getByText('Napisane listy: 2 z 3')).toBeVisible();
  await expect(owner.page.getByText('Bartek Test')).toBeVisible();
  await expectNoHorizontalScroll(owner.page);
  await owner.page
    .getByRole('button', { name: 'Rozpocznij losowanie' })
    .click();
  const dialog = owner.page.getByRole('dialog');
  await dialog.getByLabel('Hasło do rozpoczęcia losowania').fill('zlehaslo');
  await dialog.getByRole('button', { name: 'Losuj' }).click();
  await expect(dialog.getByText('Nieprawidłowe hasło')).toBeVisible();
  await dialog.getByLabel('Hasło do rozpoczęcia losowania').fill('sekret1');
  await dialog.getByRole('button', { name: 'Losuj' }).click();
  // A ready message for the group: the envelopes are here.
  const done = owner.page.getByRole('dialog', {
    name: 'Gotowe! Pary wylosowane',
  });
  await expect(done.getByText('Koperty już czekają!')).toBeVisible();
  await expectNoHorizontalScroll(owner.page);
  await done.getByRole('button', { name: 'Zamknij' }).click();
  await expect(
    owner.page.getByRole('heading', { name: 'Twój wynik losowania' }),
  ).toBeVisible();
  // Participants are still there, folded away under their heading.
  const participants = owner.page.getByRole('button', {
    name: 'Uczestnicy (3)',
  });
  await expect(participants).toHaveAttribute('aria-expanded', 'false');
  await participants.click();
  await expect(owner.page.getByText('Bartek Test').last()).toBeVisible();
  await expect(owner.page.getByText('Ania Test').last()).toBeVisible();

  // Everybody sees exactly one other person, and the whole thing is a valid draw.
  const everyone = [owner, alice, bob];
  const recipients = new Map<string, string>();
  for (const person of everyone) {
    await openDraw(person.page, 'Wigilia E2E');
    const result = await openResult(person.page);
    await expectNoHorizontalScroll(person.page);
    const text = await result.innerText();
    const shown = everyone.map((p) => p.name).filter((n) => text.includes(n));
    expect(shown).toHaveLength(1);
    expect(shown[0]).not.toBe(person.name);
    recipients.set(person.name, shown[0]);
  }
  expect(new Set(recipients.values()).size).toBe(3);

  // Letters travel with the result.
  const ownerSanta = [...recipients].find(([, to]) => to === 'Olga Owner')![0];
  const santaPage = everyone.find((p) => p.name === ownerSanta)!.page;
  await expect(await openResult(santaPage)).toContainText('Książka o górach');
});

const createDraw = async (page: Page, name: string) => {
  await page.getByRole('button', { name: 'Stwórz nowe losowanie' }).click();
  await page.getByLabel('Nazwa losowania').fill(name);
  await page.getByLabel('Hasło do rozpoczęcia losowania').fill('sekret1');
  await page.getByRole('button', { name: 'Stwórz losowanie' }).click();
  await page.waitForURL(/#\/draw\//, { timeout: 10_000 });
  await page
    .getByRole('dialog', { name: 'Wyślij zaproszenie' })
    .getByRole('button', { name: 'Zamknij' })
    .click();
  return page.url().split('/draw/')[1];
};

// Only the draw page has this section (the list also shows the draw name).
const letterHeading = (page: Page) =>
  page.getByRole('heading', { name: 'Twój list do Mikołaja' });

test('reloading a draw page keeps you on it, without the invite', async ({
  browser,
}) => {
  const owner = await signedInUser(browser, 'owner', 'Olga Owner');
  await createDraw(owner.page, 'Reload test');

  await owner.page.reload();
  await expect(letterHeading(owner.page)).toBeVisible({ timeout: 5_000 });
  await expect(owner.page).toHaveURL(/#\/draw\//);
  await expect(owner.page.getByRole('dialog')).toHaveCount(0);
});

test('a draw link opened before signing in leads to the draw afterwards', async ({
  browser,
}) => {
  const owner = await signedInUser(browser, 'owner', 'Olga Owner');
  const drawId = await createDraw(owner.page, 'Link test');

  const page = await guest(browser);
  await page.goto(`/#/draw/${drawId}`);
  await expect(
    page.getByRole('button', { name: /Zaloguj przez Google/ }),
  ).toBeVisible();
  await signInHere(page, 'owner', 'Olga Owner');

  await expect(letterHeading(page)).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#/draw/${drawId}$`));
});

test('the join page fits the phone screen without horizontal scrolling', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');

  await page.goto('/#/join/some-draw');
  await expect(page.getByText(/Musisz się zalogować/)).toBeVisible();
  await expectNoHorizontalScroll(page);
});
