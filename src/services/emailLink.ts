import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from './FirebaseConfig';
import { storage } from './storage';

// Signing in with a link from an email (D38). The link comes back to the
// app's own address, without the #/route: Firebase adds its query
// parameters there, and the page to return to waits in this browser.
const KEY = 'santa-app.email-sign-in';

type Pending = { email: string; returnTo: string };

const appUrl = () => window.location.origin + window.location.pathname;

const readPending = (): Pending | null => {
  try {
    const pending = JSON.parse(storage.get(KEY) ?? 'null');
    return typeof pending?.email === 'string' ? pending : null;
  } catch {
    return null;
  }
};

export const sendLoginLink = async (email: string, returnTo: string) => {
  await sendSignInLinkToEmail(auth, email, {
    url: appUrl(),
    handleCodeInApp: true,
  });
  storage.set(KEY, JSON.stringify({ email, returnTo }));
};

export const isLoginLink = () =>
  isSignInWithEmailLink(auth, window.location.href);

// The address the link was sent to, if it was asked for in this browser.
// Opened elsewhere (another device, or out of Messenger into the real
// browser) the person types it again.
export const pendingLoginEmail = () => readPending()?.email ?? '';

// Signs in and gives back the route to continue at.
export const finishLoginLink = async (email: string): Promise<string> => {
  const returnTo = readPending()?.returnTo || '/draws';
  await signInWithEmailLink(auth, email, window.location.href);
  storage.remove(KEY);
  // The one-time code must not stay in the address bar or the history.
  window.history.replaceState(null, '', appUrl());
  return returnTo;
};
