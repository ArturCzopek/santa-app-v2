import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Login with Google',
        by: 'by Artur Czopek',
      },
    },
  },
  pl: {
    translation: {
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Zaloguj przez Google',
        by: 'stworzona przez Artur Czopek',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pl', // Default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
