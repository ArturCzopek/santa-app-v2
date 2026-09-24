import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        backToDraws: 'Back to Draws',
        cancel: 'Cancel',
        close: 'Close',
        hidePassword: 'Hide password',
        joining: 'Joining...',
        loading: 'Loading',
        saving: 'Saving...',
        showPassword: 'Show password',
        submitting: 'Submitting...',
      },
      errorPage: {
        backHome: 'Back to the home page',
        description:
          'Something went wrong on this page. Go back to the home page and try again.',
        title: 'Oops!',
      },
      createPage: {
        budget: 'Budget',
        createButton: 'Create draw',
        currency: 'Currency',
        description: 'Description (optional)',
        descriptionHint: 'For example the date of the gift exchange or what gifts you have in mind.',
        drawName: 'Draw name',
        errors: {
          createFailed: 'Failed to create the draw. Please try again.',
        },
        lead: 'Set the name, budget and password. Then you will invite everyone else.',
        password: 'Password',
        passwordHint:
          'Invited people type it in to join. It cannot be viewed or changed later.',
        success: 'Draw created. Now write your letter to Santa!',
        title: 'New draw',
        validation: {
          budgetMustBeNumber: 'Budget must be a number',
          budgetPositive: 'Budget must be greater than 0',
          budgetRequired: 'Budget is required',
          budgetTooHigh: 'Budget can be at most 1,000,000',
          currencyRequired: 'Currency is required',
          currencyTooLong: 'Currency can have at most 3 characters',
          descriptionTooLong: 'Description can have at most 1000 characters',
          drawNameRequired: 'Draw name is required',
          drawNameTooLong: 'Draw name can have at most 80 characters',
          passwordRequired: 'Password is required',
          passwordTooShort: 'Password must be at least 6 characters',
        },
      },
      drawCard: {
        budget: 'Budget: {{budget}} {{currency}}',
        checkResults: 'The draw took place – open your envelope to see who you buy for.',
        drawDate: 'Draw date: {{drawDate}}',
        drawedStatus: 'Drawn',
        noWish: 'You have not written your letter to Santa yet.',
        participants: 'Participants: {{count}}',
        viewDetails: 'Open',
        waitingStatus: 'Waiting for Draw',
      },
      drawPage: {
        drawSuccessMessage: 'Done! Everyone can now open their envelope.',
        drawnOn: 'Drawn on {{date}}',
        errors: {
          accessDenied: "Access denied. You are not a participant in this draw.",
          drawNotFound: "Draw not found or you don't have access to it.",
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          redirecting: "You will be redirected to your draws in a few seconds.",
          startDrawFailed:
            'Failed to start the draw. Refresh the page and try again.',
          wishUpdateFailed: 'Failed to update your wish. Please try again.',
        },
        inviteButton: 'Invite to Draw',
        inviteModal: {
          copyLink: 'Copy link',
          drawCode: 'Draw Code',
          descriptionPart1:
            'Send this link to the people you want in the draw, e.g. in your group chat.',
          descriptionPart2:
            'They will also need the draw password – send it along with the link.',
          linkCopied: 'Link copied to clipboard!',
          linkLabel: 'Invite link',
        },
        organizer: 'Organizer: {{name}}',
        participantsSection: {
          noWish: 'No letter yet',
          owner: 'Organizer',
          participant: 'Participant',
          title: 'Participants ({{count}})',
          wishProvided: 'Letter ready',
          you: '(you)',
        },
        startDraw: {
          confirmationText:
            'Are you sure you want to draw pairs? This action is irreversible.\nTo confirm the draw, enter the password created when the draw was set up.',
          drawButton: 'Draw',
          incorrectPassword: 'Incorrect password',
          withoutWish_one: '{{names}} has not written a letter yet. Their Santa will have to guess.',
          withoutWish_other: '{{count}} people have not written a letter yet: {{names}}. Their Santas will have to guess.',
        },
        startDrawButton: 'Start Draw',
        title: 'Draw',
        winnerSection: {
          budget: 'Budget: up to {{budget}} {{currency}}',
          keepSecret: 'Shh… it is a secret – do not tell anyone who you drew.',
          noWishProvided: 'No letter yet. Check back later – it may still arrive.',
          theirLetter: '{{name}} writes to Santa:',
          title: 'Your draw result',
          youBuyFor: 'You are buying a gift for',
        },
        wishSection: {
          editButton: 'Edit letter',
          noWishWarning:
            'You have not written your letter yet. Say what you would like – only the person who draws you will read it.',
          salutation: 'Dear Santa,',
          saveButton: 'Save letter',
          saveSuccess: 'Letter saved. Your Santa will read it.',
          title: 'Your letter to Santa',
          wishLabel: 'What would you like to get?',
          wishPlaceholder: 'E.g. warm reindeer socks, a book about mountains… The more specific, the easier.',
          writeButton: 'Write a letter',
        },
      },
      drawsPage: {
        createButton: 'Create New Draw',
        errors: {
          fetchFailed: 'Failed to fetch draws. Please try again.',
        },
        joinButton: 'Join Draw',
        joinModal: {
          codeRequired: 'Draw code is required',
          description: 'Paste the invite link or just the draw code from the organizer.',
          drawCodeLabel: 'Invite link or draw code',
          proceedButton: 'Next',
        },
        emptyTitle: 'No draws yet',
        noDraws:
          'Create your own draw or ask the organizer for the invite link.',
        stats: 'Draws in the app: {{count}} · People with an envelope: {{winnersCount}}',
        title: 'Your Draws',
      },
      howItWorks: {
        step1: 'The organizer creates a draw and sends everyone one link.',
        step2: 'Everyone joins and writes a letter to Santa: what they would like to get.',
        step3: 'The organizer draws the pairs. You open your envelope and see who you are buying a gift for – nobody else does.',
        title: 'How does it work?',
      },
      joinPage: {
        alreadyParticipating: 'You are already participating in this draw',
        createdBy: 'From: {{name}}',
        invitedBy: '{{name}} invites you to a Secret Santa.',
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
        loginRequired: 'Someone invites you to a Secret Santa. You need to sign in to see the details and join.',
        passwordHint: 'You get the password from the organizer along with the link.',
        passwordLabel: 'Draw password',
        passwordPlaceholder: 'Enter the draw password',
        success: 'You are in! Now write your letter to Santa.',
        title: 'Invitation to a draw',
        viewDraw: 'View Draw',
      },
      loginPage: {
        errors: {
          popupBlocked:
            'The browser blocked the sign-in window. Allow pop-ups for this page and try again.',
          signInFailed: 'Failed to sign in. Please try again.',
        },
        inAppBrowser: {
          copyFailed: 'Could not copy the link. Copy this address: {{url}}',
          copyLink: 'Copy link',
          linkCopied: 'Link copied. Paste it into your browser.',
          message:
            'This page is open inside another app (e.g. Messenger or Instagram), where Google does not allow signing in. Open it in your regular browser: tap ⋮ or ⋯ in the corner and choose "Open in browser", or copy the link and paste it there.',
        },
        googleNote: 'All you need is a Google account. We use your name and photo so others know who joined.',
        lead: 'One link for the whole group. Everyone writes a letter to Santa, and on draw day opens an envelope with the name of the person they buy a gift for.',
        loginWithGoogle: 'Login with Google',
        title: 'Secret Santa without paper slips in a hat',
        videoTitle: 'To warm up',
      },
      messages: {
        alreadySentToday:
          "You've already sent a message today. You can send another message tomorrow.",
        description:
          'Do you have any feedback? Is something not working? Or maybe you just want to get in touch? This is a good place, you can type and send me a message. I promise to reply :)',
        messageLabel: 'Message',
        send: 'Send',
        sendError: 'Error sending message. Please try again.',
        sendSuccess: 'Message sent successfully!',
      },
      footer: {
        sourceCode: 'Source code on GitHub',
      },
      navbar: {
        accountMenu: 'Account menu: {{name}}',
        leaveMessage: 'Leave a message!',
        logout: 'Log out',
        showSanta: 'Show Santa!',
        title: 'Santa App',
      },
      santaModal: {
        title: 'Ho, ho, ho!',
      },
    },
  },
  pl: {
    translation: {
      common: {
        backToDraws: 'Powrót do losowań',
        cancel: 'Anuluj',
        close: 'Zamknij',
        hidePassword: 'Ukryj hasło',
        joining: 'Dołączanie...',
        loading: 'Wczytywanie',
        saving: 'Zapisywanie...',
        showPassword: 'Pokaż hasło',
        submitting: 'Wysyłanie...',
      },
      errorPage: {
        backHome: 'Wróć na stronę główną',
        description:
          'Coś poszło nie tak na tej stronie. Wróć na stronę główną i spróbuj ponownie.',
        title: 'Ups!',
      },
      createPage: {
        budget: 'Budżet',
        createButton: 'Stwórz losowanie',
        currency: 'Waluta',
        description: 'Opis (opcjonalnie)',
        descriptionHint: 'Na przykład termin wręczania prezentów albo pomysły na upominki.',
        drawName: 'Nazwa losowania',
        errors: {
          createFailed: 'Nie udało się utworzyć losowania. Spróbuj ponownie.',
        },
        lead: 'Ustal nazwę, budżet i hasło. Potem zaprosisz pozostałe osoby.',
        password: 'Hasło',
        passwordHint:
          'Zaproszone osoby wpiszą je przy dołączaniu. Później nie da się go podejrzeć ani zmienić.',
        success: 'Losowanie utworzone. Teraz napisz swój list do Mikołaja!',
        title: 'Nowe losowanie',
        validation: {
          budgetMustBeNumber: 'Budżet musi być liczbą',
          budgetPositive: 'Budżet musi być większy niż 0',
          budgetRequired: 'Budżet jest wymagany',
          budgetTooHigh: 'Budżet może wynosić najwyżej 1 000 000',
          currencyRequired: 'Waluta jest wymagana',
          currencyTooLong: 'Waluta może mieć najwyżej 3 znaki',
          descriptionTooLong: 'Opis może mieć najwyżej 1000 znaków',
          drawNameRequired: 'Nazwa losowania jest wymagana',
          drawNameTooLong: 'Nazwa losowania może mieć najwyżej 80 znaków',
          passwordRequired: 'Hasło jest wymagane',
          passwordTooShort: 'Hasło musi mieć przynajmniej 6 znaków',
        },
      },
      drawCard: {
        budget: 'Budżet: {{budget}} {{currency}}',
        checkResults: 'Losowanie się odbyło – otwórz kopertę i sprawdź, komu kupujesz prezent.',
        drawDate: 'Data losowania: {{drawDate}}',
        drawedStatus: 'Rozlosowane',
        noWish: 'Nie masz jeszcze listu do Mikołaja.',
        participants: 'Uczestnicy: {{count}}',
        viewDetails: 'Otwórz',
        waitingStatus: 'Oczekuje na losowanie',
      },
      drawPage: {
        drawSuccessMessage: 'Gotowe! Każdy może już otworzyć swoją kopertę.',
        drawnOn: 'Rozlosowano {{date}}',
        errors: {
          accessDenied: "Odmowa dostępu. Nie jesteś uczestnikiem tego losowania.",
          drawNotFound:
            'Losowanie nie zostało znalezione lub nie masz do niego dostępu.',
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          redirecting: "Za kilka sekund zostaniesz przekierowany do swoich losowań.",
          startDrawFailed:
            'Nie udało się przeprowadzić losowania. Odśwież stronę i spróbuj ponownie.',
          wishUpdateFailed:
            'Nie udało się zaktualizować twojego życzenia. Spróbuj ponownie.',
        },
        inviteButton: 'Zaproś do losowania',
        inviteModal: {
          copyLink: 'Kopiuj link',
          drawCode: 'Kod losowania',
          descriptionPart1:
            'Wyślij ten link osobom, które mają wziąć udział – np. na grupowym czacie.',
          descriptionPart2:
            'Będą też potrzebować hasła do losowania – wyślij je razem z linkiem.',
          linkCopied: 'Link skopiowany do schowka!',
          linkLabel: 'Link z zaproszeniem',
        },
        organizer: 'Organizator: {{name}}',
        participantsSection: {
          noWish: 'Bez listu',
          owner: 'Organizator',
          participant: 'Uczestnik',
          title: 'Uczestnicy ({{count}})',
          wishProvided: 'List gotowy',
          you: '(ty)',
        },
        startDraw: {
          confirmationText:
            'Czy na pewno chcesz wylosować pary? Od tej akcji nie będzie odwrotu.\nAby potwierdzić losowanie, podaj hasło, które zostało utworzone na początku tworzenia losowania.',
          drawButton: 'Losuj',
          incorrectPassword: 'Nieprawidłowe hasło',
          withoutWish_one: 'Jedna osoba nie napisała jeszcze listu: {{names}}. Jej Mikołaj będzie musiał zgadywać.',
          withoutWish_few: '{{count}} osoby nie napisały jeszcze listu: {{names}}. Ich Mikołaje będą musieli zgadywać.',
          withoutWish_many: '{{count}} osób nie napisało jeszcze listu: {{names}}. Ich Mikołaje będą musieli zgadywać.',
          withoutWish_other: '{{count}} osoby nie napisały jeszcze listu: {{names}}. Ich Mikołaje będą musieli zgadywać.',
        },
        startDrawButton: 'Rozpocznij losowanie',
        title: 'Losowanie',
        winnerSection: {
          budget: 'Budżet: do {{budget}} {{currency}}',
          keepSecret: 'Ciii… To tajemnica – nie zdradzaj nikomu tego wyniku.',
          noWishProvided: 'Ta osoba nie napisała jeszcze listu. Zajrzyj tu później – może jeszcze dotrzeć.',
          theirLetter: '{{name}} pisze do Mikołaja:',
          title: 'Twój wynik losowania',
          youBuyFor: 'Kupujesz prezent dla',
        },
        wishSection: {
          editButton: 'Edytuj list',
          noWishWarning:
            'Nie masz jeszcze listu do Mikołaja. Napisz, co chcesz dostać – przeczyta go tylko osoba, która cię wylosuje.',
          salutation: 'Drogi Mikołaju,',
          saveButton: 'Zapisz list',
          saveSuccess: 'List zapisany. Twój Mikołaj go przeczyta.',
          title: 'Twój list do Mikołaja',
          wishLabel: 'Co chcesz dostać?',
          wishPlaceholder: 'Np. ciepłe skarpetki w renifery, książka o górach… Im konkretniej, tym łatwiej.',
          writeButton: 'Napisz list',
        },
      },
      drawsPage: {
        createButton: 'Stwórz nowe losowanie',
        errors: {
          fetchFailed: 'Nie udało się pobrać losowań. Spróbuj ponownie.',
        },
        joinButton: 'Dołącz do losowania',
        joinModal: {
          codeRequired: 'Kod losowania jest wymagany',
          description:
            'Wklej link z zaproszeniem albo sam kod losowania od organizatora.',
          drawCodeLabel: 'Link albo kod losowania',
          proceedButton: 'Dalej',
        },
        emptyTitle: 'Nie masz jeszcze żadnego losowania',
        noDraws:
          'Załóż własne losowanie albo poproś organizatora o link z zaproszeniem.',
        stats: 'Losowania w aplikacji: {{count}} · Osoby z kopertą: {{winnersCount}}',
        title: 'Twoje losowania',
      },
      howItWorks: {
        step1: 'Organizator zakłada losowanie i wysyła wszystkim jeden link.',
        step2: 'Każdy dołącza i pisze list do Mikołaja: co chciałby dostać.',
        step3: 'Organizator losuje pary. Otwierasz swoją kopertę i widzisz, komu kupujesz prezent – nikt inny tego nie wie.',
        title: 'Jak to działa?',
      },
      joinPage: {
        alreadyParticipating: 'Już uczestniczysz w tym losowaniu',
        createdBy: 'Od: {{name}}',
        invitedBy: '{{name}} zaprasza cię do Tajemniczego Mikołaja.',
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
        loginRequired: 'Ktoś zaprasza cię do Tajemniczego Mikołaja. Musisz się zalogować, żeby zobaczyć szczegóły i dołączyć.',
        joinButton: 'Dołącz do losowania',
        passwordHint: 'Hasło dostajesz od organizatora razem z linkiem.',
        passwordLabel: 'Hasło do losowania',
        passwordPlaceholder: 'Wprowadź hasło do losowania',
        success: 'Jesteś w losowaniu! Teraz napisz list do Mikołaja.',
        title: 'Zaproszenie do losowania',
        viewDraw: 'Zobacz losowanie',
      },
      loginPage: {
        errors: {
          popupBlocked:
            'Przeglądarka zablokowała okno logowania. Zezwól na wyskakujące okna dla tej strony i spróbuj ponownie.',
          signInFailed: 'Nie udało się zalogować. Spróbuj ponownie.',
        },
        inAppBrowser: {
          copyFailed: 'Nie udało się skopiować linku. Skopiuj ten adres: {{url}}',
          copyLink: 'Skopiuj link',
          linkCopied: 'Skopiowano link. Wklej go w swojej przeglądarce.',
          message:
            'Ta strona jest otwarta w innej aplikacji (np. Messengerze lub Instagramie), a tam Google nie pozwala się zalogować. Otwórz ją w swojej przeglądarce: stuknij ⋮ lub ⋯ w rogu i wybierz „Otwórz w przeglądarce” albo skopiuj link i wklej go tam.',
        },
        googleNote: 'Wystarczy konto Google. Używamy imienia i zdjęcia, żeby inni wiedzieli, kto dołączył.',
        lead: 'Jeden link dla całej grupy. Każdy pisze list do Mikołaja, a w dniu losowania otwiera kopertę z imieniem osoby, której kupuje prezent.',
        loginWithGoogle: 'Zaloguj przez Google',
        title: 'Tajemniczy Mikołaj bez karteczek w czapce',
        videoTitle: 'Na rozgrzewkę',
      },
      messages: {
        alreadySentToday:
          'Wysłałeś już wiadomość dzisiaj. Możesz wysłać kolejną wiadomość jutro.',
        description:
          'Masz jakiś feedback? Coś nie działa? A może po prostu chcesz się skontaktować? To jest dobre miejsce, możesz wpisać i wysłać do mnie wiadomość. Obiecuję, że odpiszę :)',
        messageLabel: 'Wiadomość',
        send: 'Wyślij',
        sendError: 'Błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        sendSuccess: 'Wiadomość wysłana pomyślnie!',
      },
      footer: {
        sourceCode: 'Kod aplikacji na GitHubie',
      },
      navbar: {
        accountMenu: 'Menu konta: {{name}}',
        leaveMessage: 'Zostaw wiadomość!',
        logout: 'Wyloguj',
        showSanta: 'Pokaż Mikołaja!',
        title: 'Santa App',
      },
      santaModal: {
        title: 'Ho, ho, ho!',
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
