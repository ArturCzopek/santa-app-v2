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
        'Organizator zakłada losowanie i wysyła wszystkim jeden link. Każda osoba dołącza ze swojego telefonu i pisze list do Mikołaja: co chciałaby dostać.',
        'Gdy wszyscy są gotowi, organizator losuje pary. Każdy otwiera swoją kopertę i widzi tylko to, komu kupuje prezent, razem z listem tej osoby.',
      ],
    },
    {
      id: 'join',
      question: 'Jak dołączyć do losowania?',
      answer: [
        'Otwórz link z zaproszenia i zaloguj się kontem Google. Z linkiem z zaproszenia wystarczy stuknąć „Dołącz do losowania”; ze zwykłym linkiem trzeba jeszcze wpisać hasło od organizatora.',
      ],
    },
    {
      id: 'messenger',
      question:
        'Otwieram link w Messengerze i nie mogę się zalogować. Co robić?',
      answer: [
        'Google nie pozwala logować się w przeglądarkach wbudowanych w Messengera, Instagrama czy Facebooka. Stuknij menu w rogu ekranu i wybierz „Otwórz w przeglądarce” albo skopiuj link i wklej go w swojej przeglądarce (np. Chrome lub Safari).',
      ],
    },
    {
      id: 'letter',
      question: 'Kto przeczyta mój list do Mikołaja?',
      answer: [
        'Tylko jedna osoba: ta, która cię wylosuje, i dopiero po losowaniu. Organizator i pozostali widzą jedynie, czy list jest już napisany.',
        'List możesz zmieniać w każdej chwili, także po losowaniu – twój Mikołaj zawsze widzi najnowszą wersję.',
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
        'Przed losowaniem organizator może edytować albo usunąć losowanie, a uczestnicy mogą je opuścić („Więcej”). Po losowaniu nic poza listami się nie zmienia, żeby wyniki wszystkich były ważne.',
      ],
    },
    {
      id: 'cost',
      question: 'Czy to coś kosztuje?',
      answer: ['Nie. Santa App jest darmowa i nie trzeba niczego instalować.'],
    },
  ],
  en: [
    {
      id: 'what',
      question: 'How does Secret Santa work in Santa App?',
      answer: [
        'The organizer creates a draw and sends everyone one link. Each person joins from their own phone and writes a letter to Santa: what they would like to get.',
        'When everyone is ready, the organizer draws the pairs. Everyone opens their envelope and sees only whom they buy for, together with that person’s letter.',
      ],
    },
    {
      id: 'join',
      question: 'How do I join a draw?',
      answer: [
        'Open the invite link and sign in with Google. With the invite link, tapping "Join the draw" is enough; with a plain link you also type the password from the organizer.',
      ],
    },
    {
      id: 'messenger',
      question: 'I open the link in Messenger and cannot sign in. What now?',
      answer: [
        'Google does not allow signing in inside the browsers built into Messenger, Instagram or Facebook. Tap the menu in the corner and choose "Open in browser", or copy the link and paste it into your browser (e.g. Chrome or Safari).',
      ],
    },
    {
      id: 'letter',
      question: 'Who reads my letter to Santa?',
      answer: [
        'Only one person: whoever draws you, and only after the draw. The organizer and everyone else only see whether your letter is written.',
        'You can change your letter at any time, also after the draw – your Santa always sees the latest version.',
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
        'Before the draw the organizer can edit or delete it, and participants can leave ("More"). After the draw nothing but the letters changes, so everyone’s result stays valid.',
      ],
    },
    {
      id: 'cost',
      question: 'Does it cost anything?',
      answer: ['No. Santa App is free and there is nothing to install.'],
    },
  ],
};
