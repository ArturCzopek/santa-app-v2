# Santa App v2 – roadmap i backlog

> Wspólny, śledzony backlog projektu. Aktualizować przy zmianie statusu zadania.
> Ostatnia aktualizacja: 2026-09-26
> Zasady współpracy i podział odpowiedzialności: [AGENTS.md](AGENTS.md). Statusy należy
> weryfikować względem kodu; sekcja „Zrobione” zachowuje starsze notatki kontekstowe.

## Kontekst i ustalenia

- **Co to jest:** Tajemniczy Mikołaj. React 19 + MUI 9 + Vite 8, Firebase 12 (Auth Google + Firestore),
  hosting GitHub Pages (`https://arturczopek.github.io/santa-app-v2`). Brak backendu.
- **Filozofia:** pet project, prosty. Utrzymanie i deploy mają być trywialne. Claude prowadzi
  decyzje; Codex realizuje jasno ograniczone zadania zgodnie z `AGENTS.md`.
- **Architektura:** na razie sam Firebase (plan Spark, bez Cloud Functions).
  Bezpieczeństwo = `firestore.rules` + testy w emulatorze.
  - Świadomy kompromis: pary losuje przeglądarka właściciela → zdeterminowany właściciel
    mógłby podejrzeć/ustawić wynik w DevTools. Uczestnicy nie mogą.
- **Sposób pracy:** zadania mają opis zachowania, właściciela decyzji i walidacji. Push na
  `master` uruchamia CI, a następnie obecny deploy: opcjonalne staging rules → produkcyjne
  rules → build → GitHub Pages. Build następuje po deployu reguł; kolejność wymaga poprawy
  (O1 w sekcji wdrożenia).
- **Zasada wersji:** najnowsza stabilna linia, która jest na rynku od kilku miesięcy i ma poprawki
  (nie świeże x.0).
- **Kolejność prac:** obecne funkcje, testy, stos i redesign są w repo. Następne: pilne
  kwestie bezpieczeństwa/prywatności, odporność wdrożenia, potem jasno zatwierdzone funkcje.
  Nie zaczynać zadań z backlogu bez sprawdzenia ich statusu w kodzie.
- **Impeccable** (skill do designu, v4.3.1) zainstalowany globalnie w `~/.claude/skills/impeccable`
  (+ agenci w `~/.claude/agents/impeccable-*`), bez hooka. W nowej sesji: `/impeccable <komenda>`.
  Launcher: `~\.claude\skills\impeccable\scripts\impeccable.cmd` (np. `detect --json src`).
  Telemetria wyłączona (`IMPECCABLE_NO_TELEMETRY=1` w zmiennych użytkownika).
  Kontekst projektu: `PRODUCT.md` (prawda o produkcie) i `.impeccable/surfaces/src.md`
  (brief + kontrakt kierunku). Raporty critique lokalnie w `.impeccable/critique/` (poza gitem).

### Środowisko (Windows)
- Git 2.55, Node 24 LTS (npm 11), Java (Corretto 27) do emulatorów.
- Nowa sesja PowerShell może mieć stary PATH:
  `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`
- PowerShell 5: w `git commit -m` nie używać cudzysłowów (psują argumenty) → komunikat z pliku (`-F`).
  Nie używać `stash@{0}` (klamry = blok skryptu) → `'stash@{0}'`.
- Dev bez Firebase: `npm run emulators` + `npm run dev:emulators` (http://localhost:5173).
  Dane trwałe w `.emulator-data/` (zapis przy Ctrl+C lub `npm run emulators:save`, czyszczenie `emulators:reset`).
  `npm run emulators:seed` → 6 kont testowych (Olga, Ania, Bartek, Celina, Darek, Ewa) + 2 losowania, hasło `test123`.
  Logowanie w trybie emulatorów: okienko z kontami albo `await window.__santaTest.signIn('sub', 'Imię')` w konsoli.
- Staging: `npm run dev:staging` (projekt dev Firebase, prawdziwe logowanie Google, konfiguracja w `.env.staging`).
- Komendy: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`.
  Testy zajmują porty 8080/9099/5173 – najpierw zatrzymać emulatory dev.
- Pełna weryfikacja (skrypt Claude'a w scratchpadzie sesji): lint + typecheck + build + test + e2e.

---

## 0. Wdrożenie

- [x] Produkcja wdrożona 2026-09-24 (sekret `FIREBASE_SERVICE_ACCOUNT`, konto `firebase-adminsdk-…`
  z rolami „Firebase Admin” + „Service Usage Consumer”; po dodaniu ról trzeba było odczekać kilka minut).
  Od teraz push na `master` = automatyczny deploy.
- [x] Staging wdrożony 2026-09-24 (5. podejście – role IAM w projekcie dev długo się propagowały;
  przy problemach z uprawnieniami po prostu odczekać i „Re-run failed jobs”).
- [x] **Staging na projekcie dev – kroki (zrobione, zostawione dla przypomnienia):**
  1. Firebase console → **projekt dev** → ⚙ Project settings → Service accounts → „Generate new private key”.
  2. console.cloud.google.com/iam-admin/iam → wybrać **projekt dev** → konto `firebase-adminsdk-…` →
     ołówek → dodać role „Firebase Admin” i „Service Usage Consumer” → Save. Odczekać ~5 min.
  3. GitHub → Settings → Secrets and variables → Actions → New repository secret:
     `FIREBASE_SERVICE_ACCOUNT_DEV` = cała zawartość JSON-a z pkt 1. Usunąć plik z dysku.
  4. `git push origin master` → workflow wdraża reguły na dev (jeśli skonfigurowano), potem na prod.
  5. Lokalnie: skopiować `.env.staging.example` → `.env.staging`, wpisać konfigurację aplikacji web
     projektu dev (Project settings → General → Your apps → Config), potem `npm run dev:staging`.
- [x] Stan repo potwierdzony 2026-09-26: `master` i `origin/master` wskazują na `f662830`.
  Czy ten commit zakończył deploy produkcyjny, trzeba potwierdzić w GitHub Actions.
- [ ] **O1 – bezpieczna kolejność wdrożenia (Claude decyduje, Codex może wykonać):** uruchamiać
  build z produkcyjną konfiguracją przed zmianami w Firebase. Dla zmian reguł wymagających
  nowego klienta przyjąć rollout expand/contract: najpierw reguły zgodne ze starym i nowym
  klientem, potem publikacja aplikacji, a dopiero później zaostrzenie reguł. Build przed
  deployem usuwa część ryzyka, ale osobne systemy Firebase i GitHub Pages nie są atomowe.

## 1. Bezpieczeństwo – pozostałe

- [x] S1 – podszywanie się pod imię/zdjęcie (reguły wymagają danych z tokenu Google)
- [x] S2 – podatności w zależnościach: runtime (to, co idzie do przeglądarki) = **0**.
  Zostało 5 „moderate” w zależnościach `firebase-tools` (CLI tylko do deployu/testów) – czekamy na Google.
- [x] **S3 – prywatność / RODO** (2026-09-26): polityka opisuje, co zostaje w przeglądarce (S10),
  i ręczną obsługę próśb o usunięcie: zgłoszenie przez „Zostaw wiadomość” lub mail z adresu
  konta Google, do miesiąca; w zakończonych losowaniach anonimizacja „Usunięta osoba” (D31,
  tam instrukcja krok po kroku). Regulamin i monetyzacja pozostają odrębnymi decyzjami.
- [x] **S10 – polityka prywatności: opis localStorage [Codex-ready]** (2026-09-26, Codex,
  zrecenzowane przez Claude'a; dopisana też sesja logowania Firebase)**:** zaktualizować PL i EN
  w `src/pages/privacyPolicy.ts`, żeby wymieniały szkic listu (do zapisu/odrzucenia), wybór
  języka i zapamiętanie otwarcia koperty. Nie zmieniać podstaw prawnych, retencji ani obietnic
  usunięcia bez decyzji właściciela; zgłosić Claude'owi każde miejsce, którego nie da się
  opisać jako faktu na podstawie kodu.
- [ ] S4 – ograniczenie klucza API Firebase w Google Cloud Console (referrery HTTP:
  `arturczopek.github.io`, `localhost`) i przegląd „Authorized domains” w Firebase Auth. (ręcznie w konsoli)
- [ ] S5 – App Check (reCAPTCHA) – opcjonalnie, utrudnia skrypty spoza aplikacji.
- [ ] S6 – CSP przez `<meta>` (GitHub Pages nie daje nagłówków) – ostrożnie z popupem Google i iframe YouTube.
- [x] S7 – usunięty zbędny `redirect_uri` w `useAuth`
- [ ] S8 – konto serwisowe z najmniejszymi uprawnieniami zamiast `firebase-adminsdk` (opcjonalnie)
- [x] S9 – sprawdzone w audycie 2026-09-26: jednorazowa migracja F14 została usunięta po wdrożeniu
  w commicie `458ba21`; aktualny `.github/workflows/deploy.yml` nie ma kroku migracji. Przy każdej
  kolejnej zmianie schematu wymagającej migracji dodać wersjonowany skrypt i testy do repo.

## 2. Testy – zakres w repo

- [x] W audycie 2026-09-26 statycznie policzono 154 deklaracje testów Vitest i 4 deklaracje Playwright.
  To inwentaryzacja kodu, nie wynik uruchomienia testów. Kategorie: reguły Firestore, serwisy,
  komponenty RTL, jednostkowe i E2E desktop/mobile.
- [x] CI (`ci.yml`) na PR i gałęziach; deploy wywołuje CI przed wdrożeniem
- [x] T7 (R11) – po naprawie mobile: zdjąć `fixme` z pełnego scenariusza E2E na telefonie i rozszerzyć test
  szerokości o strony po zalogowaniu (dziś sprawdza tylko stronę dołączania dla gościa – po B5 już się mieści,
  więc `test.fail` zdjęty). Po B1 `test.fail` z testu przeładowania zdjęty, doszedł test deep linku.

## 3. Stos – zrobione

React 19.3, MUI 9.4, Firebase 12, React Router 8.4, Vite 8.3 (Rolldown), Vitest 4.1, TypeScript 6.0,
ESLint 9.39 (flat config), i18next 26 / react-i18next 17, react-snowfall 2, npm zamiast Yarna,
bundle podzielony (aplikacja 60 kB + biblioteki w osobnych plikach), GitHub Actions na najnowszych wersjach.

Do zrobienia później (gdy dojrzeją):
- [ ] ESLint 10 – gdy `eslint-plugin-react` go obsłuży
- [ ] Vitest 5 – za kilka miesięcy (5.0 z 09.2026)
- [ ] TypeScript 7 (natywny kompilator, 07.2026) – gdy typescript-eslint obsłuży (dziś < 6.1)
- [ ] lazy-loading stron (React.lazy) – niewielki zysk, bo Firebase/MUI potrzebne wszędzie

## 4. Bugi (z audytu + znalezione przy testach E2E) – zrobione 2026-09-24

- [x] B1 – odświeżenie/deep link wyrzucały na /draws → jeden `AuthProvider` (kontekst) + trasy czekają
  na przywrócenie sesji; gość z linku do losowania → logowanie → wraca na to losowanie.
  Wylogowanie = pełne przeładowanie na stronę główną (inaczej następna osoba trafiłaby na losowanie poprzedniej).
- [x] B2 – `LoginPage` przekierowywał przez `window.location.href` (404 na GitHub Pages) → `<Navigate>`
- [x] B3 – webview Messengera/Instagrama/FB/TikToka: komunikat „otwórz w przeglądarce” + „Skopiuj link”
  na stronie logowania i dołączania; zablokowany popup → komunikat. **Świadomie bez `signInWithRedirect`**:
  na GitHub Pages authDomain (`*.firebaseapp.com`) to inna domena, a Safari/Firefox/Chrome bez cookies
  stron trzecich gubią wynik przekierowania. Ostateczne rozwiązanie: F9 (link mailowy).
- [x] B4 – po losowaniu własne życzenie widoczne i edytowalne pod wynikiem
- [x] B5 – „Zostaw wiadomość” tylko dla zalogowanych
- [x] B6 – prawdziwe liczniki; zdanie ze statystykami ukryte, dopóki oba < 2
- [x] B7 – `maxLength` + licznik znaków w życzeniu (2000) i wiadomości (1000); stałe w `models/`
- [x] B8 – wspólny snackbar (`useNotify`) zamiast `alert()`, polskie komunikaty; test pilnuje, że każdy
  użyty klucz `t('…')` jest w PL i EN (brakowało `createPage.errors.*`)
- [x] B9 – usunięty `redirectAfterLogin` (po B1 zbędny)
- [x] B10 – error boundary: strona „Ups!” z przyciskiem na stronę główną
- [x] B11 – wysyłka wiadomości próbuje też sąsiednich dni (reguły i tak przepuszczają tylko dzisiejszy dzień
  serwera, raz)
- [x] B12 – pole wiadomości w złotym stylu formularzy

## 5. Redesign „List do Mikołaja” + mobile – ZROBIONE (R0–R12 na master 09-24/25, Impeccable review zamknięte 09-26)

**Skąd:** Impeccable `critique` całej aplikacji = **20/40** (3 × P1: telefon 659 px na 375 px,
płaski wynik losowania, uciążliwa ścieżka zaproszenie → dołączenie; 2 × P2: dostępność, hierarchia).
Raport: `.impeccable/critique/2026-09-24T13-37-13Z__src.md`.

**Decyzje Artura:**
- Kierunek „przytulne święta”, konkretnie świat **„List do Mikołaja”** (wybrany na stronie decyzyjnej
  Impeccable zamiast wylosowanych „Pierników toruńskich”). Życzenie = list do Mikołaja, zaproszenie =
  pocztówka, wynik = zapieczętowana koperta otwierana stuknięciem (łamanie laku). Tło nocna zieleń
  świerku, powierzchnie z papieru listowego (ciepła biel, NIE kremowy pergamin), obwódka „świątecznej
  poczty lotniczej” (paski czerwono-zielone), lak czerwony tylko dla jednej głównej akcji, złoto znaczka
  dla stempli, granatowy atrament do tekstu na papierze. Statusy jako stemple pocztowe, uczestnicy
  jako znaczki, budżet jako znaczek „do 100 zł”. Pełny kontrakt: `.impeccable/surfaces/src.md`.
- Kolejność: **fundament najpierw** (motyw, telefon, dostępność), potem efekt „wow” wyniku i zaproszenie.
- Hasło: teraz „Udostępnij” wkleja link + hasło do jednej wiadomości; później link z kluczem (F14).
  Uwaga: hasło jest hashowane, więc da się je wkleić tylko zaraz po utworzeniu losowania
  (ekran sukcesu „Wyślij zaproszenie”); później wiadomość mówi „hasło poda organizator”.
- „Pokaż Mikołaja!” i teledysk „Dubstep Santa” na logowaniu **zostają jak są** (charakter aplikacji).
- Odbiorcy: szeroka publiczność (poprzednia wersja ~10 tys. osób) → język neutralny płciowo,
  bezpieczny dla rodziny i pracy, duże teksty i cele dotyku.
- Budowa od razu w kodzie (bez obrazków-makiet – brak generatora grafik).

**Plan (każdy punkt = osobny commit, weryfikacja: lint + typecheck + testy + E2E + zrzut desktop/telefon):**

Faza 1 – fundament
- [x] R0 – kontekst Impeccable do repo: `PRODUCT.md` + `.impeccable/surfaces/src.md`
  (`.impeccable/critique/` zostaje lokalnie)
- [x] R1 – motyw (`theme.ts`): tokeny palety, typografia (Nunito do UI + krój odręczny z polskimi
  znakami do imion/listów – wybrać), skala nagłówków (`responsiveFontSizes`), 3 role przycisków
  (główny lak / drugorzędny obrys / tekstowy), fokus, zaznaczenie, pasek przewijania z palety,
  kontrast AA; `lang="pl"`, tytuł karty przeglądarki; polska pisownia nagłówków (bez Title Case) w i18n
- [x] R2 – navbar (M1): poniżej 600 px tytuł + menu pod awatarem; „Pokaż Mikołaja!” zostaje;
  GitHub → stopka; pozycje jako przyciski (klawiatura, polskie `aria-label`)
- [x] R3 – układ i wspólne komponenty (M2, M4–M7): papierowe powierzchnie zamiast ciemnych kart,
  przyciski zawijane/pionowo na telefonie, marginesy, `minWidth: 0` + łamanie długich nazw,
  jedna lewa krawędź, nagłówki bez przeskoku h1 → h4
- [x] R4 – logowanie i strona dołączania dla gościa (M8, pkt 5 z oceny): pocztówka z jednym zdaniem
  „co to jest” + 3 kroki, film zostaje, `minHeight: 100dvh`. **Decyzja przy R4:** czy pokazywać
  gościowi nazwę losowania (dziś reguły wymagają zalogowania do odczytu losowania → trzeba by
  poluzować `allow get` dla dokumentu losowania, który i tak nie zawiera sekretów)
- [x] R5 – lista losowań: koperty klikalne w całości, stempel statusu, akcje „Dołącz”/„Stwórz”
  na górze (na telefonie w zasięgu kciuka), lepszy pusty stan
- [x] R6 – formularz tworzenia: poprawne limity w komunikatach (80 / 3 zamiast 200 / 30),
  opis opcjonalny, krótsze ostrzeżenie o haśle, przyciski na telefonie
- [x] R7 – śnieg i modale (M9, M3): śnieg za treścią, mniej płatków na telefonie,
  `prefers-reduced-motion`; modal Mikołaja z `aspect-ratio: 16/9`
- [x] R8 – dostępność i język: kontrast chipów/stempli, fokus na pierwsze błędne pole,
  Enter działa w modalach (prawdziwe formularze), formy neutralne płciowo
  („Nie masz jeszcze życzenia” zamiast „Nie podałeś…”), błąd gramatyczny w statystykach

Faza 2 – „wow”
- [x] R9 – strona losowania: po losowaniu wynik na górze jako koperta z lakową pieczęcią;
  stuknięcie → pęka lak, wysuwa się list „Kupujesz prezent dla” + imię odręcznie, znaczek budżetu,
  „Nie zdradzaj nikomu”, życzenie obdarowanego jako list (bez ruchu przy `prefers-reduced-motion`);
  własny list i uczestnicy zwinięci pod spodem. Organizator przed losowaniem: postęp
  „4 z 6 osób napisało list”, w oknie startu ostrzeżenie o osobach bez życzenia
- [x] R10 – zaproszenie jako pocztówka: główny przycisk „Udostępnij” (Web Share API, gotowa wiadomość:
  link, budżet, jak dołączyć; fallback: kopiuj), ekran „Wyślij zaproszenie” zaraz po utworzeniu
  (wtedy z hasłem); po dołączeniu od razu do pisania listu
- [x] R11 – E2E: nowe napisy, link brany z okna zaproszenia (przycisk kopiowania), gość otwiera
  `/join/…` przed zalogowaniem → po zalogowaniu wraca na dołączanie, zdjąć `fixme` z telefonu (T7),
  test szerokości także po zalogowaniu

Zakończenie (wymóg kontraktu Impeccable)
- [x] R12 – detektor Impeccable na zmienionych plikach + finish review (agent `impeccable-finish-reviewer`
  ze zrzutami desktop/telefon) + `DESIGN.md` (agent `impeccable-documenter`) + ponowne `critique`
  (cel: ≥ 30/40)

## 6. Funkcje

- [ ] **F0 – przejście na plan Blaze** (decyzja Artura: OK, gdy będzie potrzebny). Przy tej skali
  ~0 zł (te same darmowe limity + darmowy limit Functions), wymaga karty, brak twardego limitu –
  ustawić alert budżetowy (np. 5 zł). Potrzebny dla: F3, $4, losowania po stronie serwera.
  Zmiana: Firebase console → Upgrade (Artur, ręcznie). Po przejściu: Cloud Functions + deploy w workflow.
- [x] F1 – wykluczenia par (2026-09-24/25). Zostało: unikanie par z zeszłego roku (trudne: wyniki zna tylko
  obdarowujący, organizator ich nie widzi – D3/D8)
- [ ] F2 – anonimowy czat obdarowujący ↔ obdarowany
- [~] F3 – data i miejsce wymiany + „Dodaj do kalendarza” (.ics) zrobione (D12, D28). Zostały przypomnienia
  e-mail/push – wymaga serwera → Blaze
- [x] F4 – edycja, usuwanie losowania i opuszczenie (09-24), nowe hasło (09-25, D21), usuwanie uczestnika przez
  organizatora (09-26, `6109bb6`, D29). Po losowaniu stan końcowy: brak edycji/usuwania i ponownego losowania.
- [ ] F5 – organizator niebiorący udziału
- [ ] F6 – lista życzeń w strukturze: pozycje, linki, rozmiary, „czego nie chcę”
- [ ] F7 – status „prezent kupiony” / podziękowanie
- [~] F8 – Web Share + gotowa wiadomość (R10, D23) zrobione. Zostało: kod QR (np. na kartkę na lodówkę / spotkanie)
- [ ] **F9 – logowanie mailem** (Artur chce; nie wszyscy lubią Google). Rekomendacja Claude'a:
  **link logujący na maila (Firebase „Email link”, bez haseł)** – działa na darmowym planie
  (jest dzienny limit wysyłek – sprawdzić aktualny w dokumentacji), nie trzeba obsługiwać haseł i resetów,
  a przy okazji omija bug B3 (Google blokuje logowanie w przeglądarce Messengera/Instagrama, link z maila nie).
  Do zrobienia:
  - włączyć w Firebase console → Authentication → Sign-in method → Email/Password → „Email link” (Artur, prod + dev);
  - ekran „podaj e-mail” → wysłanie linku → dokończenie logowania po powrocie (`isSignInWithEmailLink`);
  - konta mailowe nie mają imienia → po pierwszym logowaniu zapytać o imię, `updateProfile`, odświeżyć token
    (`getIdToken(true)`), bo reguły biorą imię z tokenu (`tokenName()`);
  - ustawienie „jedno konto na adres e-mail”, żeby Google i link mailowy z tym samym adresem = to samo konto;
  - emulator Auth obsługuje linki mailowe (link pojawia się w logach emulatora) → da się testować E2E;
  - avatary robią `imię[0].toUpperCase()` (`ParticipantsSection`, `WinnerSection`, `JoinToDrawPage`) –
    przy pustym imieniu strona się wysypie (dziś reguły zawsze dają niepuste imię, więc to nie bug);
    przy F9 zabezpieczyć (`name?.[0]`).
  Alternatywy: e-mail + hasło (prostsze w kodzie, ale hasła/resety), Microsoft/Facebook (darmowe),
  Apple (wymaga płatnego konta Apple Developer, 99 USD/rok).
- [x] F10 – przełącznik języka w stopce (09-26, D27)
- [ ] F11 – PWA
- [ ] F12 – powtórzenie losowania z zeszłego roku
- [ ] **F13 – losowanie po stronie serwera / zaufany wynik (Claude-owned):** obecny `generatePairs`
  waliduje pełne przypisanie i zwraca poprawny wynik albo rzuca błąd. Reguły Firestore nie
  wymuszają jednak kompletnego bijektywnego wyniku od zmodyfikowanego klienta, a organizator
  widzi wszystkie pary w swojej przeglądarce. Rozważyć Cloud Function i serwerową walidację;
  wymaga decyzji o planie Firebase, koszcie i modelu zaufania.
- [ ] **F15 – panel admina: wiadomości od użytkowników w GUI** (pomysł Artura, 2026-09-25, na przyszłość).
  Dziś wiadomości z „Zostaw wiadomość” są w kolekcji `messages` (`{uid}_{rok}-{mies}-{dzień}`,
  pola `userUid`, `userName`, `message`, `date`) i czyta się je tylko w Firebase console.
  Do zrobienia:
  - kto jest adminem: custom claim `admin: true` (ustawiany raz skryptem z `firebase-admin`)
    albo lista UID w regułach; reguły: `allow list, get` dla admina (dziś tylko autor, `get`);
  - strona `/admin/messages` (trasa widoczna tylko dla admina): lista od najnowszych
    (`orderBy('date', 'desc')` + stronicowanie), imię, data, treść;
  - opcjonalnie: oznaczanie jako przeczytane (pole `read`, zapis tylko dla admina), filtr po dacie,
    licznik nieprzeczytanych w menu konta;
  - testy reguł: admin czyta wszystko, zwykły użytkownik nadal tylko swoje.
- [x] F14 – link z kluczem zamiast hasła (09-24, D7) (decyzja 2026-09-24: po redesignie): kto ma link, ten dołącza
  jednym stuknięciem; zmiana reguł Firestore + migracja istniejących losowań + testy
- [x] **F16 – ostrzeżenie przy usuwaniu uczestnika [Codex-ready]** (zrobione 2026-09-26 przez Codexa,
  zrecenzowane przez Claude; niecommitowane)**:** obecny tekst sugeruje utworzenie
  nowego linku. Wyjaśnić po polsku i angielsku, że odnowienie linku unieważnia tylko link, a nie
  hasło. Jeśli usunięta osoba znała hasło, organizator powinien również ustawić nowe hasło, aby
  uniemożliwić ponowne dołączenie. Nie zmieniać danych/credentiali automatycznie. Dodać test
  tekstu i zachowania okna potwierdzenia.
- [ ] **F17 – usuwanie dużego oczekującego losowania [P3]:** reguły ograniczają grupę do 100 osób,
  a usunięcie jest dozwolone tylko przed losowaniem. Przy bardzo gęstym zestawie wykluczeń
  pojedynczy batch może przekroczyć 500 zapisów. Niski priorytet; rozważyć tylko jeśli duże
  grupy są celem produktu, bo usuwanie partiami wymaga zmiany reguł i semantyki atomowości.

## 7. Monetyzacja

- [ ] $1 – przyciski „Znajdź na Allegro” / „Porównaj na Ceneo” przy życzeniu obdarowanego:
  wyszukiwanie z tekstu życzenia (per linia/pozycja), filtr ceny do budżetu losowania,
  owinięte w link partnerski (format deep-linka sprawdzić w panelu programu partnerskiego)
- [ ] $2 – przepisywanie wklejonych linków Allegro na partnerskie
- [ ] $3 – „pomysły na prezent do X zł” przy pustym życzeniu (kuratorowane listy)
- [ ] $4 – AI: opis zainteresowań → frazy produktowe (wymaga serwera do ukrycia klucza → Blaze)
- [ ] $5 – wymagania: oznaczenie linków partnerskich, polityka prywatności (S3), analityka kliknięć za zgodą,
  linki `rel="sponsored noopener"`
- [ ] $6 – inne: premium (wykluczenia, duże grupy, motywy), wersja firmowa/HR, „postaw kawę”

---

## Zrobione

- 2026-09-24 (noc): R0–R5 zrobione i wypchnięte na gałąź `redesign-list-do-mikolaja` (nie na master,
  żeby nie wdrażać połowy redesignu). Dalsza praca w Claude Code w chmurze według `REDESIGN-HANDOFF.md`
  na tej gałęzi (R6–R12). Lokalny `master` = `origin/master`. E2E nieuruchamiane od R3 (do poprawy w R11).

- 2026-09-24 (wieczór): Impeccable zainstalowany i użyty – `critique` (20/40), `init` (`PRODUCT.md`),
  wybór kierunku („List do Mikołaja”), plan redesignu R0–R12 w sekcji 5. Nic jeszcze nie commitowane.

- 2026-09-24 (popołudnie): wszystkie bugi B1, B3–B12 – 11 commitów od `652b7b6` do `a585e28`,
  **niewypchnięte**. 96 testów + E2E (desktop i mobile) zielone. Do zrobienia przez Artura: `git push`.
  Podgląd w panelu Claude'a: `npm run emulators` przez panel nie startuje (wychodzi od razu) –
  Claude uruchamia emulatory w tle przez `firebase emulators:exec` + skrypt podtrzymujący.

- 2026-09-24: produkcja wdrożona; trwałe emulatory, seed kont testowych, staging na projekcie dev,
  nowe README (commity `f3798e6`, `49523ba`, `36079de`, `d2766fe`). Artur dodał sekret
  `FIREBASE_SERVICE_ACCOUNT_DEV` i `.env.staging`; do zrobienia: push i sprawdzenie kroków staging w Actions.
  Zapis emulatorów przez Ctrl+C sprawdzony na Windowsie.

- 2026-09-23: audyt bezpieczeństwa pkt 1–6 i 8, migracja danych, tryb emulatorów, README.
- 2026-09-23/24: S1, S7, Firebase 12, npm, ESLint, testy (algorytm, serwisy, komponenty, E2E, CI),
  automatyczny deploy z migracją i regułami, Vite 8, React 19, MUI 9, React Router 8, i18next 26,
  TypeScript 6, podział bundla, akcje GitHub. Przy okazji naprawione B2 i złota ramka pola waluty.
