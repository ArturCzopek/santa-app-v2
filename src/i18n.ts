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
      navbar: {
        title: 'Santa App',
        checkApp: 'Check the app',
        showSanta: 'Show Santa!',
        leaveMessage: 'Leave a message!'
      },
      drawsPage: {
        title: 'All Draws'
      }
    },
  },
  pl: {
    translation: {
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Zaloguj przez Google',
        by: 'stworzona przez Artur Czopek',
      },
      navbar: {
        title: 'Santa App',
        checkApp: 'Sprawdź aplikację',
        showSanta: 'Pokaż Mikołaja!',
        leaveMessage: 'Zostaw wiadomość!'
      },
      drawsPage: {
        title: 'Wszystkie Losowania'
      }
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