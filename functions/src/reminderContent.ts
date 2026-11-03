// Pure parts of the exchange reminders: which days send one and what the
// email says. No Firebase here, so the root tests can import this file.

export type ReminderLanguage = 'pl' | 'en';

// Days before the exchange on which a reminder goes out.
export const REMINDER_OFFSETS = [7, 1] as const;
export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

const TIME_ZONE = 'Europe/Warsaw';

// 'YYYY-MM-DD' of the calendar day `now` falls on in Poland.
export const warsawDay = (now: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

export const addDays = (day: string, days: number): string => {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date + days))
    .toISOString()
    .slice(0, 10);
};

// The eventDate values whose reminder is due today, by offset.
export const dueEventDates = (
  now: Date,
): { offset: ReminderOffset; eventDate: string }[] => {
  const today = warsawDay(now);
  return REMINDER_OFFSETS.map((offset) => ({
    offset,
    eventDate: addDays(today, offset),
  }));
};

export type ReminderDraw = {
  drawName: string;
  eventDate: string;
  eventPlace?: string;
  budget: number;
  currency: string;
};

const longDate = (day: string, language: ReminderLanguage): string => {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date)).toLocaleDateString(
    language === 'pl' ? 'pl' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' },
  );
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export type ReminderEmail = { subject: string; text: string; html: string };

// The email never says whom the reader gives a gift to: it only points to the
// draw page, where the envelope is.
export const buildReminderEmail = (
  draw: ReminderDraw,
  offset: ReminderOffset,
  language: ReminderLanguage,
  link: string,
): ReminderEmail => {
  const date = longDate(draw.eventDate, language);
  const budget = `${draw.budget} ${draw.currency}`;
  const pl = language === 'pl';

  const when =
    offset === 1
      ? pl
        ? 'jutro'
        : 'tomorrow'
      : pl
        ? 'za tydzień'
        : 'in a week';
  const subject = pl
    ? `Secret Santa „${draw.drawName}”: wymiana prezentów ${when}`
    : `Secret Santa “${draw.drawName}”: gift exchange ${when}`;

  const lines = pl
    ? [
        `Cześć! Wymiana prezentów w losowaniu „${draw.drawName}” już ${when}.`,
        `Kiedy: ${date}`,
        ...(draw.eventPlace ? [`Gdzie: ${draw.eventPlace}`] : []),
        `Budżet: ${budget}`,
        offset === 1
          ? 'Jeśli prezent czeka, wystarczy go zapakować. Jeśli jeszcze nie, to ostatni dzwonek.'
          : 'Masz jeszcze czas na zakupy. List osoby, którą obdarowujesz, znajdziesz w kopercie w aplikacji.',
        `Losowanie i Twoja koperta: ${link}`,
        '',
        'Dostajesz tę wiadomość, bo włączyłeś(-aś) przypomnienia mailowe w tym losowaniu. Wyłączysz je w aplikacji, na stronie losowania. Nie wysyłamy nic poza tym.',
      ]
    : [
        `Hi! The gift exchange for “${draw.drawName}” is ${when}.`,
        `When: ${date}`,
        ...(draw.eventPlace ? [`Where: ${draw.eventPlace}`] : []),
        `Budget: ${budget}`,
        offset === 1
          ? 'If the gift is ready, all that is left is to wrap it. If not, this is the last call.'
          : 'There is still time to shop. The letter of the person you give a gift to is in your envelope in the app.',
        `The draw and your envelope: ${link}`,
        '',
        'You get this because you turned on email reminders for this draw. You can turn them off in the app, on the draw page. We send nothing else.',
      ];

  const text = lines.join('\n');
  const html = lines
    .map((line) =>
      line === ''
        ? ''
        : line.endsWith(link)
          ? `<p>${escapeHtml(line.slice(0, -link.length))}<a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>`
          : `<p>${escapeHtml(line)}</p>`,
    )
    .join('\n');

  return { subject, text, html };
};
