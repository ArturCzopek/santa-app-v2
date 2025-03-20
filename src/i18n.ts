import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        backToDraws: 'Back to Draws',
        cancel: 'Cancel',
        close: 'Close',
        joining: 'Joining...',
        saving: 'Saving...',
        submitting: 'Submitting...',
      },
      createPage: {
        budget: 'Budget',
        createButton: 'Create Draw',
        currency: 'Currency',
        description: 'Description',
        drawName: 'Draw Name',
        joinButton: 'Join to Draw',
        password: 'Password',
        passwordHint:
          'Remember the password! You must share it with others so they can join the draw. There is no option to change or view the password later.',
        success: 'Created new draw. Do not forget about your wish for Santa!',
        title: 'Create New Draw',
        validation: {
          budgetMustBeNumber: 'Budget must be a number',
          budgetPositive: 'Budget must be greater than 0',
          budgetRequired: 'Budget is required',
          currencyRequired: 'Currency is required',
          currencyTooLong: 'Currency must be less than 30 characters',
          descriptionRequired: 'Description is required',
          descriptionTooLong: 'Description must be less than 1000 characters',
          drawNameRequired: 'Draw name is required',
          drawNameTooLong: 'Draw name must be less than 200 characters',
          passwordRequired: 'Password is required',
          passwordTooShort: 'Password must be at least 4 characters',
        },
      },
      drawCard: {
        budget: 'Budget: {{budget}} {{currency}}',
        checkResults:
          'The draw has been completed. Go to draw to check your results!',
        drawDate: 'Draw date: {{drawDate}}',
        drawedStatus: 'Drawn',
        noWish: "You haven't provided your wish yet! Go to draw to add it.",
        participants: 'Participants: {{count}}',
        viewDetails: 'View details',
        waitingStatus: 'Waiting for Draw',
      },
      drawPage: {
        drawSuccessMessage: 'Draw completed successfully!',
        errors: {
          drawNotFound: "Draw not found or you don't have access to it.",
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          wishUpdateFailed: 'Failed to update your wish. Please try again.',
        },
        inviteButton: 'Invite to Draw',
        inviteModal: {
          drawCode: 'Draw Code',
          descriptionPart1:
            'To invite someone to the draw, copy and send the link below or provide the draw code which may be provided on the main page:',
          descriptionPart2:
            'Remember to also provide the password you set when creating the draw!',
          linkCopied: 'Link copied to clipboard!',
        },
        participantsSection: {
          noWish: 'No Wish',
          owner: 'Owner',
          participant: 'Participant',
          title: 'Participants',
          wishProvided: 'Wish Provided',
        },
        startDraw: {
          confirmationText:
            'Are you sure you want to draw pairs? This action is irreversible.\nTo confirm the draw, enter the password created when the draw was set up.',
          drawButton: 'Draw',
          incorrectPassword: 'Incorrect password',
        },
        startDrawButton: 'Start Draw',
        title: 'Draw',
        winnerSection: {
          noWishProvided: 'No wish provided',
          title: 'Your Gift Recipient',
        },
        wishSection: {
          editButton: 'Edit Wish',
          noWishWarning:
            "You haven't provided your wish yet! Do it before the draw takes place.",
          saveButton: 'Save Wish',
          saveSuccess: 'Your wish has been saved successfully!',
          title: 'Your Wish',
          wishLabel: 'Wish',
          wishPlaceholder: 'Enter your wish here...',
        },
      },
      drawsPage: {
        createButton: 'Create New Draw',
        createOwn: 'create your own',
        errors: {
          fetchFailed: 'Failed to fetch draws. Please try again.',
        },
        joinButton: 'Join Draw',
        joinModal: {
          codeRequired: 'Draw code is required',
          description: 'Enter the draw code shared by the draw creator.',
          drawCodeLabel: 'Draw Code',
          proceedButton: 'Proceed to Draw',
        },
        noDraws:
          'You are not participating in any draws at the moment. Ask a friend to share a draw with you or',
        title: 'Your Draws',
        totalDrawsPrompt:
          'and be a participant in one of {{count}} draws that already exist in the app and one of {{winnersCount}} winners!',
        totalDrawsPromptWithData:
          'Have fun and be a participant in one of {{count}} draws and one of {{winnersCount}} winners!',
      },
      joinPage: {
        alreadyParticipating: 'You are already participating in this draw',
        createdBy: 'Created by {{name}}',
        errors: {
          drawAlreadyStarted:
            'This draw has already been started and cannot be joined.',
          drawNotFound: 'Draw not found or it may have been deleted.',
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          invalidPassword: 'Invalid password. Please try again.',
          joinFailed: 'Failed to join the draw. Please try again.',
          loginRequired: 'You need to log in to join this draw',
          passwordRequired: 'Password is required to join the draw',
        },
        joinButton: 'Join Draw',
        passwordLabel: 'Provide a password to join to draw',
        passwordPlaceholder: 'Enter the draw password',
        success:
          'You have successfully joined the draw! Redirecting to the draw page...',
        title: 'Join Draw',
        viewDraw: 'View Draw',
      },
      loginPage: {
        loginWithGoogle: 'Login with Google',
        title: 'Santa App 2.0',
      },
      messages: {
        alreadySentToday: "You've already sent a message today. You can send another message tomorrow.",
        description: "Do you have any feedback? Is something not working? Or maybe you just want to get in touch? This is a good place, you can type and send me a message. I promise to reply :)",
        messageLabel: "Message",
        send: "Send",
        sendError: "Error sending message. Please try again.",
        sendSuccess: "Message sent successfully!"
      },
      navbar: {
        checkApp: 'Check the app',
        leaveMessage: 'Leave a message!',
        showSanta: 'Show Santa!',
        title: 'Santa App',
      },
    },
  },
  pl: {
    translation: {
      common: {
        backToDraws: 'Powrót do Losowań',
        cancel: 'Anuluj',
        close: 'Zamknij',
        joining: 'Dołączanie...',
        saving: 'Zapisywanie...',
        submitting: 'Wysyłanie...',
      },
      createPage: {
        budget: 'Budżet',
        createButton: 'Stwórz Losowanie',
        currency: 'Waluta',
        description: 'Opis',
        drawName: 'Nazwa Losowania',
        password: 'Hasło',
        passwordHint:
          'Zapamiętaj hasło! Musisz je podać innym osobom, aby mogły dołączyć do losowania. Nie ma opcji zmiany ani podglądnięcia hasła później.',
        success:
          'Stworzono losowanie. Nie zapomnij o wpisaniu życzenia dla mikołaja!',
        title: 'Stwórz Nowe Losowanie',
        validation: {
          budgetMustBeNumber: 'Budżet musi być liczbą',
          budgetPositive: 'Budżet musi być większy niż 0',
          budgetRequired: 'Budżet jest wymagany',
          currencyRequired: 'Waluta jest wymagana',
          currencyTooLong: 'Waluta nie może przekraczać 30 znaków',
          descriptionRequired: 'Opis jest wymagany',
          descriptionTooLong: 'Opis nie może przekraczać 1000 znaków',
          drawNameRequired: 'Nazwa losowania jest wymagana',
          drawNameTooLong: 'Nazwa losowania nie może przekraczać 200 znaków',
          passwordRequired: 'Hasło jest wymagane',
          passwordTooShort: 'Hasło musi mieć przynajmniej 4 znaki',
        },
      },
      drawCard: {
        budget: 'Budżet: {{budget}} {{currency}}',
        checkResults:
          'Losowanie zostało zakończone. Przejdź do losowania, aby sprawdzić swój wynik!',
        drawDate: 'Data losowania: {{drawDate}}',
        drawedStatus: 'Rozlosowane',
        noWish:
          'Nie podałeś jeszcze swojego życzenia! Przejdź do losowania, aby je dodać.',
        participants: 'Uczestnicy: {{count}}',
        viewDetails: 'Zobacz szczegóły',
        waitingStatus: 'Oczekuje na losowanie',
      },
      drawPage: {
        drawSuccessMessage: 'Losowanie zakończone sukcesem!',
        errors: {
          drawNotFound:
            'Losowanie nie zostało znalezione lub nie masz do niego dostępu.',
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          wishUpdateFailed:
            'Nie udało się zaktualizować twojego życzenia. Spróbuj ponownie.',
        },
        inviteButton: 'Zaproś do losowania',
        inviteModal: {
          drawCode: 'Kod losowania',
          descriptionPart1:
            'Aby zaprosić osobę do losowania, skopiuj i wyślij link poniżej lub podaj kod losowania, który może być podany na głównej stronie:',
          descriptionPart2:
            'Pamiętaj, aby podać również hasło, które ustawiłeś podczas tworzenia losowania!',
          linkCopied: 'Link skopiowany do schowka!',
        },
        participantsSection: {
          noWish: 'Brak życzenia',
          owner: 'Założyciel',
          participant: 'Uczestnik',
          title: 'Uczestnicy',
          wishProvided: 'Życzenie dodane',
        },
        startDraw: {
          confirmationText:
            'Czy na pewno chcesz wylosować pary? Od tej akcji nie będzie odwrotu.\nAby potwierdzić losowanie, podaj hasło, które zostało utworzone na początku tworzenia losowania.',
          drawButton: 'Losuj',
          incorrectPassword: 'Nieprawidłowe hasło',
        },
        startDrawButton: 'Rozpocznij Losowanie',
        title: 'Losowanie',
        winnerSection: {
          noWishProvided: 'Brak życzenia',
          title: 'Twój Los',
        },
        wishSection: {
          editButton: 'Edytuj życzenie',
          noWishWarning:
            'Nie podałeś jeszcze swojego życzenia! Zrób to, zanim losowanie się odbędzie.',
          saveButton: 'Zapisz życzenie',
          saveSuccess: 'Twoje życzenie zostało zapisane pomyślnie!',
          title: 'Twoje Życzenie',
          wishLabel: 'Życzenie',
          wishPlaceholder: 'Wpisz swoje życzenie tutaj...',
        },
      },
      drawsPage: {
        createButton: 'Stwórz nowe losowanie',
        createOwn: 'stwórz własne',
        errors: {
          fetchFailed: 'Nie udało się pobrać losowań. Spróbuj ponownie.',
        },
        joinButton: 'Dołącz do losowania',
        joinModal: {
          codeRequired: 'Kod losowania jest wymagany',
          description:
            'Podaj kod losowania udostępniony Ci przez założyciela losowania.',
          drawCodeLabel: 'Kod losowania',
          proceedButton: 'Przejdź do losowania',
        },
        noDraws:
          'Obecnie nie uczestniczysz w żadnym losowaniu. Poproś znajomego o udostępnienie losowania lub',
        title: 'Twoje Losowania',
        totalDrawsPrompt:
          'i bądź uczestnikiem jednego z {{count}} losowań istniejących już w aplikacji oraz bądź jednym z {{winnersCount}} rozlosowanych osób!',
        totalDrawsPromptWithData:
          'Dołącz do zabawy i bądź uczestnikiem jednego z {{count}} losowań oraz bądź jednym z {{winnersCount}} rozlosowanych osób!',
      },
      joinPage: {
        alreadyParticipating: 'Już uczestniczysz w tym losowaniu',
        createdBy: 'Utworzone przez {{name}}',
        errors: {
          drawAlreadyStarted:
            'To losowanie już się rozpoczęło i nie można do niego dołączyć.',
          drawNotFound:
            'Losowanie nie zostało znalezione lub mogło zostać usunięte.',
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          invalidPassword: 'Nieprawidłowe hasło. Spróbuj ponownie.',
          joinFailed: 'Nie udało się dołączyć do losowania. Spróbuj ponownie.',
          loginRequired: 'Musisz się zalogować, aby dołączyć do tego losowania',
          passwordRequired: 'Hasło jest wymagane aby dołączyć do losowania',
        },
        joinButton: 'Dołącz do Losowania',
        passwordLabel: 'Podaj hasło, aby dołączyć do losowania',
        passwordPlaceholder: 'Wprowadź hasło do losowania',
        success:
          'Pomyślnie dołączyłeś do losowania! Przekierowywanie do strony losowania...',
        title: 'Dołącz do Losowania',
        viewDraw: 'Zobacz Losowanie',
      },
      loginPage: {
        loginWithGoogle: 'Zaloguj przez Google',
        title: 'Santa App 2.0',
      },
      messages: {
        alreadySentToday: "Wysłałeś już wiadomość dzisiaj. Możesz wysłać kolejną wiadomość jutro.",
        description: "Masz jakiś feedback? Coś nie działa? A może po prostu chcesz się skontaktować? To jest dobre miejsce, możesz wpisać i wysłać do mnie wiadomość. Obiecuję, że odpiszę :)",
        messageLabel: "Wiadomość",
        send: "Wyślij",
        sendError: "Błąd podczas wysyłania wiadomości. Spróbuj ponownie.",
        sendSuccess: "Wiadomość wysłana pomyślnie!"
      },
      navbar: {
        checkApp: 'Sprawdź aplikację',
        leaveMessage: 'Zostaw wiadomość!',
        showSanta: 'Pokaż Mikołaja!',
        title: 'Santa App',
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
