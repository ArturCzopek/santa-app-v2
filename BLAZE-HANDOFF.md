# Handoff: przejście na Blaze i funkcje serwerowe

Dla nowego wątku Claude Code (2026-09-29). Po skończeniu tej pracy usuń ten plik.

## Stan wyjściowy
- Kod na sezon skończony i wdrożony (master = origin, produkcja sprawdzona 2026-09-29): CSP (S6),
  klucz API ograniczony (S4 – pamiętaj o pułapce z `firebaseapp.com`), SEO (F19), „Secret Santa” (F20),
  kawa (\$7), e-mail przy wiadomościach (S11). Zasady współpracy: `AGENTS.md`; backlog: `BACKLOG.md`.
- Hosting: GitHub Pages (statyczny SPA, HashRouter). Firebase: Auth (Google + link z maila) i Firestore.
  Projekty: produkcja (`VITE_FIREBASE_PROJECT_ID`, `santa-app-v2`) i dev/staging (`santa-app-v2-dev`).
- Brak katalogu `functions/`; `firebase.json` ma tylko firestore + emulatory (auth, firestore).
- Deploy (`.github/workflows/deploy.yml`): testy → build → `firebase deploy --only firestore` na staging,
  potem na produkcję → GitHub Pages. Konta serwisowe w sekretach `FIREBASE_SERVICE_ACCOUNT(_DEV)`.

## Cel
Przejść na Blaze tanio i bezpiecznie, postawić Cloud Functions w repo i w workflow, potem dowozić
funkcje serwerowe od najlepszego stosunku wartości do nakładu. Artur chce **niskiego nakładu**.

## Krok 0 – Artur w konsoli (prowadzić za rączkę, jeden krok naraz)
1. Firebase Console → oba projekty (najpierw dev) → Upgrade → Blaze. Karta już podpięta.
2. Alert budżetu w Google Cloud Billing: np. 5 zł/miesiąc, powiadomienia 50/90/100%.
3. Uprawnienia konta serwisowego z deployu (dla functions): Cloud Functions Admin, Service Account
   User, Artifact Registry Writer, Cloud Build Editor (albo sprawdzić, czy obecne już wystarcza).
   Dobry moment na S8 (konto z najmniejszymi uprawnieniami) – zdecydować z Arturem.
4. Region: `europe-central2` (Warszawa) albo `europe-west1`; Firestore już ma swój region – sprawdzić
   i dobrać ten sam lub najbliższy.

## Krok 1 – infrastruktura (Codex po decyzji Claude'a)
- `functions/` w TypeScript (Node 22/24, firebase-functions v2), region jak wyżej, `firebase.json`
  z functions + emulator functions; `npm run test` i E2E muszą dalej działać na emulatorach.
- Workflow: deploy functions na staging i produkcję (`--only firestore,functions`).
- ADR w `docs/04-decisions.md` (Blaze, region, model kosztów, alert budżetu).

## Proponowana kolejność funkcji (do potwierdzenia z Arturem)
1. **F13 – losowanie na serwerze** (callable function): serwer losuje z `generatePairs`, zapisuje
   `assignments`, organizator nie widzi par; reguły zabraniają klientowi zapisu przypisań. Największa
   wartość (znika kompromis D3/D8). Wymaga decyzji Claude'a o regułach i migracji trwających losowań.
2. **S5 – App Check** (reCAPTCHA Enterprise / v3): mały nakład, ale nowy dostawca Google z ciasteczkami →
   zmiana polityki prywatności i CSP (`www.google.com`, `www.gstatic.com`, recaptcha frame).
3. **F3 – przypomnienia e-mail** (scheduled function, np. 7 dni i 1 dzień przed `eventDate`): potrzebna
   usługa pocztowa (np. Resend/Brevo, darmowy próg) i klucz w Secret Manager; bez własnej domeny maile
   mogą trafiać do spamu – rozważyć razem z F21. Zgoda/wypisanie + polityka prywatności.
4. **F18 – własny mail logowania** (`generateSignInWithEmailLink` + ta sama usługa pocztowa) – sens
   głównie z własną domeną (F21).
5. **F2 – anonimowy czat** – największy nakład (reguły, UI, moderacja); na koniec albo wcale.

## Zasady
- Reguły Firestore, model danych, polityka prywatności i CSP = decyzje Claude'a; testy reguł na emulatorze.
- Każda funkcja: opis dla Artura przed kodem („Before implementing a backlog item” w `AGENTS.md`),
  delegacja do Codexa, przegląd i walidacja przez Claude'a, jeden commit na funkcję, push robi Artur.
- Codex nie ma sieci w sandboksie: `npm install` nowych pakietów (firebase-functions, firebase-admin)
  robi Claude przed przekazaniem zadania.
