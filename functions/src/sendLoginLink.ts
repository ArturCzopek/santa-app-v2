import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { LimitExceeded, takeLoginLinkSlot } from './loginLimits';
import {
  buildLoginMail,
  isAllowedAppUrl,
  isValidEmail,
  toAppLink,
  toLanguage,
} from './loginMail';
import {
  createConfiguredMailer,
  mailPassword,
  mailSecrets,
  mailUser,
} from './mailParams';

// The sign-in mail (F18, D47): the same link Firebase would send, in our own
// wording and with a link straight to the app. Open to people who are not
// signed in yet, hence the limits. When it fails, the app falls back to
// Firebase's own mail, so signing in never depends on this function.
export const sendLoginLink = onCall(
  {
    region: 'europe-central2',
    maxInstances: 5,
    secrets: mailSecrets,
  },
  async (request) => {
    const { email, url, lang } = request.data ?? {};
    if (!isValidEmail(email) || !isAllowedAppUrl(url)) {
      throw new HttpsError('invalid-argument', 'Wrong address or app URL.');
    }
    const language = toLanguage(lang);

    if (!mailUser.value() || !mailPassword.value()) {
      throw new HttpsError('failed-precondition', 'Mail is not configured.');
    }

    try {
      await takeLoginLinkSlot(getFirestore(), email, new Date());
    } catch (error) {
      if (error instanceof LimitExceeded) {
        throw new HttpsError('resource-exhausted', error.scope);
      }
      throw error;
    }

    const firebaseLink = await getAuth().generateSignInWithEmailLink(email, {
      url,
      handleCodeInApp: true,
    });
    const link = toAppLink(firebaseLink, url, language);

    try {
      await createConfiguredMailer()(buildLoginMail(email, link, language));
    } catch (error) {
      console.error('Sending the sign-in mail failed:', error);
      throw new HttpsError('unavailable', 'The mail could not be sent.');
    }
    return { sent: true };
  },
);
