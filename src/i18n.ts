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
        descriptionHint: 'For example gift ideas or your own rules.',
        drawName: 'Draw name',
        eventDate: 'Gift exchange date (optional)',
        eventPlace: 'Place (optional)',
        eventPlaceHint: 'E.g. at grandma’s, 6 pm.',
        errors: {
          createFailed: 'Failed to create the draw. Please try again.',
        },
        lead: 'Set the name, the budget and the password you will start the draw with. Then invite everyone else.',
        password: 'Password to start the draw',
        passwordHint:
          'At least 6 characters. People without the invite link can also join with it.',
        passwordNote:
          'Write the password down! You need it to start the draw, and it cannot be viewed or changed later.',
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
          eventDateInPast: 'Pick today or a later date',
          eventDateInvalid: 'Pick a date from the calendar',
          eventPlaceTooLong: 'Place can have at most 200 characters',
          passwordRequired: 'Password is required',
          passwordTooShort: 'Password must be at least 6 characters',
        },
      },
      drawCard: {
        budget: 'Budget: {{budget}} {{currency}}',
        checkResults: 'The draw took place – open your envelope to see who you buy for.',
        envelopeOpened: 'Envelope opened. Look again whenever you want to reread the letter.',
        drawDate: 'Draw date: {{drawDate}}',
        drawedStatus: 'Drawn',
        noWish: 'You have not written your letter to Santa yet.',
        participants: 'Participants: {{count}}',
        viewDetails: 'Open',
        waitingStatus: 'Waiting for Draw',
      },
      drawPage: {
        drawnOn: 'Drawn on {{date}}',
        drawDone: {
          copied: 'Message copied. Paste it in your chat.',
          copyMessage: 'Copy message',
          description: 'Let everyone know they can open their envelopes now.',
          message: {
            done: 'The draw "{{name}}" has taken place!',
            open: 'Open your envelope to see who you buy a gift for: {{link}}',
            secret: 'Shh… keep your result to yourself.',
          },
          notifyButton: 'Let everyone know',
          postcardTitle: 'The envelopes are here!',
          title: 'Done! The pairs are drawn',
        },
        status: {
          ownerNeedsPeople:
            'Invite the others – the draw needs at least two people.',
          ownerReady: 'All letters are written – you can start the draw.',
          ownerWaitingLetters:
            'Letters written: {{done}} of {{total}}. You can start the draw now or wait for the rest.',
          participant:
            '{{owner}} will start the draw once everyone has joined. Then come back here for your envelope.',
        },
        errors: {
          accessDenied: "Access denied. You are not a participant in this draw.",
          drawNotFound: "Draw not found or you don't have access to it.",
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          redirecting: "You will be redirected to your draws in a few seconds.",
          startDrawFailed:
            'Failed to start the draw. Refresh the page and try again.',
          wishUpdateFailed: 'Failed to update your wish. Please try again.',
        },
        delete: {
          confirm: 'Delete',
          done: 'The draw is deleted.',
          failed: 'Could not delete the draw. Please try again.',
          text: 'Delete "{{name}}"? Everyone’s letters go with it. This cannot be undone.',
          title: 'Delete the draw?',
        },
        edit: {
          save: 'Save changes',
          saveFailed: 'Could not save the changes. Please try again.',
          saved: 'Changes saved.',
          title: 'Edit the draw',
        },
        options: {
          delete: 'Delete the draw',
          edit: 'Edit the draw',
          leave: 'Leave the draw',
          more: 'More',
        },
        leave: {
          confirm: 'Leave',
          done: 'You left the draw.',
          failed: 'Could not leave the draw. Please try again.',
          text: 'Leave "{{name}}"? Your letter to Santa will be deleted. You can join again with the invite link.',
          title: 'Leave the draw?',
        },
        exclusions: {
          add: 'Add the pair',
          alreadyThere: 'This pair is already on the list.',
          explanation:
            'People in a pair will not draw each other – e.g. a couple who buy presents together anyway.',
          first: 'Person',
          impossibleRemoveMore:
            'With these exclusions the draw is impossible. Remove a few pairs.',
          impossibleRemoveOne:
            'With these exclusions the draw is impossible. Remove one of these pairs: {{pairs}}.',
          pickTwo: 'Pick two different people.',
          remove: 'Remove the pair {{pair}}',
          saveFailed: 'Could not save the exclusions. Please try again.',
          second: 'Does not draw',
          title: 'Exclusions ({{count}})',
          wouldBeImpossible:
            'With this pair the draw would be impossible – too few people are left to draw.',
        },
        inviteButton: 'Invite to Draw',
        inviteModal: {
          copyLink: 'Copy link',
          copyMessage: 'Copy invite',
          description: 'Send the invite to everyone, e.g. in your group chat.',
          linkCopied: 'Link copied.',
          message: {
            budget: 'Gift budget: {{budget}} {{currency}}.',
            event: 'Gift exchange: {{when}}.',
            greeting: 'Join our Secret Santa "{{name}}"!',
            howToJoin:
              'Open the link, sign in with Google and write your letter to Santa.',
            howToJoinWithPassword:
              'Sign in with Google, type the password and write your letter to Santa.',
            link: 'Draw link: {{link}}',
            passwordSeparately: 'I will send you the password separately.',
          },
          messageCopied: 'Invite copied. Paste it in your chat.',
          keyWarning:
            'The link lets people in without the password – send it only to the people in the draw.',
          passwordNotIncluded:
            'The password is not in the invite (we do not keep it). Send it separately.',
          passwordReminder:
            'Keep your password safe – you need it to start the draw once everyone has joined.',
          postcardTitle: 'Greetings from Santa!',
          renewButton: 'Yes, make a new link',
          renewConfirm:
            'The current link will stop working. People who already joined stay in the draw.',
          renewFailed: 'Could not make a new link. Please try again.',
          renewLink: 'Link got to the wrong people? Make a new one',
          renewed: 'New link ready. The old one no longer works.',
          share: 'Share',
          titleAfterCreate: 'Send the invite',
        },
        organizer: 'Organizer: {{name}}',
        participantsSection: {
          noWish: 'No letter yet',
          owner: 'Organizer',
          participant: 'Participant',
          lettersProgress: 'Letters written: {{done}} of {{total}}',
          title: 'Participants ({{count}})',
          wishProvided: 'Letter ready',
          you: '(you)',
        },
        startDraw: {
          allExclusionsSet: 'Are these all the pairs who should not draw each other?',
          editExclusions: 'Change the exclusions',
          exclusions: 'Exclusions: {{pairs}}.',
          noExclusions: 'No exclusions – everyone is in the hat for everyone.',
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
          openEnvelope: 'Open the envelope with your draw result',
          sealedTo: 'To: {{name}}',
          tapToOpen: 'Tap to open',
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
          linkExpired:
            'This link no longer works – the organizer made a new one. Type the password or ask for the new link.',
          joinFailed: 'Failed to join the draw. Please try again.',
          loginRequired: 'You need to log in to join this draw',
          passwordRequired: 'Password is required to join the draw',
        },
        joinButton: 'Join Draw',
        loginRequired: 'Someone invites you to a Secret Santa. You need to sign in to see the details and join.',
        passwordHint: 'You get the password from the organizer.',
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
          copyFailedSelect:
            'Could not copy. Select the address in the field below and copy it.',
          copyLink: 'Copy link',
          googleMayFail:
            'Inside Messenger or Instagram signing in with Google usually fails. Open the page in your browser first.',
          linkCopied: 'Link copied. Paste it into your browser.',
          linkLabel: 'Address of this page',
          or: 'or',
          step1: 'Tap the menu in the corner of the screen:',
          step2: 'Choose "Open in browser" (or "Open in Chrome" / "in Safari").',
          step3: 'No such option? Copy the link and paste it into your browser.',
          title: 'Open this page in your browser',
          why: 'It is open inside another app (e.g. Messenger or Instagram), and Google does not allow signing in there.',
        },
        googleNote: 'All you need is a Google account. We use your name and photo so others know who joined.',
        privacyLink: 'How we use your data.',
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
      event: {
        date: 'Gift exchange:',
        place: 'Place:',
      },
      footer: {
        privacy: 'Privacy policy',
        sourceCode: 'Source code on GitHub',
      },
      navbar: {
        accountMenu: 'Account menu: {{name}}',
        leaveMessage: 'Leave a message!',
        logout: 'Log out',
        showSanta: 'Show Santa!',
        title: 'Santa App',
      },
      privacy: {
        title: 'Privacy policy',
        updated: 'Last updated {{date}}',
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
        descriptionHint: 'Na przykład pomysły na upominki albo wasze zasady.',
        drawName: 'Nazwa losowania',
        eventDate: 'Data wręczenia prezentów (opcjonalnie)',
        eventPlace: 'Miejsce (opcjonalnie)',
        eventPlaceHint: 'Np. u babci Krysi, godz. 18:00.',
        errors: {
          createFailed: 'Nie udało się utworzyć losowania. Spróbuj ponownie.',
        },
        lead: 'Ustal nazwę, budżet i hasło, którym rozpoczniesz losowanie. Potem zaprosisz pozostałe osoby.',
        password: 'Hasło do rozpoczęcia losowania',
        passwordHint:
          'Co najmniej 6 znaków. Osoby bez linku z zaproszenia też dołączą tym hasłem.',
        passwordNote:
          'Zapisz hasło! Bez niego nie rozpoczniesz losowania, a później nie da się go podejrzeć ani zmienić.',
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
          eventDateInPast: 'Wybierz dzisiejszą albo późniejszą datę',
          eventDateInvalid: 'Wybierz datę z kalendarza',
          eventPlaceTooLong: 'Miejsce może mieć najwyżej 200 znaków',
          passwordRequired: 'Hasło jest wymagane',
          passwordTooShort: 'Hasło musi mieć przynajmniej 6 znaków',
        },
      },
      drawCard: {
        budget: 'Budżet: {{budget}} {{currency}}',
        checkResults: 'Losowanie się odbyło – otwórz kopertę i sprawdź, komu kupujesz prezent.',
        envelopeOpened: 'Koperta otwarta. Zajrzyj, jeśli chcesz jeszcze raz przeczytać list.',
        drawDate: 'Data losowania: {{drawDate}}',
        drawedStatus: 'Rozlosowane',
        noWish: 'Nie masz jeszcze listu do Mikołaja.',
        participants: 'Uczestnicy: {{count}}',
        viewDetails: 'Otwórz',
        waitingStatus: 'Oczekuje na losowanie',
      },
      drawPage: {
        drawnOn: 'Rozlosowano {{date}}',
        drawDone: {
          copied: 'Wiadomość skopiowana. Wklej ją na czacie.',
          copyMessage: 'Kopiuj wiadomość',
          description: 'Daj znać wszystkim, że mogą już otworzyć swoje koperty.',
          message: {
            done: 'Losowanie „{{name}}” już się odbyło!',
            open: 'Otwórz swoją kopertę i sprawdź, komu kupujesz prezent: {{link}}',
            secret: 'Ciii… wynik zostaw dla siebie.',
          },
          notifyButton: 'Daj znać wszystkim',
          postcardTitle: 'Koperty już czekają!',
          title: 'Gotowe! Pary wylosowane',
        },
        status: {
          ownerNeedsPeople:
            'Zaproś pozostałe osoby – losować można, gdy są co najmniej dwie.',
          ownerReady: 'Wszystkie listy gotowe – możesz rozpocząć losowanie.',
          ownerWaitingLetters:
            'Napisane listy: {{done}} z {{total}}. Możesz rozpocząć losowanie już teraz albo poczekać na resztę.',
          participant:
            '{{owner}} rozpocznie losowanie, gdy wszyscy dołączą. Wtedy zajrzyj tu po swoją kopertę.',
        },
        errors: {
          accessDenied: "Odmowa dostępu. Nie jesteś uczestnikiem tego losowania.",
          drawNotFound:
            'Losowanie nie zostało znalezione lub nie masz do niego dostępu.',
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          redirecting: 'Za kilka sekund wrócisz do listy swoich losowań.',
          startDrawFailed:
            'Nie udało się przeprowadzić losowania. Odśwież stronę i spróbuj ponownie.',
          wishUpdateFailed: 'Nie udało się zapisać listu. Spróbuj ponownie.',
        },
        delete: {
          confirm: 'Usuń',
          done: 'Losowanie usunięte.',
          failed: 'Nie udało się usunąć losowania. Spróbuj ponownie.',
          text: 'Usunąć „{{name}}”? Znikną też listy wszystkich uczestników. Tego nie da się cofnąć.',
          title: 'Usunąć losowanie?',
        },
        edit: {
          save: 'Zapisz zmiany',
          saveFailed: 'Nie udało się zapisać zmian. Spróbuj ponownie.',
          saved: 'Zmiany zapisane.',
          title: 'Edytuj losowanie',
        },
        options: {
          delete: 'Usuń losowanie',
          edit: 'Edytuj losowanie',
          leave: 'Opuść losowanie',
          more: 'Więcej',
        },
        leave: {
          confirm: 'Opuść',
          done: 'Nie bierzesz już udziału w losowaniu.',
          failed: 'Nie udało się opuścić losowania. Spróbuj ponownie.',
          text: 'Opuścić „{{name}}”? Twój list do Mikołaja zostanie usunięty. Możesz wrócić przez link z zaproszeniem.',
          title: 'Opuścić losowanie?',
        },
        exclusions: {
          add: 'Dodaj parę',
          alreadyThere: 'Ta para już jest na liście.',
          explanation:
            'Osoby w parze nie wylosują siebie nawzajem – np. małżonkowie, którzy i tak kupują sobie prezenty.',
          first: 'Osoba',
          impossibleRemoveMore:
            'Przy tych wykluczeniach losowanie jest niemożliwe. Usuń kilka par.',
          impossibleRemoveOne:
            'Przy tych wykluczeniach losowanie jest niemożliwe. Usuń jedną z tych par: {{pairs}}.',
          pickTwo: 'Wybierz dwie różne osoby.',
          remove: 'Usuń parę {{pair}}',
          saveFailed: 'Nie udało się zapisać wykluczeń. Spróbuj ponownie.',
          second: 'Nie losuje z',
          title: 'Wykluczenia ({{count}})',
          wouldBeImpossible:
            'Z tą parą losowanie byłoby niemożliwe – zostaje za mało osób do wylosowania.',
        },
        inviteButton: 'Zaproś do losowania',
        inviteModal: {
          copyLink: 'Kopiuj link',
          copyMessage: 'Kopiuj zaproszenie',
          description: 'Wyślij zaproszenie wszystkim, np. na grupowym czacie.',
          linkCopied: 'Link skopiowany.',
          message: {
            budget: 'Budżet na prezent: {{budget}} {{currency}}.',
            event: 'Wręczenie prezentów: {{when}}.',
            greeting: 'Dołącz do naszego Tajemniczego Mikołaja „{{name}}”!',
            howToJoin:
              'Otwórz link, zaloguj się kontem Google i napisz list do Mikołaja.',
            howToJoinWithPassword:
              'Zaloguj się kontem Google, wpisz hasło i napisz list do Mikołaja.',
            link: 'Link do losowania: {{link}}',
            passwordSeparately: 'Hasło wyślę ci osobno.',
          },
          messageCopied: 'Zaproszenie skopiowane. Wklej je na czacie.',
          keyWarning:
            'Link wpuszcza do losowania bez hasła – wysyłaj go tylko uczestnikom.',
          passwordNotIncluded:
            'Hasła nie ma w zaproszeniu (nie przechowujemy go). Wyślij je osobno.',
          passwordReminder:
            'Zachowaj hasło – bez niego nie rozpoczniesz losowania, gdy wszyscy dołączą.',
          postcardTitle: 'Pozdrowienia od Mikołaja!',
          renewButton: 'Tak, utwórz nowy link',
          renewConfirm:
            'Obecny link przestanie działać. Osoby, które już dołączyły, zostają w losowaniu.',
          renewFailed: 'Nie udało się utworzyć nowego linku. Spróbuj ponownie.',
          renewLink: 'Link trafił do niewłaściwych osób? Utwórz nowy',
          renewed: 'Nowy link gotowy. Stary już nie działa.',
          share: 'Udostępnij',
          titleAfterCreate: 'Wyślij zaproszenie',
        },
        organizer: 'Organizator: {{name}}',
        participantsSection: {
          noWish: 'Bez listu',
          owner: 'Organizator',
          participant: 'Uczestnik',
          lettersProgress: 'Napisane listy: {{done}} z {{total}}',
          title: 'Uczestnicy ({{count}})',
          wishProvided: 'List gotowy',
          you: '(ty)',
        },
        startDraw: {
          allExclusionsSet: 'Czy to wszystkie pary, które nie powinny się wylosować?',
          editExclusions: 'Zmień wykluczenia',
          exclusions: 'Wykluczenia: {{pairs}}.',
          noExclusions: 'Brak wykluczeń – losujemy spośród wszystkich.',
          confirmationText:
            'Czy na pewno chcesz wylosować pary? Tego nie da się cofnąć.\nAby potwierdzić, wpisz hasło ustalone przy tworzeniu losowania.',
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
          openEnvelope: 'Otwórz kopertę z wynikiem losowania',
          sealedTo: 'Do: {{name}}',
          tapToOpen: 'Stuknij, aby otworzyć',
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
        step2: 'Wszyscy dołączają i piszą listy do Mikołaja: co chcą dostać.',
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
          linkExpired:
            'Ten link już nie działa – organizator utworzył nowy. Wpisz hasło albo poproś o nowy link.',
          joinFailed: 'Nie udało się dołączyć do losowania. Spróbuj ponownie.',
          loginRequired: 'Musisz się zalogować, aby dołączyć do tego losowania',
          passwordRequired: 'Wpisz hasło, żeby dołączyć do losowania',
        },
        loginRequired: 'Ktoś zaprasza cię do Tajemniczego Mikołaja. Musisz się zalogować, żeby zobaczyć szczegóły i dołączyć.',
        joinButton: 'Dołącz do losowania',
        passwordHint: 'Hasło dostajesz od organizatora.',
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
          copyFailedSelect:
            'Nie udało się skopiować. Zaznacz adres w polu poniżej i skopiuj go.',
          copyLink: 'Kopiuj link',
          googleMayFail:
            'W Messengerze i Instagramie logowanie przez Google zwykle się nie udaje. Najpierw otwórz stronę w przeglądarce.',
          linkCopied: 'Link skopiowany. Wklej go w swojej przeglądarce.',
          linkLabel: 'Adres tej strony',
          or: 'lub',
          step1: 'Stuknij menu w rogu ekranu:',
          step2: 'Wybierz „Otwórz w przeglądarce” (albo „Otwórz w Chrome” / „w Safari”).',
          step3: 'Nie ma takiej opcji? Skopiuj link i wklej go w przeglądarce.',
          title: 'Otwórz tę stronę w przeglądarce',
          why: 'Jest otwarta w innej aplikacji (np. Messengerze albo Instagramie), a tam Google nie pozwala się zalogować.',
        },
        googleNote: 'Wystarczy konto Google. Używamy imienia i zdjęcia, żeby inni wiedzieli, kto dołączył.',
        privacyLink: 'Jak używamy danych.',
        lead: 'Jeden link dla całej grupy. Wszyscy piszą listy do Mikołaja, a w dniu losowania otwierają koperty z imieniem osoby, dla której kupują prezent.',
        loginWithGoogle: 'Zaloguj przez Google',
        title: 'Tajemniczy Mikołaj bez karteczek w czapce',
        videoTitle: 'Na rozgrzewkę',
      },
      messages: {
        alreadySentToday:
          'Dzisiejsza wiadomość już do mnie dotarła. Kolejną możesz wysłać jutro.',
        description:
          'Masz jakiś feedback? Coś nie działa? A może po prostu chcesz się skontaktować? To jest dobre miejsce, możesz wpisać i wysłać do mnie wiadomość. Obiecuję, że odpiszę :)',
        messageLabel: 'Wiadomość',
        send: 'Wyślij',
        sendError: 'Błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        sendSuccess: 'Wiadomość wysłana pomyślnie!',
      },
      event: {
        date: 'Wręczenie:',
        place: 'Miejsce:',
      },
      footer: {
        privacy: 'Polityka prywatności',
        sourceCode: 'Kod aplikacji na GitHubie',
      },
      navbar: {
        accountMenu: 'Menu konta: {{name}}',
        leaveMessage: 'Zostaw wiadomość!',
        logout: 'Wyloguj',
        showSanta: 'Pokaż Mikołaja!',
        title: 'Santa App',
      },
      privacy: {
        title: 'Polityka prywatności',
        updated: 'Ostatnia zmiana: {{date}}',
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
