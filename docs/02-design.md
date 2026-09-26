# The design explained

What the app looks like, why, and what each screen puts first. This page is the reasoning.
The rules to follow when building a new screen (colours, type, components, tokens) are in
[DESIGN.md](../DESIGN.md); who the app is for is in [PRODUCT.md](../PRODUCT.md).

## The idea: Secret Santa as Christmas mail

A Secret Santa is already a story about letters and envelopes, so the app tells it that way
instead of as a stack of cards with coloured status chips (what most apps of this kind
look like, and what the previous version was).

| In the app | Is shown as | Why |
|---|---|---|
| Your wish | A **letter to Santa** ("Drogi Mikołaju,") | Everybody knows how to write one; it invites a real wish, not a keyword |
| The invite | A **postcard** with a ready message | It is literally what gets sent into the group chat |
| Your result | A **sealed envelope** only you open | The secret has a physical form; opening it is the moment the whole thing is for |
| The draw's status | A **postmark** ("Oczekuje na losowanie", "Rozlosowane") | Status at a glance, without another chip |
| A person | A **postage stamp** with their photo or initial | Participants read as a collection, not a table |
| The page | **Night spruce-green** with a little snow | Christmas evening, calm, and the paper stands out on it |

Paper surfaces are clean warm white (not parchment, not cream), with navy ink. The striped
red-white-green **airmail edge** marks the one thing that matters most on a screen: the
envelope, the postcard, the letter being written, the new draw form.

## One main action per screen

Sealing-wax red is kept for **the single thing to do next**. Everything else is outlined or
a plain text button. On the draw page before the draw it is the next step, first in the row:
**Napisz list** while your letter is missing, **Rozpocznij losowanie** for the organizer
once every letter is in, otherwise **Zaproś do losowania**. After the draw it is the envelope
itself. Inside Messenger it is **Kopiuj link**, because signing in cannot work there.

The rest follows the same thinking:

- Rare actions (edit, delete, leave) sit behind a quiet **Więcej**.
- Anything that cannot be undone asks first (delete, leave, start the draw) and says what
  will be lost.
- The start dialog lists who has no letter and which exclusions are set, so the organizer
  decides with everything in view.

## Screen by screen

**Login** (`#/`). A first-time visitor usually arrives from a link and has never heard of
the app. Inside a chat app's browser the page first gets them out of it ("Otwórz tę stronę w
przeglądarce"), since Google refuses to sign in there. The page answers "what is this?" before asking for anything: a plain headline
("Tajemniczy Mikołaj bez karteczek w czapce"), three numbered steps in handwriting, and only
then **Zaloguj przez Google**, with a note on what the Google account is used for.

**Invite** (`#/join/…`). Shows the draw before asking to join: who invites you, the name,
budget, date and place. With the invite link there is nothing to type, just one button.

**Your draws** (`#/draws`). Each draw is an envelope: waiting ones on plain paper, drawn
ones with the airmail edge and "otwórz kopertę" in red. The whole envelope is the link, so
it is easy to hit with a thumb.

**New draw** (`#/create`). One sheet of paper with the airmail edge. The password gets a
bold note with a key icon above the field, because a hint under it was easy to miss and a
forgotten password means the draw can never start.

**Draw** (`#/draw/…`). The draw's name is the page title, with its postmark, budget,
organizer, date and place under it (a long description folds on phones). Before the draw a
status line says who acts next. Then, top to bottom: the main actions, your result, your
letter, the participants (folded away after the draw), and the exclusions for the
organizer. Right after the draw the organizer gets a postcard "Koperty już czekają!" to send
to the group: the app has no way to notify anyone itself, so it hands the organizer the
message at the moment it matters.

**The result.** The emotional peak. A sealed envelope addressed to you fills the width of the
phone; tapping it cracks the wax seal, lifts the flap and slides the letter out: *Kupujesz
prezent dla* and the name in large handwriting, the budget as a line of its own, then the
recipient's letter, set larger than the rest because it is what the giver needs. It opens
once; later visits go straight to the letter, and the list says "Koperta otwarta".

## Words

- Pairs who do not draw each other are named that way ("Pary, które się nie wylosują"), not
  "wykluczenia"; the draw button says "Losuj pary".
- Plain Polish that works for a grandmother and for a team at work.
- **Gender-neutral forms**: the app talks to you in the present tense ("Kupujesz prezent
  dla"), uses "wszyscy", "osoby" and impersonal forms, and avoids past-tense verbs that mark
  gender ("wysłałeś"). Role nouns (*Organizator*, *Uczestnik*) stay.
- The mail metaphor names things: list, koperta, zaproszenie, stempel.
- Messages say what happened and what to do next ("Ten link już nie działa – organizator
  utworzył nowy. Wpisz hasło albo poproś o nowy link.").
- The humour stays where it was: **Pokaż Mikołaja!** and the Dubstep Santa video. They are
  part of the app's character; the rest of the copy stays calm.

## Phones first

- Every screen is built for a phone from 360 px wide, one-handed: one column, full-width
  buttons at least 44 px tall, the main action on top.
- The phone never scrolls sideways (end-to-end tests check it on every step).
- Built-in browsers of chat apps get their own explanation, because Google refuses to sign
  in there (see [D5](04-decisions.md)).

## Motion

- **Snow** falls behind the content: 150 flakes on a computer, 60 on a phone, only faintly
  over the content column so it does not drift across text at full strength, and none for
  people who turn on "reduce motion" in their system.
- **The envelope** takes about a second to open (seal, flap, letter). With reduced motion
  the letter simply appears.
- Everything else moves only as feedback (hover, focus, fold), under 200 ms.

## Help and language

- Help is one tap away from where a question comes up: a "?" link opens the one answer that
  fits on `#/help`, instead of a manual people have to search.
- The footer switches between Polish and English, named in the language it switches to.
- Errors stay on screen until closed; they say what to do next.

## Accessibility

For mixed ages on small phones:

- Every text colour pair meets WCAG AA contrast; the table in DESIGN.md lists the ratios.
- The focus ring for keyboard users is gold on the dark ground and **navy on paper**, where
  gold would be too faint.
- `lang="pl"`, Polish labels for every icon button, headings in order, real buttons and
  links, and "Przejdź do treści" before the navbar.
- Postmarks are 14 px in sentence case, not small capitals; only the organizer's row in the
  participants list carries a role.
- After a failed submit, focus moves to the first field to fix; after the envelope opens,
  to the letter.
- Decorative stamps, seals and flaps are hidden from screen readers.
