// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  isSignInWithEmailLink: vi.fn(),
  sendSignInLinkToEmail: vi.fn(),
  signInWithEmailLink: vi.fn(),
}));
vi.mock('../../src/services/FirebaseConfig', () => ({ auth: {} }));

import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import {
  finishLoginLink,
  pendingLoginEmail,
  sendLoginLink,
} from '../../src/services/emailLink';

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/santa-app-v2/');
});

describe('email link sign-in', () => {
  it('sends a link back to the app itself and remembers where to return', async () => {
    window.history.replaceState(null, '', '/santa-app-v2/#/join/d1?k=key');
    await sendLoginLink('ania@example.com', '/join/d1?k=key');

    expect(sendSignInLinkToEmail).toHaveBeenCalledWith({}, 'ania@example.com', {
      url: `${window.location.origin}/santa-app-v2/`,
      handleCodeInApp: true,
    });
    expect(pendingLoginEmail()).toBe('ania@example.com');
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
      {},
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
