import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
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
  ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    ? {
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      }
    : {}),
};

if (!firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase config (VITE_FIREBASE_*). Locally use npm run dev:emulators, ' +
      'or create .env.staging from .env.staging.example for npm run dev:staging.',
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Local development and tests against the Firebase emulators
// (npm run dev:emulators). Vite drops this block from production builds.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
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

export { auth, db };
