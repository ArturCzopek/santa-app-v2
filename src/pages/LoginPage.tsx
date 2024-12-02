import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { logUsageEvent } from '../services/logging';
import {useTranslation} from 'react-i18next'

const LoginPage = () => {
    const { t } = useTranslation();

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userData = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                uid: user.uid,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            logUsageEvent('login', { userUid: user.uid });
            alert('Login successful!');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-page">
            <h1>Welcome to the Christmas App</h1>
            <button onClick={handleLogin}>{t('login')}</button>
        </div>
    );
};

export default LoginPage;
