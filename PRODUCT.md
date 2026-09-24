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
- A draw is protected by a password chosen by the organizer; today the password is passed on
  separately from the link. Planned: the share message carries link and password together; later
  a link that carries its own key (no typing).
- Seasonal use: peaks in November–December.

## Capabilities and Constraints

- React 19 + MUI 9 + Vite, Firebase (Google Auth + Firestore), hosted on GitHub Pages
  (hash routes), no backend server; security lives in Firestore rules.
- Polish UI (English translations exist; no language switch yet).
- Current features: create draw (name, description, budget, currency, password), invite link,
  join with password, wish per participant (max 2000 chars), start draw (organizer, password),
  result with the recipient's wish, feedback message to the author, "Pokaż Mikołaja" videos.
- Not yet: editing/deleting draws, leaving a draw, gift exchange date, exclusions, reminders,
  privacy policy.

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
