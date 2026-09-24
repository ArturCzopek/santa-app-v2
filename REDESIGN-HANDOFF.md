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
jako pocztówka · R5 lista losowań jako koperty · R6 formularz tworzenia na papierze (po utworzeniu
przejście na losowanie ze `state: { justJoined: true, createdPassword }` – R10 ma odczytać
`createdPassword` w `DrawPage` i otworzyć zaproszenie) · R7 śnieg za treścią, 60 płatków na telefonie, brak przy
`prefers-reduced-motion` · R8 ciemniejszy `pine` (#2A7549, AA także na `paperShade`), polskie
teksty MUI (`plPL`), `aria-label` spinnerów, fokus na błędne pole w oknach i na stronie dołączania,
neutralne płciowo teksty (role „Organizator”/„Uczestnik” zostały). · R9 zapieczętowana koperta
(`SealedEnvelope.tsx`, otwarcie pamiętane w `localStorage` per losowanie i osoba), zwinięta lista
uczestników po losowaniu, „Napisane listy: 4 z 6” dla organizatora. · R10 zaproszenie jako pocztówka: gotowa wiadomość,
„Udostępnij” (Web Share API) albo „Kopiuj zaproszenie”, po utworzeniu okno „Wyślij zaproszenie” z hasłem
(hasło tylko w pamięci, usuwane z historii przeglądarki).

## Do zrobienia

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
