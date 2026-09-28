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

## D4. Google sign-in only, Superseded by D38
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

## D6. The password is stored only as a hash, and is needed to start the draw, Accepted (amended by D21)
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

## D9. Letters stay editable after the draw; the draw itself freezes, Superseded by D30
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

## D21. The organizer can set a new password, Accepted
Needing the password weeks later to start the draw (D6) turned a forgotten password into a
draw that could never start: the only way out was deleting it and collecting everyone's
letters again. The organizer is already signed in as the owner, so before the draw they can
set a new one ("Więcej" -> "Ustaw nowe hasło", or from the start dialog). The old password's
key is removed and the new one added in one batch; the invite link and everyone who joined
stay. The password still guards starting the draw and joining without the link.

## D22. Inside chat apps, getting into a real browser comes first, Accepted
Refines D5. The in-app browser notice used to sit under "Jak to działa?" and above an active
red Google button that was bound to fail, and the address to copy by hand appeared in a
snackbar for six seconds. Now the page leads with "Otwórz tę stronę w przeglądarce": three
steps with the real menu icons, "Kopiuj link" as the one red action, and the address in a
field that stays on screen. The Google button stays, secondary, in case the detection is
wrong. Opening Chrome directly with an Android `intent://` link was left out: with hash routes
the page's own `#` collides with the intent syntax, and it could not be tested on a real
phone.

## D23. The organizer announces the draw, with a ready message, Accepted
Without a server the app cannot tell anyone that the draw has happened (D1). So right after
the draw the organizer gets a postcard "Koperty już czekają!" with a ready message for the
group chat, and "Daj znać wszystkim" opens it again later. Before the draw a status line on
the draw page says who acts next, so the weeks of waiting are not silent.

## D24. The red action is the next step, chosen from the draw's state, Accepted
Refines D15. On the draw page before the draw the red button comes first in the action row
and follows the state: "Napisz list" while your own letter is missing, "Rozpocznij
losowanie" for the organizer once every letter is in, otherwise "Zaproś do losowania".

## D25. A letter being written is kept in the browser until it is saved, Accepted
Chat apps' browsers often reload the page after switching apps, which lost a half-written
letter. The draft is kept in `localStorage` per draw and person until it is saved or
discarded, comes back with "Przywrócono niezapisany szkic", and "Anuluj" asks before
throwing changes away. Like D13, this is a per-device convenience, not shared state.

## D26. Help sits next to the question, Accepted
A help page (`#/help`) answers the questions people actually ask, and screens link to the
one answer that fits (`#/help?q=password` next to the password note, `q=when` in the
participant's status line, and so on), so nobody has to search a manual.

## D27. Polish by default, English on request, Accepted
Refines D17. The English translation was complete but unreachable. A footer button switches
the language and remembers it in the browser; Polish stays the default for new visitors.

## D28. Reminders through the phone's calendar, Accepted
Without a server (D1) the app cannot send reminders. When a gift exchange date is set,
"Dodaj do kalendarza" downloads an .ics event with the place, the budget and a link back to
the draw, so the phone reminds people and brings them back.

## D29. The organizer can take someone out before the draw, Accepted
Someone joins by mistake, a link reaches a stranger, or a person drops out without leaving
themselves; until now the only fix was deleting the whole draw. Before the draw the owner
can remove one other participant: the list entry, the participant document, their letter
(deleted unread) and the exclusion pairs they were in go in one batch. The invite link is
not replaced automatically, because everyone else may still need it; the dialog says to make
a new one if the person should not come back.

## D30. Letters are frozen at the draw too, Accepted
Replaces D9 (decided by the author, 2026-09-26). A letter that changes after the draw means
the Santa may already have bought a gift from the old one, and a participant could rewrite
the wish once they know it is being read. So the letter is written and changed only before
the draw, like everything else about it: the rules refuse letter and `hasWish` writes once
the draw is `DRAWED`, the page shows the letter read-only with "Po losowaniu listu nie da się
już zmienić", and the start dialog warns that people without a letter will be too late.

## D31. Deletion requests are handled by hand; a finished draw keeps the person anonymised, Accepted
Decided by the author, 2026-09-26 (S3). Before the draw people delete their own data: a
participant leaves, the organizer removes someone or deletes the draw. After the draw the app
changes nothing (D30), so a request to delete personal data is done by the author in the
Firebase console, within a month, and answered when done. The request comes through "Zostaw
wiadomość" (the message carries the sender's uid) or by email from the address of the Google
account, which the author checks in Firebase Authentication. For that person:
- in every finished draw they took part in: delete `letters/{uid}` and `thanks/{uid}`; in `participants/{uid}` set
  `userName` to "Usunięta osoba", `userPhotoUrl` to "" and `hasWish` to false; if they are the
  organizer, do the same with `ownerName` / `ownerPhotoUrl` in the draw document. The uid stays
  in `participantUuids` and the assignments, so everyone else's result keeps working; once the
  account is gone it points to nobody;
- delete their documents in `messages` (`userUid`) and then their Authentication account.
An organizer can also ask to delete a whole finished draw (the document and all its
subcollections); it then disappears for every participant. The stored name is Polish only,
because it is data, not an interface string.

## D32. The organizer can opt out of the draw, Accepted
The organizer still stays in `participantUuids` and keeps their participant document, so
they can invite people, manage exclusions and start the draw. The optional `ownerPlays`
field defaults to `true` on older draws. When it is `false`, the owner does not write a
letter or receive an assignment; players are the participants except the owner. Pair
generation, exclusions, the minimum of two, letter progress and the app's winner counter all
use players. Firestore rules validate the field, enforce the minimum and reject assignments
to or from a non-playing owner.

## D33. The invite is also a QR code, Accepted
The browser draws the QR code from the invite link with qrcode-generator; no external
service receives the link. The code has the same access as the link, including joining
without the password, so it is only for people in the draw. Replacing the invite link
retires its QR code too.

## D34. Installable app without a service worker, Accepted
The web manifest and icons make Santa App installable from the browser menu or iOS share
sheet. Chrome supports installation without a service worker (Android 108+, desktop 112+),
so no automatic install banner is provided. A service worker could keep a stale app after a
GitHub Pages deploy, and offline use is not useful because the app needs Firebase. Manifest
URLs stay relative for the GitHub Pages sub-path. On iOS, the home-screen app has separate
storage, so people sign in again there; Google popup sign-in has not been verified on a real
iPhone. If it fails, change the manifest display mode to `browser`.

## D35. A structured letter to Santa, Accepted
The letter has short items and an optional comment. Items remain in the existing `wish` field,
joined with newlines; the app allows at most 10 items of 100 characters each, so existing
wish lines load as items without a migration. Empty items are dropped on save. The optional
`comment` is up to 1000 characters; older letters without it read as empty. Readers see the
items as a list and the comment separately, with explicit HTTP(S) URLs linked in either part.
`hasWish` is true when there is at least one item or a comment, and the entire letter remains
frozen after the draw (D30). Drafts use JSON `{ wish, comment }`; older plain-text drafts and
legacy F6 JSON drafts keep their wish and ignore obsolete fields. Only the short items may
later feed shop searches ([backlog $1](../BACKLOG.md)); the comment is never used for
automation or monetization.

## D36. Gift progress and private thanks, Accepted
After the draw, a player can mark `giftBought` on their own participant document; missing
means false. Participants see who has bought a gift and a count among players, never whom
anyone is buying for. A recipient can write up to 500 characters in `thanks/{uid}` for their
unknown Santa. Only its author and the Santa whose assignment points to them can read it;
the organizer cannot unless they are that Santa. The note can be edited after sending, and
there is no app delete. These changes do not alter assignments or letters.

## D37. The verified admin reads messages in the app, Accepted (refines D20)
The signed-in account with the verified token email `arturcz32@gmail.com` can list and read
all messages. Firestore rules enforce this; the same address in the client only controls
whether the page and navbar link are shown. Authors can still read only their own message,
and messages remain create-only for everyone: the page is read-only and has no read flag.
The page loads newest first in batches of 20. The privacy policy explains which account
details accompany a message and why.
New messages also store the author's account email (`userEmail`) so the admin can reply.
Create rules require it to match the token email, or an empty string when there is no email
claim; older messages without the field remain valid.

## D38. Sign-in by an email link as well as Google, Accepted (supersedes D4)
Not everyone has or wants a Google account, and Google refuses to sign in inside the browsers
built into Messenger or Instagram. Next to the Google button people can ask for a sign-in link
by email (Firebase "Email link", no password to keep or reset). The link comes back to the
app's own address without the `#/route`, so Firebase's parameters stay clear of the hash
routes; the address and the page to return to wait in this browser (`santa-app.email-sign-in`)
until the sign-in finishes, and the one-time code is then removed from the address bar. Opened
in another browser, the page asks for the address again. An account from an email link has no
name, so before anything else the app asks for one and refreshes the token, because the rules
take the name from it (`tokenName()`); the photo stays empty and the stamp shows the initial.
The rules did not change. The privacy policy says the only email sent is the sign-in link.

## D39. Optional support through buycoffee.to, Accepted
Santa App stays free. The footer and the draw page after the draw offer an
optional link to the author's buycoffee.to profile.
The app does not process payments or record clicks; visitors who follow the
link leave Santa App. The privacy policy names buycoffee.to as an external service
and no longer calls the project non-commercial.
