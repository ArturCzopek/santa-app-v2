import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from './services/storage';

const resources = {
  en: {
    translation: {
      common: {
        backHome: 'Back to the home page',
        backToDraws: 'Back to your draws',
        cancel: 'Cancel',
        close: 'Close',
        hidePassword: 'Hide password',
        joining: 'Joining...',
        loading: 'Loading',
        saving: 'Saving...',
        showPassword: 'Show password',
        skipToContent: 'Skip to content',
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
        ownerPlays: 'I take part in the draw',
        ownerPlaysHint:
          'Untick it if you only organize – you will not write a letter and nobody will draw you.',
        errors: {
          createFailed: 'Failed to create the draw. Please try again.',
        },
        lead: 'Set the name, the budget and the password you will start the draw with. Then invite everyone else.',
        password: 'Password to start the draw',
        passwordHint:
          'At least 6 characters. People without the invite link can also join with it.',
        passwordNote:
          'Write the password down! You need it to start the draw. It cannot be viewed later, though you can set a new one (More → Set a new password).',
        success: 'Draw created. Now write your letter to Santa!',
        successNoLetter: 'Draw created.',
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
        checkResults:
          'The draw took place – open your envelope to see who you buy for.',
        envelopeOpened:
          'Envelope opened. Look again whenever you want to reread the letter.',
        drawedStatus: 'Drawn',
        noWish: 'You have not written your letter to Santa yet.',
        participants: 'Participants: {{count}}',
        viewDetails: 'Open',
        waitingStatus: 'Waiting for the draw',
      },
      drawPage: {
        description: { less: 'Show less', more: 'Show the whole description' },
        goToJoin: 'Join this draw',
        drawnOn: 'Drawn on {{date}}',
        ownerNotPlaying:
          'You are not taking part, so you do not write a letter.',
        noEnvelope:
          'The draw has taken place. You are not taking part, so there is no envelope for you.',
        supportCard: {
          heading: 'Thank you for using Santa App! 🎅',
          text: 'The app is free, has no ads, and I build it in my spare time. If you would like to say thanks, you can buy me a coffee ☕',
          button: 'Buy me a coffee',
        },
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
        password: {
          failed: 'Could not save the password. Please try again.',
          forgot: 'Forgot the password? Set a new one',
          hint: 'At least 6 characters. Write it down!',
          label: 'New password',
          menu: 'Set a new password',
          save: 'Save password',
          saved: 'New password saved.',
          text: 'The new password replaces the old one: you need it to start the draw, and people without the invite link join with it. Everyone who joined stays, and the invite link keeps working.',
          title: 'Set a new password',
        },
        status: {
          ownerNeedsPeople:
            'Invite the others – the draw needs at least two people.',
          ownerReady: 'All letters are written – you can start the draw.',
          ownerWaitingLetters:
            'Some letters have not arrived yet. You can start the draw now or wait for the rest.',
          participant:
            '{{owner}} will start the draw once everyone has joined. Then come back here for your envelope.',
        },
        errors: {
          accessDenied:
            'You are not in this draw. If you have an invitation, you can join it.',
          drawNotFound: "Draw not found or you don't have access to it.",
          fetchFailed: 'Failed to fetch draw details. Please try again.',
          startDrawFailed:
            'Failed to start the draw. Refresh the page and try again.',
          wishUpdateFailed: 'Failed to update your wish. Please try again.',
          giftBoughtUpdateFailed:
            'Could not update your gift status. Please try again.',
          thanksSaveFailed: 'Could not send your thanks. Please try again.',
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
        remove: {
          button: 'Remove from the draw: {{name}}',
          confirm: 'Remove',
          done: '{{name}} is no longer in the draw.',
          failed: 'Could not remove this person. Please try again.',
          text: '{{name}} will no longer take part in "{{draw}}", and their letter will be deleted. They can rejoin with the invite link or password. Making a new link in "Invite to the draw" blocks only the old link, not the password. If this person knows the password, set a new one in "More → Set a new password" so they cannot rejoin.',
          title: 'Remove this person from the draw?',
        },
        exclusions: {
          add: 'Add the pair',
          alreadyThere: 'This pair is already on the list.',
          explanation:
            'People in a pair will not draw each other – e.g. a couple who buy presents together anyway.',
          first: 'First person',
          impossibleRemoveMore:
            'With these pairs the draw is impossible. Remove a few of them.',
          impossibleRemoveOne:
            'With these pairs the draw is impossible. Remove one of them: {{pairs}}.',
          pickTwo: 'Pick two different people.',
          remove: 'Remove the pair {{pair}}',
          saveFailed: 'Could not save the pairs. Please try again.',
          second: 'Second person',
          title: 'Pairs who will not draw each other ({{count}})',
          wouldBeImpossible:
            'With this pair the draw would be impossible – too few people are left to draw.',
        },
        inviteButton: 'Invite to the draw',
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
          qrButton: 'QR code',
          qrHide: 'Back to the message',
          qrCaption: 'Scan it with a phone camera to join.',
          qrDownload: 'Download image',
          qrLabel: 'Invite QR code for {{name}}',
          qrPasswordWarning:
            'The code works like the link: it does not include the password, so people will need the password from the organizer to join.',
          qrWarning:
            'The code works like the link: it lets people in without the password – show it only to people in the draw. A new link retires this code too.',
          share: 'Share',
          titleAfterCreate: 'Send the invite',
        },
        organizer: 'Organizer: {{name}}',
        participantsSection: {
          giftBought: 'Gift bought',
          giftNotBought: 'Still looking for a gift',
          giftsProgress: 'Gifts bought: {{done}} of {{total}}',
          noWish: 'No letter yet',
          owner: 'Organizer',
          ownerNotDrawing: 'Organizer · not drawing',
          lettersProgress: 'Letters written: {{done}} of {{total}}',
          title: 'Participants ({{count}})',
          wishProvided: 'Letter ready',
          you: '(you)',
        },
        startDraw: {
          passwordLabel: 'Draw password',
          allExclusionsSet:
            'Are these all the pairs who should not draw each other?',
          editExclusions: 'Change these pairs',
          exclusions: 'Will not draw each other: {{pairs}}.',
          noExclusions: 'Everyone can draw everyone else.',
          confirmationText:
            'Are you sure you want to draw pairs? This action is irreversible.\nTo confirm the draw, enter the password created when the draw was set up.',
          drawButton: 'Draw the pairs',
          incorrectPassword: 'Incorrect password',
          withoutWish_one:
            '{{names}} has not written a letter yet, and after the draw it will be too late. Their Santa will have to guess.',
          withoutWish_other:
            '{{count}} people have not written a letter yet: {{names}}. After the draw it will be too late, so their Santas will have to guess.',
        },
        startDrawButton: 'Start the draw',
        title: 'Draw',
        winnerSection: {
          budget: 'Budget: up to {{budget}} {{currency}}',
          giftBoughtToggle: 'I have the gift',
          keepSecret: 'Shh… it is a secret – do not tell anyone who you drew.',
          noWishProvided:
            'This person did not write a letter before the draw. Time for a good guess!',
          theirLetter: '{{name}} writes to Santa:',
          openEnvelope: 'Open the envelope with your draw result',
          sealedTo: 'To: {{name}}',
          tapToOpen: 'Tap to open',
          title: 'Your draw result',
          thanksFrom: 'Thanks from {{name}}',
          thanksHelper:
            'Your Santa will see this next to their result. You do not know who it is – and it stays that way.',
          thanksLabel: 'Your thank-you note',
          thanksSaved: 'Thanks sent.',
          thanksTitle: 'Thank your Santa',
          sendThanks: 'Send thanks',
          youBuyFor: 'You are buying a gift for',
        },
        wishSection: {
          editButton: 'Edit letter',
          lockedNote: 'After the draw the letter can no longer be changed.',
          noWishAfterDraw: 'No letter was written before the draw.',
          noWishWarning:
            'You have not written your letter yet. Say what you would like – only the person who draws you will read it.',
          salutation: 'Dear Santa,',
          saveButton: 'Save letter',
          saveSuccess: 'Letter saved. Your Santa will read it.',
          title: 'Your letter to Santa',
          itemsHeading: 'Things you would like',
          itemPlaceholder: 'e.g. A book about mountains',
          addItem: 'Add another thing',
          removeItem: 'Remove: {{item}}',
          commentLabel: 'A note for your Santa (optional)',
          commentHelper:
            'Sizes, colours, what you already have – anything that helps choose.',
          commentHeading: 'Note',
          discardConfirm: 'Discard',
          discardText: 'Your changes to the letter have not been saved.',
          discardTitle: 'Discard the changes?',
          draftRestored: 'Unsaved draft restored',
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
          codeRequired: 'Paste the invite link',
          description:
            'Paste the invite link you got from the organizer, e.g. in a group chat.',
          drawCodeLabel: 'Invite link',
          proceedButton: 'Next',
        },
        emptyTitle: 'No draws yet',
        noDraws:
          'Create your own draw or ask the organizer for the invite link.',
        stats:
          'Draws in the app: {{count}} · People with an envelope: {{winnersCount}}',
        title: 'Your Draws',
      },
      howItWorks: {
        step1: 'The organizer creates a draw and sends everyone one link.',
        step2:
          'Players join and write a letter to Santa: what they would like to get.',
        step3:
          'The organizer draws the pairs. Each player opens an envelope and sees who they are buying a gift for – nobody else does.',
        title: 'How does it work?',
      },
      joinPage: {
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
          passwordRequired: 'Password is required to join the draw',
        },
        joinButton: 'Join Draw',
        loginRequired:
          'You have an invitation to a Secret Santa. Sign in to see who invites you and to join.',
        passwordHint: 'You get the password from the organizer.',
        passwordLabel: 'Draw password',
        success: 'You are in! Now write your letter to Santa.',
        title: 'Invitation to a draw',
      },
      loginPage: {
        email: {
          changeAddress: 'Use another address',
          confirmAddress:
            'This link was opened in a different browser. Type the email address it was sent to.',
          explain:
            'We will email you a sign-in link. No password: open the link and you are in.',
          finish: 'Sign in',
          finishTitle: 'Signing in with the email link',
          invalid: 'Type a valid email address.',
          label: 'Email address',
          linkExpired:
            'This link has expired or was already used. Ask for a new one.',
          open: 'No Google account? Sign in with email',
          send: 'Send the sign-in link',
          sendFailed: 'Could not send the link. Please try again.',
          sent: 'We sent a sign-in link to {{email}}. Open it on this device (check spam too).',
          sentTitle: 'Check your inbox',
          signingIn: 'Signing in…',
          startOver: 'Back to signing in',
          wrongAddress:
            'This is not the address the link was sent to. Check it and try again.',
        },
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
          step2:
            'Choose "Open in browser" (or "Open in Chrome" / "in Safari").',
          step3:
            'No such option? Copy the link and paste it into your browser.',
          title: 'Open this page in your browser',
          why: 'It is open inside another app (e.g. Messenger or Instagram), and Google does not allow signing in there.',
        },
        googleNote:
          'Sign in with Google or with a link sent to your email. Others see your name (and your Google photo) so they know who joined.',
        privacyLink: 'How we use your data.',
        lead: 'One link for the whole group. Players write a letter to Santa, and on draw day open an envelope with the name of the person they buy a gift for.',
        loginWithGoogle: 'Sign in with Google',
        title: 'Secret Santa without paper slips in a hat',
        videoTitle: 'To warm up',
      },
      namePage: {
        explain:
          'Your account has no name yet. Tell us how others in the draw should see you.',
        failed: 'Could not save your name. Please try again.',
        hint: 'E.g. first name, or first name and surname initial.',
        label: 'Your name',
        notMe: 'Sign out',
        required: 'Type your name.',
        save: 'Save',
        title: 'What is your name?',
      },
      messages: {
        alreadySentToday:
          "You've already sent a message today. You can send another message tomorrow.",
        description:
          "Do you have any feedback? Is something not working? Or maybe you just want to get in touch? This is a good place, you can type and send me a message. I promise to reply to your account's email address.",
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
        coffee: 'Buy me a coffee',
        help: 'Help',
        privacy: 'Privacy policy',
        sourceCode: 'Source code on GitHub',
      },
      navbar: {
        accountMenu: 'Account menu: {{name}}',
        leaveMessage: 'Leave a message!',
        logout: 'Log out',
        messages: 'Messages',
        yourDraws: 'Your draws',
        showSanta: 'Show Santa!',
        title: 'Santa App',
      },
      adminMessages: {
        empty: 'No messages yet.',
        errors: {
          loadFailed: 'Failed to load messages. Please try again.',
        },
        reply: 'Reply',
        replySubject: 'Santa App – reply to your message',
        showOlder: 'Show older',
        title: 'Messages from users',
      },
      calendar: {
        add: 'Add to calendar',
        description:
          'Secret Santa gift exchange. Budget: {{budget}} {{currency}}. Your envelope: {{link}}',
        fileName: 'secret-santa',
        title: 'Secret Santa: {{name}}',
      },
      help: {
        lead: 'The most common questions about Secret Santa in Santa App.',
        links: {
          exclusions: 'How do these pairs work?',
          password: 'What if I forget the password?',
          questions: 'Questions? See the help',
          when: 'When is the draw?',
        },
        title: 'Help',
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
        backHome: 'Powrót na stronę główną',
        backToDraws: 'Powrót do losowań',
        cancel: 'Anuluj',
        close: 'Zamknij',
        hidePassword: 'Ukryj hasło',
        joining: 'Dołączanie...',
        loading: 'Wczytywanie',
        saving: 'Zapisywanie...',
        showPassword: 'Pokaż hasło',
        skipToContent: 'Przejdź do treści',
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
        ownerPlays: 'Biorę udział w losowaniu',
        ownerPlaysHint:
          'Odznacz, jeśli tylko organizujesz – nie napiszesz listu i nikt Cię nie wylosuje.',
        errors: {
          createFailed: 'Nie udało się utworzyć losowania. Spróbuj ponownie.',
        },
        lead: 'Ustal nazwę, budżet i hasło, którym rozpoczniesz losowanie. Potem zaprosisz pozostałe osoby.',
        password: 'Hasło do rozpoczęcia losowania',
        passwordHint:
          'Co najmniej 6 znaków. Osoby bez linku z zaproszenia też dołączą tym hasłem.',
        passwordNote:
          'Zapisz hasło! Bez niego nie rozpoczniesz losowania. Później nie da się go podejrzeć, ale możesz ustawić nowe (Więcej → Ustaw nowe hasło).',
        success: 'Losowanie utworzone. Teraz napisz swój list do Mikołaja!',
        successNoLetter: 'Losowanie utworzone.',
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
        checkResults:
          'Losowanie się odbyło – otwórz kopertę i sprawdź, komu kupujesz prezent.',
        envelopeOpened:
          'Koperta otwarta. Zajrzyj, jeśli chcesz jeszcze raz przeczytać list.',
        drawedStatus: 'Rozlosowane',
        noWish: 'Nie masz jeszcze listu do Mikołaja.',
        participants: 'Uczestnicy: {{count}}',
        viewDetails: 'Otwórz',
        waitingStatus: 'Oczekuje na losowanie',
      },
      drawPage: {
        description: { less: 'Zwiń opis', more: 'Pokaż cały opis' },
        goToJoin: 'Dołącz do tego losowania',
        drawnOn: 'Rozlosowano {{date}}',
        ownerNotPlaying:
          'Nie bierzesz udziału w losowaniu, więc nie piszesz listu.',
        noEnvelope:
          'Losowanie się odbyło. Nie bierzesz w nim udziału, więc nie masz koperty.',
        supportCard: {
          heading: 'Dziękuję, że korzystasz z Santa App! 🎅',
          text: 'Aplikacja jest darmowa, bez reklam, i robię ją po godzinach. Jeśli chcesz się odwdzięczyć, możesz postawić mi kawę ☕',
          button: 'Postaw mi kawę',
        },
        drawDone: {
          copied: 'Wiadomość skopiowana. Wklej ją na czacie.',
          copyMessage: 'Kopiuj wiadomość',
          description:
            'Daj znać wszystkim, że mogą już otworzyć swoje koperty.',
          message: {
            done: 'Losowanie „{{name}}” już się odbyło!',
            open: 'Otwórz swoją kopertę i sprawdź, komu kupujesz prezent: {{link}}',
            secret: 'Ciii… wynik zostaw dla siebie.',
          },
          notifyButton: 'Daj znać wszystkim',
          postcardTitle: 'Koperty już czekają!',
          title: 'Gotowe! Pary wylosowane',
        },
        password: {
          failed: 'Nie udało się zapisać hasła. Spróbuj ponownie.',
          forgot: 'Nie pamiętasz hasła? Ustaw nowe',
          hint: 'Co najmniej 6 znaków. Zapisz je!',
          label: 'Nowe hasło',
          menu: 'Ustaw nowe hasło',
          save: 'Zapisz hasło',
          saved: 'Nowe hasło zapisane.',
          text: 'Nowe hasło zastąpi stare: będzie potrzebne do rozpoczęcia losowania, a osoby bez linku z zaproszenia dołączą z nim. Wszyscy, którzy już dołączyli, zostają, a link z zaproszenia działa dalej.',
          title: 'Ustaw nowe hasło',
        },
        status: {
          ownerNeedsPeople:
            'Zaproś pozostałe osoby – losować można, gdy są co najmniej dwie.',
          ownerReady: 'Wszystkie listy gotowe – możesz rozpocząć losowanie.',
          ownerWaitingLetters:
            'Część listów jeszcze nie dotarła. Możesz rozpocząć losowanie już teraz albo poczekać na resztę.',
          participant:
            '{{owner}} rozpocznie losowanie, gdy wszyscy dołączą. Wtedy zajrzyj tu po swoją kopertę.',
        },
        errors: {
          accessDenied:
            'Nie bierzesz udziału w tym losowaniu. Jeśli masz zaproszenie, możesz dołączyć.',
          drawNotFound:
            'Losowanie nie zostało znalezione lub nie masz do niego dostępu.',
          fetchFailed:
            'Nie udało się pobrać szczegółów losowania. Spróbuj ponownie.',
          startDrawFailed:
            'Nie udało się przeprowadzić losowania. Odśwież stronę i spróbuj ponownie.',
          wishUpdateFailed: 'Nie udało się zapisać listu. Spróbuj ponownie.',
          giftBoughtUpdateFailed:
            'Nie udało się zapisać statusu prezentu. Spróbuj ponownie.',
          thanksSaveFailed:
            'Nie udało się wysłać podziękowania. Spróbuj ponownie.',
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
        remove: {
          button: 'Usuń z losowania: {{name}}',
          confirm: 'Usuń',
          done: '{{name}} nie bierze już udziału w losowaniu.',
          failed: 'Nie udało się usunąć tej osoby. Spróbuj ponownie.',
          text: '{{name}} przestanie brać udział w „{{draw}}”, a list tej osoby zostanie usunięty. Ta osoba może dołączyć ponownie przez link z zaproszeniem lub hasło. Utworzenie nowego linku w oknie „Zaproś do losowania” unieważnia tylko stary link, nie hasło. Jeśli ta osoba zna hasło, ustaw nowe w „Więcej → Ustaw nowe hasło”, aby nie mogła dołączyć ponownie.',
          title: 'Usunąć osobę z losowania?',
        },
        exclusions: {
          add: 'Dodaj parę',
          alreadyThere: 'Ta para już jest na liście.',
          explanation:
            'Osoby w parze nie wylosują siebie nawzajem – np. małżonkowie, którzy i tak kupują sobie prezenty.',
          first: 'Pierwsza osoba',
          impossibleRemoveMore:
            'Przy tych parach losowanie jest niemożliwe. Usuń kilka z nich.',
          impossibleRemoveOne:
            'Przy tych parach losowanie jest niemożliwe. Usuń jedną z nich: {{pairs}}.',
          pickTwo: 'Wybierz dwie różne osoby.',
          remove: 'Usuń parę {{pair}}',
          saveFailed: 'Nie udało się zapisać par. Spróbuj ponownie.',
          second: 'Druga osoba',
          title: 'Pary, które się nie wylosują ({{count}})',
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
            greeting: 'Dołącz do naszego losowania Secret Santa „{{name}}”!',
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
          qrButton: 'Kod QR',
          qrHide: 'Wróć do wiadomości',
          qrCaption: 'Zeskanuj aparatem telefonu, żeby dołączyć.',
          qrDownload: 'Pobierz obrazek',
          qrLabel: 'Kod QR zaproszenia do losowania {{name}}',
          qrPasswordWarning:
            'Kod działa jak link: nie zawiera hasła, więc do dołączenia potrzebne będzie hasło od organizatora.',
          qrWarning:
            'Kod działa jak link: wpuszcza bez hasła – pokazuj go tylko osobom z losowania. Nowy link unieważnia też ten kod.',
          share: 'Udostępnij',
          titleAfterCreate: 'Wyślij zaproszenie',
        },
        organizer: 'Organizator: {{name}}',
        participantsSection: {
          giftBought: 'Prezent kupiony',
          giftNotBought: 'Jeszcze szuka prezentu',
          giftsProgress: 'Prezenty kupione: {{done}} z {{total}}',
          noWish: 'Bez listu',
          owner: 'Organizator',
          ownerNotDrawing: 'Organizator · nie losuje',
          lettersProgress: 'Napisane listy: {{done}} z {{total}}',
          title: 'Uczestnicy ({{count}})',
          wishProvided: 'List gotowy',
          you: '(ty)',
        },
        startDraw: {
          passwordLabel: 'Hasło losowania',
          allExclusionsSet:
            'Czy to wszystkie pary, które nie powinny się wylosować?',
          editExclusions: 'Zmień te pary',
          exclusions: 'Nie wylosują siebie nawzajem: {{pairs}}.',
          noExclusions: 'Każdy może wylosować każdego.',
          confirmationText:
            'Czy na pewno chcesz wylosować pary? Tego nie da się cofnąć.\nAby potwierdzić, wpisz hasło ustalone przy tworzeniu losowania.',
          drawButton: 'Losuj pary',
          incorrectPassword: 'Nieprawidłowe hasło',
          withoutWish_one:
            'Jedna osoba nie napisała jeszcze listu: {{names}}. Po losowaniu będzie na to za późno, więc jej Mikołaj będzie musiał zgadywać.',
          withoutWish_few:
            '{{count}} osoby nie napisały jeszcze listu: {{names}}. Po losowaniu będzie na to za późno, więc ich Mikołaje będą musieli zgadywać.',
          withoutWish_many:
            '{{count}} osób nie napisało jeszcze listu: {{names}}. Po losowaniu będzie na to za późno, więc ich Mikołaje będą musieli zgadywać.',
          withoutWish_other:
            '{{count}} osoby nie napisały jeszcze listu: {{names}}. Po losowaniu będzie na to za późno, więc ich Mikołaje będą musieli zgadywać.',
        },
        startDrawButton: 'Rozpocznij losowanie',
        title: 'Losowanie',
        winnerSection: {
          budget: 'Budżet: do {{budget}} {{currency}}',
          giftBoughtToggle: 'Mam już prezent',
          keepSecret: 'Ciii… To tajemnica – nie zdradzaj nikomu tego wyniku.',
          noWishProvided:
            'Ta osoba nie napisała listu przed losowaniem. Czas na trafny strzał!',
          theirLetter: '{{name}} pisze do Mikołaja:',
          openEnvelope: 'Otwórz kopertę z wynikiem losowania',
          sealedTo: 'Do: {{name}}',
          tapToOpen: 'Stuknij, aby otworzyć',
          title: 'Twój wynik losowania',
          thanksFrom: 'Podziękowanie od {{name}}',
          thanksHelper:
            'Twój Mikołaj zobaczy to przy swoim wyniku. Nie wiesz, kto to – i tak zostanie.',
          thanksLabel: 'Twoje podziękowanie',
          thanksSaved: 'Podziękowanie wysłane.',
          thanksTitle: 'Podziękuj swojemu Mikołajowi',
          sendThanks: 'Wyślij podziękowanie',
          youBuyFor: 'Kupujesz prezent dla',
        },
        wishSection: {
          editButton: 'Edytuj list',
          lockedNote: 'Po losowaniu listu nie da się już zmienić.',
          noWishAfterDraw: 'List nie został napisany przed losowaniem.',
          noWishWarning:
            'Nie masz jeszcze listu do Mikołaja. Napisz, co chcesz dostać – przeczyta go tylko osoba, która cię wylosuje.',
          salutation: 'Drogi Mikołaju,',
          saveButton: 'Zapisz list',
          saveSuccess: 'List zapisany. Twój Mikołaj go przeczyta.',
          title: 'Twój list do Mikołaja',
          itemsHeading: 'Rzeczy, które chcesz dostać',
          itemPlaceholder: 'np. Książka o górach',
          addItem: 'Dodaj kolejną rzecz',
          removeItem: 'Usuń: {{item}}',
          commentLabel: 'Komentarz dla Mikołaja (opcjonalnie)',
          commentHelper:
            'Rozmiary, kolory, co już masz – wszystko, co pomoże wybrać.',
          commentHeading: 'Komentarz',
          discardConfirm: 'Odrzuć',
          discardText: 'Zmiany w liście nie zostały zapisane.',
          discardTitle: 'Odrzucić zmiany?',
          draftRestored: 'Przywrócono niezapisany szkic',
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
          codeRequired: 'Wklej link z zaproszenia',
          description:
            'Wklej link z zaproszenia, który dostajesz od organizatora, np. na czacie.',
          drawCodeLabel: 'Link z zaproszenia',
          proceedButton: 'Dalej',
        },
        emptyTitle: 'Nie masz jeszcze żadnego losowania',
        noDraws:
          'Załóż własne losowanie albo poproś organizatora o link z zaproszeniem.',
        stats:
          'Losowania w aplikacji: {{count}} · Osoby z kopertą: {{winnersCount}}',
        title: 'Twoje losowania',
      },
      howItWorks: {
        step1: 'Organizator zakłada losowanie i wysyła wszystkim jeden link.',
        step2:
          'Osoby biorące udział dołączają i piszą listy do Mikołaja: co chcą dostać.',
        step3:
          'Organizator losuje pary. Każda osoba biorąca udział otwiera kopertę i widzi, komu kupuje prezent – nikt inny tego nie wie.',
        title: 'Jak to działa?',
      },
      joinPage: {
        createdBy: 'Od: {{name}}',
        invitedBy: '{{name}} zaprasza cię do losowania Secret Santa.',
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
          passwordRequired: 'Wpisz hasło, żeby dołączyć do losowania',
        },
        loginRequired:
          'Masz zaproszenie do losowania Secret Santa. Zaloguj się, żeby zobaczyć, kto zaprasza, i dołączyć.',
        joinButton: 'Dołącz do losowania',
        passwordHint: 'Hasło dostajesz od organizatora.',
        passwordLabel: 'Hasło do losowania',
        success: 'Jesteś w losowaniu! Teraz napisz list do Mikołaja.',
        title: 'Zaproszenie do losowania',
      },
      loginPage: {
        email: {
          changeAddress: 'Podaj inny adres',
          confirmAddress:
            'Link otwarto w innej przeglądarce. Wpisz adres e-mail, na który przyszedł.',
          explain:
            'Wyślemy Ci link do logowania. Bez hasła: otwierasz link i gotowe.',
          finish: 'Zaloguj się',
          finishTitle: 'Logowanie linkiem z e-maila',
          invalid: 'Wpisz poprawny adres e-mail.',
          label: 'Adres e-mail',
          linkExpired: 'Ten link wygasł albo został już użyty. Poproś o nowy.',
          open: 'Nie masz konta Google? Zaloguj się e-mailem',
          send: 'Wyślij link do logowania',
          sendFailed: 'Nie udało się wysłać linku. Spróbuj ponownie.',
          sent: 'Wysłaliśmy link do logowania na {{email}}. Otwórz go na tym urządzeniu (zajrzyj też do spamu).',
          sentTitle: 'Sprawdź skrzynkę',
          signingIn: 'Logowanie…',
          startOver: 'Wróć do logowania',
          wrongAddress:
            'To nie jest adres, na który wysłano link. Sprawdź go i spróbuj ponownie.',
        },
        errors: {
          popupBlocked:
            'Przeglądarka zablokowała okno logowania. Zezwól na wyskakujące okna dla tej strony i spróbuj ponownie.',
          signInFailed: 'Nie udało się zalogować. Spróbuj ponownie.',
        },
        inAppBrowser: {
          copyFailed:
            'Nie udało się skopiować linku. Skopiuj ten adres: {{url}}',
          copyFailedSelect:
            'Nie udało się skopiować. Zaznacz adres w polu poniżej i skopiuj go.',
          copyLink: 'Kopiuj link',
          googleMayFail:
            'W Messengerze i Instagramie logowanie przez Google zwykle się nie udaje. Najpierw otwórz stronę w przeglądarce.',
          linkCopied: 'Link skopiowany. Wklej go w swojej przeglądarce.',
          linkLabel: 'Adres tej strony',
          or: 'lub',
          step1: 'Stuknij menu w rogu ekranu:',
          step2:
            'Wybierz „Otwórz w przeglądarce” (albo „Otwórz w Chrome” / „w Safari”).',
          step3: 'Nie ma takiej opcji? Skopiuj link i wklej go w przeglądarce.',
          title: 'Otwórz tę stronę w przeglądarce',
          why: 'Jest otwarta w innej aplikacji (np. Messengerze albo Instagramie), a tam Google nie pozwala się zalogować.',
        },
        googleNote:
          'Zaloguj się przez Google albo linkiem wysłanym na e-mail. Inni widzą Twoje imię (i zdjęcie z Google), żeby wiedzieć, kto dołączył.',
        privacyLink: 'Jak używamy danych.',
        lead: 'Losowanie na Mikołajki, jak w szkole, tylko online. Jeden link dla całej grupy. Uczestnicy piszą listy do Mikołaja, a po losowaniu otwierają koperty z imieniem osoby, dla której kupują prezent.',
        loginWithGoogle: 'Zaloguj przez Google',
        title: 'Secret Santa bez karteczek w czapce',
        videoTitle: 'Na rozgrzewkę',
      },
      namePage: {
        explain:
          'Twoje konto nie ma jeszcze imienia. Napisz, jak mają Cię widzieć inni w losowaniu.',
        failed: 'Nie udało się zapisać imienia. Spróbuj ponownie.',
        hint: 'Np. imię albo imię i pierwsza litera nazwiska.',
        label: 'Twoje imię',
        notMe: 'Wyloguj się',
        required: 'Wpisz swoje imię.',
        save: 'Zapisz',
        title: 'Jak masz na imię?',
      },
      messages: {
        alreadySentToday:
          'Dzisiejsza wiadomość już do mnie dotarła. Kolejną możesz wysłać jutro.',
        description:
          'Masz jakiś feedback? Coś nie działa? A może po prostu chcesz się skontaktować? To jest dobre miejsce, możesz wpisać i wysłać do mnie wiadomość. Obiecuję, że odpiszę na adres e-mail Twojego konta.',
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
        coffee: 'Postaw kawę',
        help: 'Pomoc',
        privacy: 'Polityka prywatności',
        sourceCode: 'Kod aplikacji na GitHubie',
      },
      navbar: {
        accountMenu: 'Menu konta: {{name}}',
        leaveMessage: 'Zostaw wiadomość!',
        logout: 'Wyloguj',
        messages: 'Wiadomości',
        yourDraws: 'Twoje losowania',
        showSanta: 'Pokaż Mikołaja!',
        title: 'Santa App',
      },
      adminMessages: {
        empty: 'Nie ma jeszcze wiadomości.',
        errors: {
          loadFailed: 'Nie udało się pobrać wiadomości. Spróbuj ponownie.',
        },
        reply: 'Odpisz',
        replySubject: 'Santa App – odpowiedź na Twoją wiadomość',
        showOlder: 'Pokaż starsze',
        title: 'Wiadomości od użytkowników',
      },
      calendar: {
        add: 'Dodaj do kalendarza',
        description:
          'Wręczenie prezentów – Secret Santa. Budżet: {{budget}} {{currency}}. Twoja koperta: {{link}}',
        fileName: 'secret-santa',
        title: 'Secret Santa: {{name}}',
      },
      help: {
        lead: 'Najczęstsze pytania o Secret Santa w Santa App.',
        links: {
          exclusions: 'Jak działają takie pary?',
          password: 'Co, jeśli zapomnę hasła?',
          questions: 'Masz pytania? Zajrzyj do pomocy',
          when: 'Kiedy będzie losowanie?',
        },
        title: 'Pomoc',
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

export type Language = 'pl' | 'en';

// The chosen language is kept in this browser; Polish is the default.
const LANGUAGE_KEY = 'santa-app.language';

const savedLanguage = (): Language =>
  storage.get(LANGUAGE_KEY) === 'en' ? 'en' : 'pl';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage(),
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export const setLanguage = (language: Language) => {
  i18n.changeLanguage(language);
  document.documentElement.lang = language;
  // Not remembered in private mode: the next visit starts in Polish.
  storage.set(LANGUAGE_KEY, language);
};

export default i18n;
