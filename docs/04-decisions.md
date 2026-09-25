# Decision log

Short records of *why* things are the way they are. Status: Accepted / Proposed /
Superseded. Newest at the bottom; add a new entry instead of rewriting an old one.

## D1. Firebase only, no server of our own, Accepted
A pet project with a seasonal peak should cost nothing and need no maintenance. Firebase
Auth + Firestore on the free Spark plan covers it; GitHub Pages hosts the app.
Consequence: the security rules are the backend and carry the logic ([architecture](03-architecture.md)).
Anything that needs a server (e-mail reminders, drawing on the server) waits for the
Blaze plan.

## D2. Hash routes (`#/draw/…`), Accepted
GitHub Pages serves static files only and answers unknown paths with 404, so a reload or a
shared link to `/draw/123` would break. With `#/draw/123` the server always serves
`index.html`. A useful side effect: the invite key after `#` never reaches any server (D7).

## D3. The pairs are drawn in the organizer's browser, Accepted
Without a server something has to shuffle, and the organizer's browser is the only one
allowed to start the draw. It writes each result into a document only the giver can read,
so after the draw no browser can see the whole result.
**Known trade-off:** a determined organizer could look at the pairs in the browser's
developer tools while the draw runs. Other participants cannot. The fix is drawing on the
server (a Cloud Function), which needs the Blaze plan (D1).

## D4. Google sign-in only, Accepted (for now)
Almost everyone has a Google account, and the name and photo come with it, so people
recognise each other in the participants list. The rules take the name from the Google
token, so nobody can join as someone else. Sign-in by an e-mail link is the planned
addition for people who do not want to use Google.

## D5. No redirect sign-in; explain chat-app browsers instead, Accepted
Google refuses to sign in inside the built-in browsers of Messenger, Instagram, Facebook or
TikTok, which is exactly where invite links get opened. Redirect sign-in does not help: on
GitHub Pages the sign-in domain (`*.firebaseapp.com`) is a different site, and browsers
that block third-party cookies lose the result of the redirect. So the app detects those
browsers and tells people, in plain Polish, how to open the page in their real browser, with
a "Skopiuj link" button. Sign-in by e-mail link (D4) would avoid the problem entirely.

## D6. The password is stored only as a hash, and is needed to start the draw, Accepted
The password guards the two important moments: joining without the link, and starting the
draw. Storing only `sha256(drawId + ":" + sha256(password))` means nobody, the app
included, can show it again, so the create form says in bold that it must be written down.

## D7. The invite link carries its own key, Accepted
Passing the password separately from the link, and typing it on a phone, was extra work
for every participant. The link now contains a random key (after `#`, so it never reaches
a server) that lets people join with one tap. The organizer can replace the link if it leaks; people who joined stay.
The key cannot start the draw; only the password can.

## D8. Letters live in their own collection, Accepted
Letters used to be a field of the participant documents, which every participant can read;
the app just chose not to show them. Now `letters/{uid}` is readable only by its author and,
after the draw, by the one person who drew the author. Participants see only whether a
letter is written.

## D9. Letters stay editable after the draw; the draw itself freezes, Accepted
A late or changed wish is exactly what the Santa needs to see, so the letter can change any
time. Everything else about the draw (details, participants, exclusions, results) is fixed
once it is drawn, so every result stays valid.

## D10. Exclusions: owner only, symmetric, stored once, checked for feasibility, Accepted
Couples and close family who buy gifts together anyway should not draw each other. A pair
works both ways and has one id (the sorted uids), so A-B and B-A cannot both exist; the
rules refuse a person paired with themselves or an existing pair. The form offers only
people who can still form a new pair, and refuses a pair that would make the draw impossible.
Only the owner sees exclusions, so they do not become gossip.

## D11. One circle through everyone when possible, Accepted
A single circle (A -> B -> C -> A) feels most like the hat: nobody ends up in a closed
swap with the person who drew them. When exclusions make a circle impossible the draw falls
back to any valid set of pairs, rather than failing.

## D12. The gift exchange date is today or later, checked in the app, Accepted
A past date makes no sense for a new draw. The calendar and the form refuse it; when editing
a draw, a stored date that has passed since may stay, so a name change does not force a new
date. The rules do not check it: "today" depends on the person's time zone, and a wrong date
harms nobody.

## D13. The opened envelope is remembered per device, Accepted
Opening the envelope is a one-time moment, but storing "opened" on the server would need
another collection and rules for a purely visual state. `localStorage` is enough: another
phone shows the envelope sealed again, which does no harm.

## D14. Visual direction "List do Mikołaja" (Christmas mail), Accepted
Chosen with the author on 2026-09-24 as the form of the "cozy Christmas" direction: letters,
postcard, sealed envelope, postmarks and stamps on a night spruce-green ground. The envelope
reveal is the memorable moment. See [the design explained](02-design.md) and
[DESIGN.md](../DESIGN.md).

## D15. One wax-red action per screen, Accepted
Red (sealing wax) marks the single next step, so nobody has to choose between two equally
loud buttons. On the draw page that is "Napisz list" until the letter exists, then "Zaproś".

## D16. The humour stays, Accepted
"Pokaż Mikołaja!" with random Santa videos and the Dubstep Santa video on the login page are
part of the app's character (confirmed by the author, 2026-09-24). The rest of the copy
stays calm and family-safe.

## D17. Polish, gender-neutral UI; English code and docs, Accepted
The users are Polish and very mixed, so the UI avoids forms that assume a gender
("wysłałeś") and uses present tense, "wszyscy", "osoby" and impersonal forms. English
translations exist, but there is no language switch yet. Code, commits and documentation are
in English.

## D18. Every push to `master` deploys, staging first, Accepted
Deploys should be boring. The workflow runs all tests, then updates the dev project's rules
and data (staging), then production's rules and data, and only then publishes the app, so
the app never runs against rules older than itself. Work that should not go live yet stays
on a branch.

## D19. Local testing on emulators with fake accounts, Accepted
Trying a Secret Santa needs several people. The Firebase emulators accept made-up Google
tokens, so `npm run emulators:seed` creates six accounts and two draws, and resets them on
every run; `window.__santaTest.signIn` signs in without a popup (emulator builds only).
The same mechanism drives the end-to-end tests. See the [README](../README.md#test-data-npm-run-emulatorsseed).

## D20. Messages to the author: one a day, read in the Firebase console, Accepted
"Zostaw wiadomość" is for feedback without giving out an e-mail address. One message per
person per day keeps it from being abused without a server. Reading them in an admin page
in the app is planned; until then they are read in the Firebase console.
