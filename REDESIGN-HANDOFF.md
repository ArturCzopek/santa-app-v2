# Redesign „List do Mikołaja” – przekazanie pracy (usunąć po zakończeniu)

Plik dla kolejnej sesji Claude Code. Rozmowa z autorem (Artur) po polsku.

## Zasady pracy

- Każdy punkt = osobny commit (komunikat po angielsku, jak w historii). Push robi Artur.
- **Nie pushować na `master`** – push na `master` = automatyczny deploy na produkcję.
  Praca trwa na gałęzi `redesign-list-do-mikolaja`; merge do `master` dopiero po R12.
- Każdą zmianę weryfikować: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`,
  plus zrzut ekranu desktop (1280) i telefon (375) – na telefonie `document.documentElement.scrollWidth`
  musi być 375.
- Dev: `npm run emulators` + `npm run dev:emulators`, `npm run emulators:seed` (konta Olga, Ania,
  Bartek, Celina, Darek, Ewa; hasło losowań `test123`). Logowanie w konsoli:
  `await window.__santaTest.signIn('olga', 'Olga Organizatorka')`.

## Kontekst projektowy

- `PRODUCT.md` – kto używa aplikacji i po co (szeroka publiczność, ~10 tys. osób, telefon, Messenger).
- `.impeccable/surfaces/src.md` – kierunek wizualny i kontrakt (THESIS / OWN-WORLD / … / FINISH).
- Świat: nocna zieleń świerku, papier listowy (ciepła biel, nie krem), obwódka „poczty lotniczej”
  (paski czerwono-zielone), czerwony lak tylko dla jednej głównej akcji, stemple = statusy,
  znaczki = uczestnicy, odręczny Caveat tylko do imion/nagłówków listów, UI w Nunito.
- Tokeny i wspólne elementy: `src/styles/theme.ts` (`tokens`, `handFont`, `airmailStripes`),
  `src/components/common/PaperCard.tsx` (prop `airmail`), `Postmark.tsx`, `StampAvatar.tsx`,
  `ActionButtons.tsx`, `src/components/form/PasswordField.tsx`, `src/components/HowItWorks.tsx`.
- Decyzje autora: „Pokaż Mikołaja!” i film „Dubstep Santa” zostają; hasło losowania trafi do
  wiadomości z zaproszeniem (jest hashowane, więc tylko zaraz po utworzeniu losowania), później
  osobna funkcja „link z kluczem”; teksty neutralne płciowo, polska pisownia nagłówków.

## Zrobione (commity na gałęzi)

R0 kontekst Impeccable · R1 tokeny motywu · R2 navbar + układ + stopka · R3 strona losowania na
papierze (list do Mikołaja, znaczki, stemple, okna jako formularze) · R4 logowanie + zaproszenie
jako pocztówka · R5 lista losowań jako koperty.

## Do zrobienia

- [ ] **R6 – formularz tworzenia (`src/pages/CreatePage.tsx`)** – nadal używa starego
  `ContentCard` i `styles/formStyles.ts` (na razie nieczytelny: ciemne tło + granatowy tekst).
  Przepisać na `PaperCard` + `FormTextField`/`FormSelect`/`PasswordField`/`FormActions`;
  tytuł „Nowe losowanie”; opis opcjonalny (reguły pozwalają na pusty); komunikaty limitów
  `drawNameTooLong` = 80 znaków i `currencyTooLong` = 3 (dziś w i18n błędnie 200 i 30);
  krótsza podpowiedź do hasła. Po utworzeniu: przejście na stronę losowania bez 3-sekundowego
  czekania, z `state` zawierającym hasło, żeby otworzyć zaproszenie (R10). Potem usunąć
  `ContentCard.tsx` i `formStyles.ts`.
- [ ] **R7 – śnieg** (`src/components/SnowfallEffect.tsx`): za treścią (dziś `zIndex: 1000` nad
  wszystkim, także nad oknami), mniej płatków na telefonie, brak przy `prefers-reduced-motion`.
- [ ] **R8 – dostępność i język**: kontrast AA wszędzie (sprawdzić stemple na ciemnym tle),
  polskie `aria-label`, fokus na pierwsze błędne pole, formy neutralne płciowo w pozostałych
  tekstach i18n (np. `messages.alreadySentToday` „Wysłałeś…”, `drawPage.errors.accessDenied`
  „Nie jesteś…” jest OK).
- [ ] **R9 – efekt „wow” wyniku** (`src/components/draw/WinnerSection.tsx`): zapieczętowana
  koperta z lakową pieczęcią „Stuknij, aby otworzyć”; stuknięcie → pęka lak, wysuwa się list
  (dzisiejsza treść). Bez animacji przy `prefers-reduced-motion`. Po losowaniu lista uczestników
  zwinięta. Organizator przed losowaniem: postęp „4 z 6 osób napisało list”.
- [ ] **R10 – zaproszenie jako pocztówka** (`InviteDrawModal.tsx`): główny przycisk „Udostępnij”
  (Web Share API, gotowa wiadomość: link, budżet, jak dołączyć; fallback: kopiuj), ekran/okno
  „Wyślij zaproszenie” zaraz po utworzeniu losowania (wtedy z hasłem).
- [ ] **R11 – E2E** (`e2e/draw.spec.ts`, `e2e/helpers.ts`): **od R3 nieuruchamiane** – na pewno
  do poprawy: po dołączeniu edytor listu jest już otwarty (przycisk „Zapisz list”, pole
  „Co chcesz dostać?”, zamiast „Edytuj życzenie”/„Zapisz życzenie”/placeholder „Wpisz swoje
  życzenie”), nagłówek wyniku to „Twój wynik losowania” (nie „Twój los”), komunikat zapisu
  „List zapisany”, nagłówek sekcji „Twój list do Mikołaja”, formularz tworzenia z R6.
  Dopisać: link brany z okna zaproszenia, gość otwiera `/join/…` przed zalogowaniem → po
  zalogowaniu wraca na dołączanie, zdjąć `fixme` z projektu „mobile”, test szerokości także
  po zalogowaniu.
- [ ] **R12 – zakończenie**: skill Impeccable (`/plugin marketplace add pbakaus/impeccable`,
  potem `/impeccable critique src` i `/impeccable audit`); cel ≥ 30/40 (start: 20/40).
  Detektor: `impeccable detect --json src`. Napisać `DESIGN.md` z gotowego systemu.
  Usunąć ten plik, zmergować gałąź do `master` (Artur pushuje).
