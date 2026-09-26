# How the app works (for the people using it)

Santa App runs a Secret Santa (*Tajemniczy Mikołaj*) without paper slips in a hat. Everybody
joins from their own phone, writes what they would like to get, and after the draw each
person sees only whom they buy a gift for, together with that person's wish.

This page walks through the app the way people meet it. The UI is in Polish, so screen and
button names are quoted in Polish. Why it looks the way it does is in
[the design explained](02-design.md), how it works inside is in
[architecture](03-architecture.md), and the reasons behind the choices are in
[decisions](04-decisions.md).

## Who uses it

The groups are unknown to us and very mixed: families across generations (grandparents
included), friends, coworkers, school classes. The previous version had about 10,000 users,
with a peak in November and December.

| Role | Who | Can |
|---|---|---|
| **Organizer** (*Organizator*) | Whoever creates the draw | Everything a participant can, plus: invite, edit the draw, set exclusions, remove a participant, start the draw, delete the draw (before the draw) |
| **Participant** (*Uczestnik*) | Everyone who joined | Write and edit their letter, invite others, leave the draw (before the draw), open their own result |
| **Guest** | Someone with a link who has not signed in | See what the app is and sign in; nothing about a draw until signed in |

The organizer is always a participant too: they write a letter and get a result like
everyone else.

**The most common path** is a participant who gets a link in a group chat (Messenger,
WhatsApp), opens it on a phone, often inside the chat app's own browser, signs in with
Google, joins, writes a letter, and comes back weeks later to see whom they buy for.
Everything is designed for that path first.

## The journey

### 1. The organizer creates a draw

*Twoje losowania* -> **Stwórz nowe losowanie** opens *Nowe losowanie*:

| Field | Required | Notes |
|---|---|---|
| Nazwa losowania | yes | Up to 80 characters |
| Opis | no | Gift ideas, house rules; up to 1000 characters |
| Budżet + Waluta | yes | PLN, EUR, USD or GBP |
| Data wręczenia prezentów | no | Today or later |
| Miejsce | no | E.g. "u babci Krysi, godz. 18:00" |
| Hasło do rozpoczęcia losowania | yes | At least 6 characters |

The password matters more than it looks: **the organizer needs it to start the draw**, and it
cannot be viewed later (the app only stores a hash of it). The form says so in a bold note
above the field. People who do not have the invite link can also join with it. A forgotten
password is not the end: the organizer can set a new one (see [Changing your mind](#changing-your-mind)).

After **Stwórz losowanie** the organizer lands on the new draw with the invite already open.

### 2. The invite goes out

The invite (*Zaproś do losowania*) is a postcard with a ready message: the draw's name, the
budget, the date and place if set, the link, and one line on how to join.

- **Udostępnij** opens the phone's share sheet (Messenger, WhatsApp, SMS…). On a computer,
  where there is no share sheet, the same button is **Kopiuj zaproszenie**.
- **Kopiuj link** copies only the link.
- The link carries its own key, so **people who open it join with one tap, without the
  password**. That is why the invite warns to send it only to the people in the draw.
- If the link got to the wrong people, the organizer can make a new one
  (*Utwórz nowy*). The old link stops working; people who already joined stay.

Any participant can open the invite and pass it on, but only the organizer can replace the link.

### 3. People join

Opening the link shows *Zaproszenie do losowania*:

- Not signed in: "Masz zaproszenie do Tajemniczego Mikołaja", what Secret Santa is (*Jak to
  działa?* in three steps) and **Zaloguj przez Google**. After signing in the person comes
  back to this same invite.
- Signed in: a postcard from the organizer (*Od: …*) with the draw's name, budget, date, place
  and description, and **Dołącz do losowania**. With the invite link that is all; with a
  plain link the password field appears.

After joining, the person lands on the draw page with the letter editor already open.

Other ways in: **Dołącz do losowania** on *Twoje losowania* accepts a pasted invite link.
Someone who already joined and opens the link again goes straight to the draw; someone who
opens a draw they are not in gets **Dołącz do tego losowania**.

**Opened inside Messenger or Instagram?** Google does not allow signing in inside those
built-in browsers, and that is where most invites are opened. There the page leads with
*Otwórz tę stronę w przeglądarce*: three short steps with the real menu icons, **Kopiuj link**
as the main button, and the page's address in a field that stays on screen in case copying
is not allowed. *Jak to działa?* and the Google button follow, the button marked as usually
failing there.

### 4. Everybody writes a letter to Santa

The letter (*Twój list do Mikołaja*, starting with "Drogi Mikołaju,") is the wish: what you
would like to get, up to 2000 characters. Only one other person will ever read it, the one
who draws you, and only after the draw.

- Before the draw the participants list shows who has a letter ready (*List gotowy*) and who
  does not (*Bez listu*). The organizer also sees the count: *Napisane listy: 4 z 6*.
- The letter **stays editable after the draw**, so a late or changed wish still reaches the
  Santa, who always sees the current version.
- A letter being written is kept in the browser until it is saved, so a reload does not lose
  it (*Przywrócono niezapisany szkic*), and *Anuluj* asks before throwing changes away.

### 5. The organizer sets pairs who do not draw each other (optional)

*Pary, które się nie wylosują* (in the code: exclusions) lets the organizer mark pairs who must not draw each other, e.g. a couple who
buy gifts together anyway. Only the organizer sees this section, and only before the draw.

- A pair works both ways: *Ania ↔ Bartek* means neither draws the other, and it is the same
  pair as *Bartek ↔ Ania*.
- The two fields (*Pierwsza osoba*, *Druga osoba*) never offer the same person twice or a pair
  that is already on the list, whichever field you start from.
- A pair that would make the draw impossible (e.g. in a group of two) is refused with an
  explanation; if people leave and the draw becomes impossible, the app names the pairs to
  remove.

### 6. The organizer starts the draw

While the draw waits, a line under its name says who acts next: participants read that the
organizer starts it once everyone has joined; the organizer sees whether letters are still
missing or all are in. The red button is always the next step: *Napisz list* while your own
letter is missing, *Rozpocznij losowanie* for the organizer once every letter is in, otherwise
*Zaproś do losowania*.

**Rozpocznij losowanie** appears once there are at least two people. The dialog shows:

- who has not written a letter yet (their Santa will have to guess),
- the current exclusions, with a link to change them,
- the password field (the one from step 1), with *Nie pamiętasz hasła? Ustaw nowe*,
- **Losuj pary**, which cannot be undone.

The draw makes one gift circle through everyone when it can (A -> B -> C -> A), never
pairing anyone with themselves or with someone they are excluded with.

Right after it the organizer gets *Gotowe! Pary wylosowane*: a postcard *Koperty już czekają!*
with a ready message for the group (link, budget, date and place), to share or copy. Nothing
else tells people the draw has happened, so this is the moment to send it. *Daj znać
wszystkim* on the draw page opens it again later.

### 7. Everybody opens their envelope

After the draw each person finds a **sealed envelope** addressed to them (*Do: …*) with a wax
seal and *Stuknij, aby otworzyć*. Tapping breaks the seal and the letter slides out:

- *Kupujesz prezent dla* + the recipient's name, large and handwritten,
- the budget (*do 100 PLN*), the date and place,
- the recipient's letter to Santa,
- *Ciii… To tajemnica*.

The envelope stays open on later visits on the same device (another phone shows it sealed
again, which is fine). After the draw the participants list folds away: the result matters
now, not who wrote a letter.

**Nobody sees any pair other than their own**, the organizer included (with one known
caveat for a technically skilled organizer, see [D3](04-decisions.md#d3-the-pairs-are-drawn-in-the-organizers-browser-accepted)).

## Changing your mind

| What | Who | When | Where |
|---|---|---|---|
| Edit name, description, budget, date, place | Organizer | Before the draw | *Więcej* -> *Edytuj losowanie* |
| Set a new password (people who joined stay, the invite link keeps working) | Organizer | Before the draw | *Więcej* -> *Ustaw nowe hasło*, or from the start dialog |
| Delete the draw (with all letters) | Organizer | Before the draw | *Więcej* -> *Usuń losowanie* |
| Leave the draw (the letter is deleted) | Participant | Before the draw | *Więcej* -> *Opuść losowanie* |
| Remove someone else (their letter and exclusion pairs go with them; the invite link still lets them back, so make a new one if they should not) | Organizer | Before the draw | The icon next to the name in *Uczestnicy* |
| Edit your letter | Everyone | Any time | *Edytuj list* |

After the draw nothing about the draw itself changes, so everyone's result stays valid.

## Everything else

- **Twoje losowania** lists your draws (also in the top bar, or in the account menu on phones) as envelopes: waiting ones say whether you still owe a
  letter, drawn ones (with the striped airmail edge) say "otwórz kopertę" until you have
  opened yours, then "Koperta otwarta". Once there are a few draws in the app, a line at the
  bottom shows the app-wide counts.
- **Pokaż Mikołaja!** in the top bar plays a random Santa video. It is the app's humour and
  stays on purpose, like the "Dubstep Santa" video on the login page (*Na rozgrzewkę*).
- **Zostaw wiadomość!** (signed-in people only) sends a message to the author, at most one a
  day, up to 1000 characters.
- **Pomoc** in the footer answers the common questions; screens link straight to the answer
  that fits (e.g. "Co, jeśli zapomnę hasła?" under the password note).
- **Polityka prywatności** in the footer says what data is used (name, photo and e-mail from
  Google, the letters), who sees it and for how long.
- **English / Polski** in the footer switches the language; the choice is remembered.
- **Dodaj do kalendarza** (when the organizer set a date) saves the gift exchange to the
  phone's calendar, with a link back to the draw.
- The account menu (your avatar, top right) has *Wyloguj*.

## Where the important things are

| Screen | Address | The one thing it is for |
|---|---|---|
| Login | `#/` | Understand what this is and sign in |
| Your draws | `#/draws` | Get to a draw; create or join one |
| New draw | `#/create` | Set up a draw (and remember the password) |
| Invite | `#/join/{id}?k={key}` | Join with one tap |
| Draw | `#/draw/{id}` | Before: write your letter, invite. After: open your envelope |
| Help | `#/help?q={topic}` | Find an answer, e.g. about a forgotten password |
| Privacy | `#/privacy` | Read how data is used |

On the draw page the order is always: the draw's name and details, the status line (before
the draw), the main actions,
**your result** (after the draw), **your letter**, the participants, and the exclusions
(organizer only).
