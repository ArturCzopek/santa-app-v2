import { useState, useEffect } from 'react';
import { auth } from '../services/FirebaseConfig';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      redirect_uri: import.meta.env.VITE_APP_URL
    });
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/#/';
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signInWithGoogle,
    logOut,
  };
};
