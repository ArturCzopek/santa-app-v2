// Text of the privacy policy page. Kept here rather than in i18n.ts because
// it is long prose; the page picks the language like the rest of the app.
// Update LAST_UPDATED whenever the content changes.

export const LAST_UPDATED = '2026-09-27';

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
        'To, co wpisujesz: losowania (nazwa, opis, budżet, data i miejsce wręczenia), listy do Mikołaja, podziękowania dla Mikołaja, wykluczenia par oraz wiadomości do autora.',
        'Dane potrzebne do działania losowania: lista uczestników, daty dołączenia i wynik losowania (kto komu kupuje prezent). Hasło losowania zapisujemy tylko jako skrót (hash), z którego nie da się go odczytać.',
        'Szkic listu do Mikołaja (do czasu zapisania albo odrzucenia), wybrany język i informacja o otwarciu koperty z wynikiem pozostają w przeglądarce na Twoim urządzeniu i nie są do nas wysyłane. Firebase Authentication przechowuje w przeglądarce sesję logowania aż do wylogowania. Nie używamy narzędzi analitycznych ani plików cookie do śledzenia.',
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
        'Podziękowanie widzisz tylko Ty i Twój Mikołaj. Nikt inny, także organizator, nie ma do niego dostępu. Uczestnicy widzą, czy kupiono już prezent – nie widzą, dla kogo.',
        'Wynik losowania (kogo obdarowujesz) widzisz tylko Ty. Wykluczenia par widzi tylko organizator.',
        'Dane przechowują dostawcy usług, z których korzysta aplikacja: Google (Firebase Authentication – logowanie, Cloud Firestore – baza danych, Google Fonts – czcionki), GitHub (GitHub Pages – strona aplikacji) i YouTube (filmy, ładowane w trybie bez plików cookie dopiero, gdy są widoczne). Google może przetwarzać dane także poza Europejskim Obszarem Gospodarczym, na zasadach opisanych w swoich warunkach ochrony danych.',
      ],
    },
    {
      heading: 'Jak długo',
      items: [
        'Losowanie i listy przechowujemy, dopóki losowanie istnieje – także po losowaniu, żeby uczestnicy mogli wrócić do swojego wyniku.',
        'Przed losowaniem organizator może je usunąć razem ze wszystkimi listami, a każdy uczestnik może z niego wyjść (jego list znika).',
        'Po losowaniu nic się w nim już nie zmienia, więc prośby o usunięcie danych obsługujemy ręcznie. Na prośbę organizatora usuniemy całe zakończone losowanie – zniknie wtedy u wszystkich uczestników.',
        'Na Twoją prośbę usuniemy Twoje konto logowania, wiadomości, listy do Mikołaja i podziękowania, a w zakończonych losowaniach zastąpimy Twoje imię i zdjęcie napisem „Usunięta osoba”, żeby wyniki pozostałych osób dalej działały.',
      ],
    },
    {
      heading: 'Twoje prawa',
      paragraphs: [
        'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, a także prawo sprzeciwu.',
        'Napisz do nas przyciskiem „Zostaw wiadomość!” po zalogowaniu albo mailem z adresu, którym logujesz się przez Google – tak sprawdzimy, że prośba jest od Ciebie. Prośby obsługuje ręcznie autor aplikacji: odpowiemy najszybciej, jak się da, najpóźniej w ciągu miesiąca, i damy znać, gdy wszystko będzie zrobione.',
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
        'What you type in: draws (name, description, budget, date and place of the gift exchange), letters to Santa, thank-you notes to your Santa, excluded pairs and messages to the author.',
        'What the draw needs to work: who takes part, when they joined and who drew whom. The draw password is stored only as a hash that cannot be turned back into the password.',
        'The draft of your letter to Santa (until you save or discard it), your chosen language and whether you have opened the result envelope stay in your browser on your device and are not sent to us. Firebase Authentication keeps your sign-in session in the browser until you sign out. We use no analytics and no tracking cookies.',
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
        'Only you and your Santa can read your thank-you note. Nobody else, not even the organizer, has access to it. Participants see whether a person has bought their gift – not for whom.',
        'Only you see your result (whom you give a gift to). Only the organizer sees the excluded pairs.',
        'The data is kept by the providers the app uses: Google (Firebase Authentication – sign-in, Cloud Firestore – database, Google Fonts – fonts), GitHub (GitHub Pages – the app’s website) and YouTube (videos, loaded in no-cookie mode only when they are shown). Google may also process data outside the European Economic Area, under its data protection terms.',
      ],
    },
    {
      heading: 'For how long',
      items: [
        'We keep a draw and its letters as long as the draw exists – also after the draw, so participants can come back to their result.',
        'Before the draw the organizer can delete it with all letters, and every participant can leave it (their letter goes away).',
        'After the draw nothing in it changes any more, so requests to delete data are handled by hand. If the organizer asks, we delete the whole finished draw – it then disappears for every participant.',
        'If you ask, we delete your sign-in account, your messages, your letters to Santa and thank-you notes, and in finished draws we replace your name and photo with "Usunięta osoba" (deleted person), so everyone else’s result keeps working.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You have the right to access, correct, delete, restrict and port your data, and to object.',
        'Write to us with the "Leave a message!" button after signing in, or by email from the address you sign in with through Google – that is how we check the request is yours. The author of the app handles requests by hand: we answer as soon as we can, within a month at the latest, and let you know when everything is done.',
        'You can also complain to the Polish data protection authority (Prezes UODO, uodo.gov.pl).',
      ],
    },
  ],
};
