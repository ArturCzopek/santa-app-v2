import { useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

// Custom hook to manage Firebase authentication
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    // Sign in with Google
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Save user info here if needed
            setUser(user);
        } catch (error) {
            console.error('Error signing in with Google: ', error);
        }
    };

    // Listen for changes in user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        signInWithGoogle,
    };
};
