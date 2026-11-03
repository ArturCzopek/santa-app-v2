import { describe, expect, it } from 'vitest';
import {
  buildLoginMail,
  isAllowedAppUrl,
  isValidEmail,
  toAppLink,
} from '../../functions/src/loginMail';

const APP = 'https://arturczopek.github.io/santa-app-v2/';

describe('login mail checks', () => {
  it('accepts only the app and local addresses as the link target', () => {
    expect(isAllowedAppUrl(APP)).toBe(true);
    expect(isAllowedAppUrl('http://localhost:5173/santa-app-v2/')).toBe(true);
    expect(isAllowedAppUrl('http://127.0.0.1:5173/')).toBe(true);
    expect(isAllowedAppUrl('https://evil.example/santa-app-v2/')).toBe(false);
    expect(isAllowedAppUrl('https://arturczopek.github.io/other/')).toBe(false);
    expect(isAllowedAppUrl(`${APP}?x=1`)).toBe(false);
    expect(isAllowedAppUrl('http://arturczopek.github.io/santa-app-v2/')).toBe(
      false,
    );
    expect(isAllowedAppUrl('http://localhost.evil.example/')).toBe(false);
    expect(isAllowedAppUrl(undefined)).toBe(false);
  });

  it('validates the address', () => {
    expect(isValidEmail('ania@example.com')).toBe(true);
    expect(isValidEmail('ania')).toBe(false);
    expect(isValidEmail('a b@example.com')).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false);
  });
});

describe('toAppLink', () => {
  const firebase =
    'https://proj.firebaseapp.com/__/auth/action?apiKey=KEY&mode=signIn&oobCode=CODE&continueUrl=x&lang=en';

  it('points straight at the app with the parameters the app reads', () => {
    const link = new URL(toAppLink(firebase, APP, 'pl'));
    expect(link.origin + link.pathname).toBe(APP);
    expect(Object.fromEntries(link.searchParams)).toEqual({
      apiKey: 'KEY',
      oobCode: 'CODE',
      mode: 'signIn',
      lang: 'pl',
    });
  });

  it('refuses a link without a code', () => {
    expect(() =>
      toAppLink('https://proj.firebaseapp.com/__/auth/action', APP, 'pl'),
    ).toThrow();
  });
});

describe('buildLoginMail', () => {
  const link = `${APP}?apiKey=K&oobCode=C&mode=signIn&lang=pl`;

  it('is in Polish with the link in text and html', () => {
    const mail = buildLoginMail('ania@example.com', link, 'pl');
    expect(mail.to).toBe('ania@example.com');
    expect(mail.subject).toBe('Twój link do logowania w Santa App');
    expect(mail.text).toContain(link);
    expect(mail.html).toContain('lang="pl"');
    expect(mail.html).toContain('Zaloguj się');
  });

  it('is in English and escapes the link in html', () => {
    const mail = buildLoginMail('a@example.com', link, 'en');
    expect(mail.subject).toBe('Your Santa App sign-in link');
    expect(mail.html).toContain('apiKey=K&amp;oobCode=C');
    expect(mail.html).not.toContain('apiKey=K&oobCode');
  });
});
