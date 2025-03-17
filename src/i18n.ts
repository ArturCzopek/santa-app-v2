import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        backToDraws: 'Back to Draws',
        cancel: 'Cancel',
        submitting: 'Submitting...',
        saving: 'Saving...',
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
        password: 'Password',
        passwordHint:
          'Remember the password! You must share it with others so they can join the draw. There is no option to change or view the password later.',
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
          passwordRequired: 'Password is required',
          passwordTooShort: 'Password must be at least 4 characters',
        },
      },
      drawPage: {
        title: 'Draw',
        startDrawButton: 'Start Draw',
        wishSection: {
          title: 'Your Wish',
          wishLabel: 'Wish',
          wishPlaceholder: 'Enter your wish here...',
          editButton: 'Edit Wish',
          saveButton: 'Save Wish',
          saveSuccess: 'Your wish has been saved successfully!',
          noWishWarning:
            "You haven't provided your wish yet! Do it before the draw takes place.",
        },
        participantsSection: {
          title: 'Participants',
          owner: 'Owner',
          participant: 'Participant',
          wishProvided: 'Wish Provided',
          noWish: 'No Wish',
        },
        errors: {
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          drawNotFound: "Draw not found or you don't have access to it.",
          wishUpdateFailed: 'Failed to update your wish. Please try again.',
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
        totalDrawsPrompt:
          'and be a participant in one of {{count}} draws that already exist in the app.',
        errors: {
          fetchFailed: 'Failed to fetch draws. Please try again.',
        },
      },
      drawCard: {
        waitingStatus: 'Waiting for Draw',
        drawedStatus: 'Drawn',
        participants: 'Participants: {{count}}',
        noWish: "You haven't provided your wish yet! Go to draw to add it.",
        checkResults:
          'The draw has been completed. Go to draw to check your results!',
        viewDetails: 'View details',
        budget: 'Budget: {{budget}} {{currency}}',
        drawDate: 'Draw date: {{drawDate}}',
      },
    },
  },
  pl: {
    translation: {
      common: {
        cancel: 'Anuluj',
        backToDraws: 'Powrót do Losowań',
        submitting: 'Wysyłanie...',
        saving: 'Zapisywanie...',
      },
      createPage: {
        success:
          'Stworzono losowanie. Nie zapomnij o wpisaniu życzenia dla mikołaja!',
        title: 'Stwórz Nowe Losowanie',
        drawName: 'Nazwa Losowania',
        description: 'Opis',
        budget: 'Budżet',
        currency: 'Waluta',
        createButton: 'Stwórz Losowanie',
        password: 'Hasło',
        passwordHint:
          'Zapamiętaj hasło! Musisz je podać innym osobom, aby mogły dołączyć do losowania. Nie ma opcji zmiany ani podglądnięcia hasła później.',
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
          passwordRequired: 'Hasło jest wymagane',
          passwordTooShort: 'Hasło musi mieć przynajmniej 4 znaki',
        },
      },
      loginPage: {
        title: 'Santa App 2.0',
        loginWithGoogle: 'Zaloguj przez Google',
      },
      drawPage: {
        title: 'Losowanie',
        startDrawButton: 'Rozpocznij Losowanie',
        wishSection: {
          title: 'Twoje Życzenie',
          wishLabel: 'Życzenie',
          wishPlaceholder: 'Wpisz swoje życzenie tutaj...',
          editButton: 'Edytuj życzenie',
          saveButton: 'Zapisz życzenie',
          saveSuccess: 'Twoje życzenie zostało zapisane pomyślnie!',
          noWishWarning:
            'Nie podałeś jeszcze swojego życzenia! Zrób to, zanim losowanie się odbędzie.',
        },
        participantsSection: {
          title: 'Uczestnicy',
          owner: 'Założyciel',
          participant: 'Uczestnik',
          wishProvided: 'Życzenie dodane',
          noWish: 'Brak życzeń',
        },
        errors: {
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          drawNotFound:
            'Losowanie nie zostało znalezione lub nie masz do niego dostępu.',
          wishUpdateFailed:
            'Nie udało się zaktualizować twojego życzenia. Spróbuj ponownie.',
        },
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
        totalDrawsPrompt:
          'i bądź uczestnikiem jednego z {{count}} losowań istniejących już w aplikacji.',
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
        noWish:
          'Nie podałeś jeszcze swojego życzenia! Przejdź do losowania, aby je dodać.',
        checkResults:
          'Losowanie zostało zakończone. Przejdź do losowania, aby sprawdzić swój wynik!',
        viewDetails: 'Zobacz szczegóły',
        budget: 'Budżet: {{budget}} {{currency}}',
        drawDate: 'Data losowania: {{drawDate}}',
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
