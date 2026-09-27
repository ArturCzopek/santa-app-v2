# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The general public in Poland: anyone who organizes or joins a Secret Santa (Tajemniczy Mikołaj).
The groups are unknown to us and very mixed: families across generations (including elderly
people), friends, coworkers, school classes and teams. The previous version had about 10,000 users.

Two roles:
- **Organizer** – creates a draw, invites people, starts the draw when everyone has joined.
- **Participant** – most often arrives from a link sent over Messenger/WhatsApp, on a phone,
  frequently inside the messenger's in-app browser, signs in with Google, joins, writes a wish,
  and later comes back to see whom they buy a gift for.

## Product Purpose

Run a Secret Santa draw without a hat full of paper slips: everyone joins from their own phone,
writes what they would like to get, and after the draw sees only their own recipient and that
person's wish. Success = the whole group joined, wrote wishes, and each person knows whom to buy
for and what, while the pairs stay secret.

## Positioning

Free, Polish-language, no install, one link per group. Wishes travel with the draw, so the giver
sees the recipient's current wish right next to the result.

## Operating Context

- The invite link is shared in group chats (Messenger, WhatsApp); opened mostly on phones,
  often in the in-app browser, where Google sign-in can be blocked (the app explains how to open
  it in a real browser).
- A draw has an organizer password. The invite link carries a separate random key and allows
  one-tap joining; participants can read and share the current invite link. The password can
  also be used to join and is required by the organizer to start the draw.
- Seasonal use: peaks in November–December.

## Capabilities and Constraints

- React 19 + MUI 9 + Vite, Firebase (Google Auth + Firestore), hosted on GitHub Pages
  (hash routes), no backend server; security lives in Firestore rules.
- Polish UI by default, with an English language switch whose choice is remembered in the browser.
- Current features: create/edit/delete a waiting draw; Google or email-link sign-in; password or invite-link
  joining; password and invite-key rotation; participant leave/removal; a private wish per
  participant (max 2000 chars); symmetric exclusions; organizer-started draw; a private result
  with the recipient's wish; optional gift-exchange date/place and calendar export; help and
  privacy pages; one feedback message per user per day; and "Pokaż Mikołaja" videos.
- Also: organizer-not-participating mode, a letter of short things plus a note, gift-bought
  status and thank-you notes, QR invites, installable app (PWA), an in-app admin inbox.
- Not yet: previous-year no-repeat, anonymous chat, push/email reminders, server-side drawing,
  or monetization. These are roadmap ideas, not committed product decisions.

## Brand Commitments

- Name in the app: "Santa App"; Christmas character (snow, red/green/gold, Santa).
- The humour stays: the "Pokaż Mikołaja!" button with Santa videos and the "Dubstep Santa" video on
  the login screen are part of the app's character (confirmed by the author, 2026-09-24).
- Chosen visual direction for the redesign: cozy Christmas ("przytulne święta").

## Evidence on Hand

- ~10,000 users of the previous version (author's statement). No testimonials, reviews, or
  statistics beyond the in-app draw/winner counters; do not invent any.

## Product Principles

1. The participant arriving from a messenger link on a phone is the primary path; it must work
   one-handed with no prior knowledge.
2. The result reveal is the emotional peak; the wish is what the giver actually needs.
3. Secrets stay secret: nobody sees pairs other than their own.
4. Language works for anyone in any group: plain Polish, gender-neutral phrasing, humour that is
   safe for family and work.
5. Keep it simple to run: Firebase only, trivial deploy.

## Accessibility & Inclusion

Mixed ages including elderly users on small phones: readable text sizes, WCAG AA contrast,
large tap targets, keyboard and screen-reader support with `lang="pl"`, respect reduced motion.
