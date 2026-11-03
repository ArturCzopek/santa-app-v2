// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  isSignInWithEmailLink: vi.fn(),
  sendSignInLinkToEmail: vi.fn(),
  signInWithEmailLink: vi.fn(),
}));
vi.mock('firebase/functions', () => ({ httpsCallable: vi.fn() }));
vi.mock('../../src/services/FirebaseConfig', () => ({
  auth: {},
  functions: {},
}));
vi.mock('../../src/i18n', () => ({ default: { language: 'pl' } }));

import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  finishLoginLink,
  pendingLoginEmail,
  sendLoginLink,
  TooManyLinksError,
} from '../../src/services/emailLink';

const callable = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  callable.mockResolvedValue({ data: { sent: true } });
  vi.mocked(httpsCallable).mockReturnValue(callable as never);
  localStorage.clear();
  window.history.replaceState(null, '', '/santa-app-v2/');
});

describe('email link sign-in', () => {
  it('asks our function to send the link and remembers where to return', async () => {
    window.history.replaceState(null, '', '/santa-app-v2/#/join/d1?k=key');
    await sendLoginLink('ania@example.com', '/join/d1?k=key');

    expect(httpsCallable).toHaveBeenCalledWith({}, 'sendLoginLink');
    expect(callable).toHaveBeenCalledWith({
      email: 'ania@example.com',
      url: `${window.location.origin}/santa-app-v2/`,
      lang: 'pl',
    });
    expect(sendSignInLinkToEmail).not.toHaveBeenCalled();
    expect(pendingLoginEmail()).toBe('ania@example.com');
  });

  it('falls back to the Firebase mail when our function fails', async () => {
    callable.mockRejectedValue({ code: 'functions/unavailable' });
    await sendLoginLink('ania@example.com', '/draws');

    expect(sendSignInLinkToEmail).toHaveBeenCalledWith(
      { languageCode: 'pl' },
      'ania@example.com',
      {
        url: `${window.location.origin}/santa-app-v2/`,
        handleCodeInApp: true,
      },
    );
    expect(pendingLoginEmail()).toBe('ania@example.com');
  });

  it('also falls back when the daily limit of our mailer is spent', async () => {
    callable.mockRejectedValue({
      code: 'functions/resource-exhausted',
      message: 'global',
    });
    await sendLoginLink('ania@example.com', '/draws');
    expect(sendSignInLinkToEmail).toHaveBeenCalled();
  });

  it('does not send another mail to an address that just got several', async () => {
    callable.mockRejectedValue({
      code: 'functions/resource-exhausted',
      message: 'address',
    });
    await expect(
      sendLoginLink('ania@example.com', '/draws'),
    ).rejects.toBeInstanceOf(TooManyLinksError);
    expect(sendSignInLinkToEmail).not.toHaveBeenCalled();
    expect(pendingLoginEmail()).toBe('');
  });

  it('signs in, forgets the address and clears the code from the address bar', async () => {
    await sendLoginLink('ania@example.com', '/join/d1?k=key');
    window.history.replaceState(
      null,
      '',
      '/santa-app-v2/?mode=signIn&oobCode=abc&apiKey=x',
    );

    expect(await finishLoginLink('ania@example.com')).toBe('/join/d1?k=key');
    expect(signInWithEmailLink).toHaveBeenCalledWith(
      expect.anything(),
      'ania@example.com',
      `${window.location.origin}/santa-app-v2/?mode=signIn&oobCode=abc&apiKey=x`,
    );
    expect(window.location.search).toBe('');
    expect(pendingLoginEmail()).toBe('');
  });

  it('goes to the draws when the link was asked for in another browser', async () => {
    expect(await finishLoginLink('ania@example.com')).toBe('/draws');
  });
});
