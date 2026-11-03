// Pure parts of the sign-in email (F18, D47): the link, the text, the checks
// on the request. No Firebase here, so the root tests can import this file.
import { Mail } from './mailer';

export type LoginLanguage = 'pl' | 'en';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 254 && EMAIL.test(value);

export const toLanguage = (value: unknown): LoginLanguage =>
  value === 'en' ? 'en' : 'pl';

// The app's own addresses a sign-in link may point to. The caller supplies
// the address, so an open list would let anyone send mail that links
// to their site.
const APP_ORIGIN = 'https://arturczopek.github.io';
const APP_PATH = '/santa-app-v2/';

export const isAllowedAppUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.search || url.hash) return false;
  if (url.origin === APP_ORIGIN) return url.pathname === APP_PATH;
  // Local development and the emulators.
  return (
    url.protocol === 'http:' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
  );
};

// Firebase's link points to its own handler on `<project>.firebaseapp.com`,
// which then redirects to the app. A mail whose link leads straight to the
// app looks less like phishing and is shorter. The app reads the same
// parameters (apiKey, oobCode, mode) Firebase would have put on its address.
export const toAppLink = (
  firebaseLink: string,
  appUrl: string,
  language: LoginLanguage,
): string => {
  const source = new URL(firebaseLink).searchParams;
  const apiKey = source.get('apiKey');
  const oobCode = source.get('oobCode');
  if (!apiKey || !oobCode) {
    throw new Error('The sign-in link has no code.');
  }
  const link = new URL(appUrl);
  link.searchParams.set('apiKey', apiKey);
  link.searchParams.set('oobCode', oobCode);
  link.searchParams.set('mode', 'signIn');
  link.searchParams.set('lang', language);
  return link.toString();
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const TEXTS = {
  pl: {
    subject: 'Twój link do logowania w Santa App',
    greeting: 'Cześć!',
    intro: 'Kliknij przycisk, żeby zalogować się w Santa App:',
    button: 'Zaloguj się',
    fallback: 'Jeśli przycisk nie działa, wklej ten adres w przeglądarce:',
    expires: 'Link działa przez godzinę i tylko raz.',
    ignore:
      'Nie prosiłeś(-aś) o logowanie? Zignoruj tę wiadomość, nic się nie stanie.',
  },
  en: {
    subject: 'Your Santa App sign-in link',
    greeting: 'Hi!',
    intro: 'Click the button to sign in to Santa App:',
    button: 'Sign in',
    fallback:
      'If the button does not work, paste this address in your browser:',
    expires: 'The link works for one hour and only once.',
    ignore: 'Did not ask to sign in? Ignore this message, nothing will happen.',
  },
} as const;

export const buildLoginMail = (
  to: string,
  link: string,
  language: LoginLanguage,
): Mail => {
  const t = TEXTS[language];
  const safeLink = escapeHtml(link);
  const text = [
    t.greeting,
    '',
    t.intro,
    link,
    '',
    t.expires,
    t.ignore,
    '',
    'Santa App',
  ].join('\n');
  const html = `<!doctype html>
<html lang="${language}">
  <body style="margin:0;padding:24px;background:#f6f1ea;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;">
      <h1 style="margin:0 0 16px;font-size:20px;">🎅 Santa App</h1>
      <p style="margin:0 0 8px;">${t.greeting}</p>
      <p style="margin:0 0 20px;">${t.intro}</p>
      <p style="margin:0 0 24px;">
        <a href="${safeLink}" style="display:inline-block;background:#c62828;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">${t.button}</a>
      </p>
      <p style="margin:0 0 4px;font-size:13px;color:#666666;">${t.fallback}</p>
      <p style="margin:0 0 20px;font-size:13px;word-break:break-all;"><a href="${safeLink}" style="color:#666666;">${safeLink}</a></p>
      <p style="margin:0 0 4px;font-size:13px;color:#666666;">${t.expires}</p>
      <p style="margin:0;font-size:13px;color:#666666;">${t.ignore}</p>
    </div>
  </body>
</html>`;
  return { to, subject: t.subject, text, html };
};
