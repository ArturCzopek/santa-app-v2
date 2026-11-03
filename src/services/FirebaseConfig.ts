import { initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase config (VITE_FIREBASE_*). Locally use npm run dev:emulators, ' +
      'or create .env.staging from .env.staging.example for npm run dev:staging.',
  );
}

const app = initializeApp(firebaseConfig);

// App Check (reCAPTCHA Enterprise, D44): proves requests come from the real app.
// Off unless a site key is configured, and never against the emulators (E2E).
// Whether Firebase rejects requests without a token is a separate switch in
// the Firebase console (Firestore) and in the function (ENFORCE_APP_CHECK).
const appCheckSiteKey = import.meta.env.VITE_APP_CHECK_SITE_KEY;
if (appCheckSiteKey && import.meta.env.VITE_USE_EMULATORS !== 'true') {
  if (import.meta.env.DEV && import.meta.env.VITE_APP_CHECK_DEBUG === 'true') {
    // Local run against the dev project: the SDK prints a debug token to
    // register in the Firebase console (App Check -> Manage debug tokens).
    (
      globalThis as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, 'europe-central2');

// Local development and tests against the Firebase emulators
// (npm run dev:emulators). Vite drops this block from production builds.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });

  // E2E tests sign in through this: the Auth emulator accepts unsigned
  // Google tokens, so no popup is needed.
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      __santaTest: {
        signIn: (sub: string, name: string) =>
          signInWithCredential(
            auth,
            GoogleAuthProvider.credential(
              JSON.stringify({
                sub,
                name,
                email: `${sub}@example.com`,
                email_verified: true,
              }),
            ),
          ).then((result) => result.user.uid),
      },
    });
  }
}

export { auth, db, functions };
