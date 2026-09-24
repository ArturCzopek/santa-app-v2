// Text of the privacy policy page. Kept here rather than in i18n.ts because
// it is long prose; the page picks the language like the rest of the app.
// Update LAST_UPDATED whenever the content changes.

export const LAST_UPDATED = '2026-09-24';

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

export const privacyPolicy: Record<'pl' | 'en', PolicySection[]> = {
  pl: [
    {
      heading: 'Kto odpowiada za dane',
      paragraphs: [
        'Administratorem danych jest Artur Czopek, autor Santa App. To prywatny, niekomercyjny projekt: aplikacja jest bezpłatna i nie wyświetla reklam.',
        'Kontakt: arturcz32@gmail.com, przycisk „Zostaw wiadomość!” po zalogowaniu albo zgłoszenie w repozytorium aplikacji na GitHubie (link w stopce).',
      ],
    },
    {
      heading: 'Jakie dane przetwarzamy',
      items: [
        'Z konta Google przy logowaniu: imię i nazwisko (nazwa wyświetlana), zdjęcie profilowe, adres e-mail i identyfikator konta. Adres e-mail zna tylko usługa logowania – nie pokazujemy go innym osobom i nie wysyłamy na niego wiadomości.',
        'To, co wpisujesz: losowania (nazwa, opis, budżet, data i miejsce wręczenia), listy do Mikołaja, wykluczenia par oraz wiadomości do autora.',
        'Dane potrzebne do działania losowania: lista uczestników, daty dołączenia i wynik losowania (kto komu kupuje prezent). Hasło losowania zapisujemy tylko jako skrót (hash), z którego nie da się go odczytać.',
        'W Twojej przeglądarce (localStorage) zapamiętujemy tylko, że koperta z wynikiem została już otwarta. Nie używamy narzędzi analitycznych ani plików cookie do śledzenia.',
      ],
    },
    {
      heading: 'Po co i na jakiej podstawie',
      items: [
        'Żeby przeprowadzić losowanie, o które prosisz: założyć je, dołączyć, pokazać uczestników i wynik (art. 6 ust. 1 lit. b RODO).',
        'Żeby odpowiedzieć na Twoją wiadomość i dbać o bezpieczeństwo aplikacji – to nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).',
      ],
    },
    {
      heading: 'Kto widzi Twoje dane',
      items: [
        'Uczestnicy tego samego losowania widzą Twoje imię, zdjęcie i to, czy napiszesz list. Zalogowana osoba z linkiem do losowania widzi tylko informacje o nim samym (nazwę, opis, budżet, datę i miejsce, organizatora) – na stronie z zaproszeniem.',
        'Treść Twojego listu do Mikołaja widzisz tylko Ty i – po losowaniu – osoba, która Cię wylosuje. Nikt inny, także organizator, nie ma do niej dostępu.',
        'Wynik losowania (kogo obdarowujesz) widzisz tylko Ty. Wykluczenia par widzi tylko organizator.',
        'Dane przechowują dostawcy usług, z których korzysta aplikacja: Google (Firebase Authentication – logowanie, Cloud Firestore – baza danych, Google Fonts – czcionki), GitHub (GitHub Pages – strona aplikacji) i YouTube (filmy, ładowane w trybie bez plików cookie dopiero, gdy są widoczne). Google może przetwarzać dane także poza Europejskim Obszarem Gospodarczym, na zasadach opisanych w swoich warunkach ochrony danych.',
      ],
    },
    {
      heading: 'Jak długo',
      items: [
        'Losowanie i listy przechowujemy, dopóki losowanie istnieje – także po losowaniu, żeby uczestnicy mogli wrócić do swojego wyniku.',
        'Przed losowaniem organizator może je usunąć razem ze wszystkimi listami, a każdy uczestnik może z niego wyjść (jego list znika).',
        'Na prośbę usuniemy zakończone losowanie, Twoje konto logowania i Twoje wiadomości.',
      ],
    },
    {
      heading: 'Twoje prawa',
      paragraphs: [
        'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, a także prawo sprzeciwu. Napisz do nas – odpowiemy najszybciej, jak się da, najpóźniej w ciągu miesiąca.',
        'Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).',
      ],
    },
  ],
  en: [
    {
      heading: 'Who is responsible for the data',
      paragraphs: [
        'The data controller is Artur Czopek, the author of Santa App. It is a private, non-commercial project: the app is free and shows no ads.',
        'Contact: arturcz32@gmail.com, the "Leave a message!" button after signing in, or an issue in the app’s GitHub repository (link in the footer).',
      ],
    },
    {
      heading: 'What data we process',
      items: [
        'From your Google account when you sign in: your name, profile photo, email address and account id. Only the sign-in service knows your email address – we do not show it to anyone or send you emails.',
        'What you type in: draws (name, description, budget, date and place of the gift exchange), letters to Santa, excluded pairs and messages to the author.',
        'What the draw needs to work: who takes part, when they joined and who drew whom. The draw password is stored only as a hash that cannot be turned back into the password.',
        'In your browser (localStorage) we only remember that you have opened the envelope with your result. We use no analytics and no tracking cookies.',
      ],
    },
    {
      heading: 'Why, and on what basis',
      items: [
        'To run the draw you ask for: create it, join it, show the participants and the result (Art. 6(1)(b) GDPR).',
        'To answer your message and keep the app secure – our legitimate interest (Art. 6(1)(f) GDPR).',
      ],
    },
    {
      heading: 'Who sees your data',
      items: [
        'Participants of the same draw see your name, photo and whether you wrote a letter. A signed-in person with the draw’s link sees only the draw itself (name, description, budget, date and place, organizer) – on the invite page.',
        'Only you and – after the draw – the person who draws you can read your letter to Santa. Nobody else, not even the organizer, has access to it.',
        'Only you see your result (whom you give a gift to). Only the organizer sees the excluded pairs.',
        'The data is kept by the providers the app uses: Google (Firebase Authentication – sign-in, Cloud Firestore – database, Google Fonts – fonts), GitHub (GitHub Pages – the app’s website) and YouTube (videos, loaded in no-cookie mode only when they are shown). Google may also process data outside the European Economic Area, under its data protection terms.',
      ],
    },
    {
      heading: 'For how long',
      items: [
        'We keep a draw and its letters as long as the draw exists – also after the draw, so participants can come back to their result.',
        'Before the draw the organizer can delete it with all letters, and every participant can leave it (their letter goes away).',
        'On request we delete a finished draw, your sign-in account and your messages.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You have the right to access, correct, delete, restrict and port your data, and to object. Write to us – we answer as soon as we can, within a month at the latest.',
        'You can also complain to the Polish data protection authority (Prezes UODO, uodo.gov.pl).',
      ],
    },
  ],
};
