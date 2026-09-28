// Answers to the questions people actually ask, in the order they meet them.
// The id is used in links like #/help?q=password, which open that answer.
export interface HelpEntry {
  id: string;
  question: string;
  answer: string[];
}

export const helpContent: Record<'pl' | 'en', HelpEntry[]> = {
  pl: [
    {
      id: 'what',
      question: 'Jak działa Tajemniczy Mikołaj w Santa App?',
      answer: [
        'Organizator zakłada losowanie i wysyła wszystkim jeden link. Osoby biorące udział dołączają ze swoich telefonów i piszą listy do Mikołaja: co chciałyby dostać.',
        'Gdy gracze są gotowi, organizator losuje pary. Każda osoba biorąca udział otwiera swoją kopertę i widzi tylko to, komu kupuje prezent, razem z listem tej osoby.',
      ],
    },
    {
      id: 'install',
      question: 'Jak dodać aplikację do ekranu telefonu?',
      answer: [
        'Na Androidzie w Chrome otwórz menu ⋮ i wybierz „Zainstaluj aplikację” albo „Dodaj do ekranu głównego”. Na iPhonie w Safari stuknij „Udostępnij” → „Do ekranu początkowego”. Na komputerze wybierz ikonę instalacji na pasku adresu albo opcję instalacji w menu przeglądarki.',
        'Na iPhonie aplikacja na ekranie początkowym ma osobne miejsce na dane, więc może być konieczne ponowne zalogowanie.',
      ],
    },
    {
      id: 'organizer',
      question: 'Czy organizator musi brać udział w losowaniu?',
      answer: [
        'Nie. Przy tworzeniu losowania możesz odznaczyć udział organizatora. Nadal zarządzasz losowaniem, ale nie piszesz listu i nikt cię nie wylosuje.',
      ],
    },
    {
      id: 'join',
      question: 'Jak dołączyć do losowania?',
      answer: [
        'Otwórz link z zaproszenia i zaloguj się kontem Google albo linkiem wysłanym na e-mail. Z linkiem z zaproszenia wystarczy stuknąć „Dołącz do losowania”; ze zwykłym linkiem trzeba jeszcze wpisać hasło od organizatora.',
      ],
    },
    {
      id: 'qr',
      question: 'Jak użyć kodu QR zaproszenia?',
      answer: [
        'W zaproszeniu wybierz „Kod QR”. Pokaż go na ekranie podczas spotkania albo pobierz obrazek i wydrukuj; pozostałe osoby skanują go aparatem telefonu, żeby otworzyć link. Kod działa jak link: z kluczem zaproszenia wpuszcza bez hasła, a zwykły link wymaga hasła od organizatora. Pokazuj go tylko osobom z losowania; utworzenie nowego linku unieważnia też kod.',
      ],
    },
    {
      id: 'messenger',
      question:
        'Otwieram link w Messengerze i nie mogę się zalogować. Co robić?',
      answer: [
        'Google nie pozwala logować się w przeglądarkach wbudowanych w Messengera, Instagrama czy Facebooka. Stuknij menu w rogu ekranu i wybierz „Otwórz w przeglądarce” albo skopiuj link i wklej go w swojej przeglądarce (np. Chrome lub Safari). Możesz też wybrać „Zaloguj się e-mailem”: link z maila otworzy się już w zwykłej przeglądarce.',
      ],
    },
    {
      id: 'email',
      question: 'Nie mam konta Google. Jak się zalogować?',
      answer: [
        'Wybierz „Nie masz konta Google? Zaloguj się e-mailem”, wpisz adres i otwórz link, który przyjdzie mailem (zajrzyj też do spamu). Nie ma hasła do zapamiętania. Za pierwszym razem podajesz imię – tak zobaczą Cię inni w losowaniu. Jeśli link otworzy się w innej przeglądarce, wystarczy jeszcze raz wpisać ten sam adres.',
      ],
    },
    {
      id: 'letter',
      question: 'Kto przeczyta mój list do Mikołaja?',
      answer: [
        'Tylko jedna osoba: ta, która cię wylosuje, i dopiero po losowaniu. Organizator i pozostali widzą jedynie, czy list jest już napisany.',
        'W części „Rzeczy, które chcesz dostać” dodaj po jednej rzeczy w każdym polu; możesz wkleić link do produktu. W opcjonalnym komentarzu dopisz rozmiary, kolory i inne wskazówki.',
        'List możesz pisać i zmieniać aż do losowania. Po losowaniu zostaje taki, jaki był – twój Mikołaj czyta dokładnie to, co było w nim w chwili losowania. Nie zwlekaj więc z pisaniem!',
      ],
    },
    {
      id: 'when',
      question: 'Kiedy odbędzie się losowanie?',
      answer: [
        'Losowanie rozpoczyna organizator, zwykle gdy wszyscy dołączą i napiszą listy. Potem dostaje gotową wiadomość „Koperty już czekają!” do wysłania wszystkim. Na stronie losowania zawsze widać, na co jeszcze czekamy.',
      ],
    },
    {
      id: 'gift',
      question: 'Co zrobić po kupieniu prezentu?',
      answer: [
        'Po zakupie zaznacz „Mam już prezent” przy swoim wyniku. Uczestnicy zobaczą status zakupu, ale nie dowiedzą się, dla kogo kupujesz prezent. Możesz też wysłać podziękowanie swojemu Mikołajowi – tylko on zobaczy je przy swoim wyniku.',
      ],
    },
    {
      id: 'exclusions',
      question: 'Co to znaczy, że para się nie wylosuje?',
      answer: [
        'Organizator może wskazać pary, które nie powinny wylosować siebie nawzajem – na przykład małżonków, którzy i tak kupują sobie prezenty. Działa to w obie strony. Aplikacja nie pozwoli dodać pary, przez którą losowanie byłoby niemożliwe.',
      ],
    },
    {
      id: 'password',
      question: 'Nie pamiętam hasła do losowania. Co teraz?',
      answer: [
        'Jeśli to twoje losowanie, otwórz je i wybierz „Więcej” → „Ustaw nowe hasło” (albo „Nie pamiętasz hasła?” w oknie rozpoczęcia losowania). Osoby, które już dołączyły, zostają, a link z zaproszenia działa dalej.',
        'Jeśli dołączasz do cudzego losowania, poproś organizatora o link z zaproszenia – z nim hasło nie jest potrzebne.',
      ],
    },
    {
      id: 'calendar',
      question: 'Jak nie zapomnieć o wręczeniu prezentów?',
      answer: [
        'Jeśli organizator podał datę, na stronie losowania jest przycisk „Dodaj do kalendarza”. Wydarzenie trafi do kalendarza w telefonie razem z linkiem do losowania.',
      ],
    },
    {
      id: 'change',
      question: 'Czy można coś zmienić albo się wycofać?',
      answer: [
        'Przed losowaniem organizator może edytować albo usunąć losowanie („Więcej”) i usunąć z niego osobę (ikona przy imieniu na liście uczestników), a uczestnicy mogą je opuścić („Więcej”). Po losowaniu nic się już nie zmienia – ani losowanie, ani listy – żeby wyniki wszystkich były ważne.',
      ],
    },
    {
      id: 'cost',
      question: 'Czy to coś kosztuje?',
      answer: [
        'Nie. Santa App jest darmowa i działa w przeglądarce; dodanie jej do ekranu telefonu jest opcjonalne.',
        'Jeśli chcesz dobrowolnie wesprzeć autora, linki znajdziesz w stopce („Postaw kawę”) oraz na stronie losowania po losowaniu („Postaw mi kawę”). Prowadzą do zewnętrznego serwisu buycoffee.to.',
      ],
    },
  ],
  en: [
    {
      id: 'what',
      question: 'How does Secret Santa work in Santa App?',
      answer: [
        'The organizer creates a draw and sends everyone one link. Players join from their own phones and write a letter to Santa: what they would like to get.',
        'When the players are ready, the organizer draws the pairs. Each player opens their envelope and sees only whom they buy for, together with that person’s letter.',
      ],
    },
    {
      id: 'install',
      question: 'How do I add the app to my home screen?',
      answer: [
        'On Android in Chrome, open the ⋮ menu and choose “Install app” or “Add to Home screen”. On iPhone in Safari, tap “Share” → “Add to Home Screen”. On a computer, choose the install icon in the address bar or the install option in the browser menu.',
        'On iPhone, the home-screen app has its own storage, so you may need to sign in again.',
      ],
    },
    {
      id: 'organizer',
      question: 'Does the organizer have to take part in the draw?',
      answer: [
        'No. Untick the organizer’s participation when creating the draw. You still manage the draw, but you do not write a letter and nobody draws you.',
      ],
    },
    {
      id: 'join',
      question: 'How do I join a draw?',
      answer: [
        'Open the invite link and sign in with Google or with a link sent to your email. With the invite link, tapping "Join the draw" is enough; with a plain link you also type the password from the organizer.',
      ],
    },
    {
      id: 'qr',
      question: 'How do I use the invite QR code?',
      answer: [
        'Choose "QR code" in the invite. Show it on a screen at a meeting or download and print the image; everyone else scans it with a phone camera to open the link. The code works like the link: an invite link lets people in without the password; a plain link still needs the password from the organizer. Show it only to people in the draw; making a new link retires the code too.',
      ],
    },
    {
      id: 'messenger',
      question: 'I open the link in Messenger and cannot sign in. What now?',
      answer: [
        'Google does not allow signing in inside the browsers built into Messenger, Instagram or Facebook. Tap the menu in the corner and choose "Open in browser", or copy the link and paste it into your browser (e.g. Chrome or Safari). You can also choose "Sign in with email": the link from the email opens in your normal browser.',
      ],
    },
    {
      id: 'email',
      question: 'I have no Google account. How do I sign in?',
      answer: [
        'Choose "No Google account? Sign in with email", type your address and open the link we email you (check spam too). There is no password to remember. The first time you give your name – that is how others in the draw see you. If the link opens in a different browser, just type the same address again.',
      ],
    },
    {
      id: 'letter',
      question: 'Who reads my letter to Santa?',
      answer: [
        'Only one person: whoever draws you, and only after the draw. The organizer and everyone else only see whether your letter is written.',
        'In “Things you would like”, add one short thing per field; you can paste a product link. Use the optional note for sizes, colours and other details that help your Santa choose.',
        'You can write and change your letter until the draw. After the draw it stays as it was – your Santa reads exactly what it said when the pairs were drawn. So do not leave it too late!',
      ],
    },
    {
      id: 'when',
      question: 'When does the draw happen?',
      answer: [
        'The organizer starts the draw, usually once everyone has joined and written a letter. They then get a ready "The envelopes are here!" message to send to everyone. The draw page always says what it is waiting for.',
      ],
    },
    {
      id: 'gift',
      question: 'What can I do after buying a gift?',
      answer: [
        'After you buy it, mark “I have the gift” next to your result. Participants see the gift status, but not who you are buying for. You can also send a thank-you to your Santa; only they see it next to their result.',
      ],
    },
    {
      id: 'exclusions',
      question: 'What does it mean that a pair will not draw each other?',
      answer: [
        'The organizer can mark pairs who should not draw each other – for example a couple who buy presents together anyway. It works both ways. The app does not accept a pair that would make the draw impossible.',
      ],
    },
    {
      id: 'password',
      question: 'I forgot the draw password. What now?',
      answer: [
        'If it is your draw, open it and choose "More" → "Set a new password" (or "Forgot the password?" in the start dialog). Everyone who joined stays, and the invite link keeps working.',
        'If you are joining someone else’s draw, ask the organizer for the invite link – with it no password is needed.',
      ],
    },
    {
      id: 'calendar',
      question: 'How do I not forget the gift exchange?',
      answer: [
        'If the organizer set a date, the draw page has an "Add to calendar" button. The event goes into your phone’s calendar together with a link to the draw.',
      ],
    },
    {
      id: 'change',
      question: 'Can things be changed, or can I back out?',
      answer: [
        'Before the draw the organizer can edit or delete it ("More") and remove a person from it (the icon next to the name in the participants list), and participants can leave ("More"). After the draw nothing changes any more – neither the draw nor the letters – so everyone’s result stays valid.',
      ],
    },
    {
      id: 'cost',
      question: 'Does it cost anything?',
      answer: [
        'No. Santa App is free and works in the browser; adding it to your home screen is optional.',
        'If you would like to support the author voluntarily, the footer and the draw page after a draw have a “Buy me a coffee” link. It opens the external buycoffee.to service.',
      ],
    },
  ],
};
