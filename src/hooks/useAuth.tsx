import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth } from '../services/FirebaseConfig';
import {
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useNotify } from './useNotify';

interface AuthContextValue {
  user: User | null;
  // True until Firebase has restored the session from the previous visit.
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  // Accounts from an email link have no name; the rules read it from the
  // token, so the token is refreshed straight away.
  setDisplayName: (name: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Closing the Google window is the person's own choice, not an error.
const CANCELLED = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

// One listener for the whole app; every useAuth() reads the same state.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // The user object changes in place; this re-renders everyone reading it.
  const [, setProfileVersion] = useState(0);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }),
    [],
  );

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      const code = (error as AuthError).code;
      if (CANCELLED.includes(code)) return;
      console.error('Error signing in with Google: ', error);
      notify(
        t(
          code === 'auth/popup-blocked'
            ? 'loginPage.errors.popupBlocked'
            : 'loginPage.errors.signInFailed',
        ),
      );
    }
  };

  const setDisplayName = async (name: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    await auth.currentUser.getIdToken(true);
    setProfileVersion((version) => version + 1);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, setDisplayName, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};
