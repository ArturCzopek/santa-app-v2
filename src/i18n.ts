import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        cancel: 'Cancel',
        submitting: 'Submitting...',
      },
      createPage: {
        success: 'Created new draw. Do not forget about your wish for Santa!',
        title: 'Create New Draw',
        drawName: 'Draw Name',
        description: 'Description',
        budget: 'Budget',
        currency: 'Currency',
        createButton: 'Create Draw',
        joinButton: 'Join to Draw',
        validation: {
          drawNameRequired: 'Draw name is required',
          drawNameTooLong: 'Draw name must be less than 200 characters',
          descriptionRequired: 'Description is required',
          descriptionTooLong: 'Description must be less than 1000 characters',
          budgetRequired: 'Budget is required',
          budgetMustBeNumber: 'Budget must be a number',
          budgetPositive: 'Budget must be greater than 0',
          currencyRequired: 'Currency is required',
          currencyTooLong: 'Currency must be less than 30 characters',
        },
      },
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Login with Google',
      },
      navbar: {
        title: 'Santa App',
        checkApp: 'Check the app',
        showSanta: 'Show Santa!',
        leaveMessage: 'Leave a message!',
      },
      drawsPage: {
        title: 'Your Draws',
        noDraws:
          'You are not participating in any draws at the moment. Ask a friend to share a draw with you or',
        createOwn: 'create your own',
        createButton: 'Create New Draw',
        totalDrawsPrompt: 'and be a participant in one of {{count}} draws that already exist in the app.',
        errors: {
          fetchFailed: 'Failed to fetch draws. Please try again.',
        },
      },
      drawCard: {
        waitingStatus: 'Waiting for Draw',
        drawedStatus: 'Drawn',
        participants: 'Participants: {{count}}',
        noWish: 'You haven\'t provided your wish yet! Go to draw to add it.',
        checkResults: 'The draw has been completed. Go to draw to check your results!',
        viewDetails: 'View details'
      }
    },
  },
  pl: {
    translation: {
      common: {
        cancel: 'Anuluj',
        submitting: 'Wysyłanie...',
      },
      createPage: {
        success: 'Stworzono losowanie. Nie zapomnij o wpisaniu życzenia dla mikołaja!',
        title: 'Stwórz Nowe Losowanie',
        drawName: 'Nazwa Losowania',
        description: 'Opis',
        budget: 'Budżet',
        currency: 'Waluta',
        createButton: 'Stwórz Losowanie',
        validation: {
          drawNameRequired: 'Nazwa losowania jest wymagana',
          drawNameTooLong: 'Nazwa losowania nie może przekraczać 200 znaków',
          descriptionRequired: 'Opis jest wymagany',
          descriptionTooLong: 'Opis nie może przekraczać 1000 znaków',
          budgetRequired: 'Budżet jest wymagany',
          budgetMustBeNumber: 'Budżet musi być liczbą',
          budgetPositive: 'Budżet musi być większy niż 0',
          currencyRequired: 'Waluta jest wymagana',
          currencyTooLong: 'Waluta nie może przekraczać 30 znaków',
        },
      },
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Zaloguj przez Google',
      },
      navbar: {
        title: 'Santa App',
        checkApp: 'Sprawdź aplikację',
        showSanta: 'Pokaż Mikołaja!',
        leaveMessage: 'Zostaw wiadomość!',
      },
      drawsPage: {
        title: 'Twoje Losowania',
        noDraws:
          'Obecnie nie uczestniczysz w żadnym losowaniu. Poproś znajomego o udostępnienie losowania lub',
        createOwn: 'stwórz własne',
        totalDrawsPrompt: 'i bądź uczestnikiem jednego z {{count}} losowań istniejących już w aplikacji.',
        createButton: 'Stwórz nowe losowanie',
        joinButton: 'Dołącz do losowania',
        errors: {
          fetchFailed: 'Nie udało się pobrać losowań. Spróbuj ponownie.',
        },
      },
      drawCard: {
        waitingStatus: 'Oczekuje na losowanie',
        drawedStatus: 'Rozlosowane',
        participants: 'Uczestnicy: {{count}}',
        noWish: 'Nie podałeś jeszcze swojego życzenia! Przejdź do losowania, aby je dodać.',
        checkResults: 'Losowanie zostało zakończone. Przejdź do losowania, aby sprawdzić swój wynik!',
        viewDetails: 'Zobacz szczegóły'
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
