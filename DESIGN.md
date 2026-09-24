# Design: "List do Mikołaja"

The design system of Santa App. Who uses the app and why is in `PRODUCT.md`; the
direction brief is in `.impeccable/surfaces/src.md`. This file describes what was built,
so that new screens look like they belong.

## Idea

Secret Santa as Christmas mail. The wish is a **letter to Santa**, the invitation is a
**postcard**, the draw result is a **sealed envelope** that only its addressee opens.
Status is a **postmark**, a participant is a **postage stamp**. Everything sits on a
night-spruce ground with a little snow behind it.

What we avoid: a pile of identical dark cards with coloured status chips.

## Colours

All colours live in `tokens` in `src/styles/theme.ts`. Do not write hex values in
components. The only exceptions are the light postmark green `#8FD1A6` in `Postmark.tsx`
and the wax highlight in `SealedEnvelope.tsx`.

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `spruce` | `#0E2A1E` | page ground, navbar | – |
| `spruceRaised` | `#163A2A` | stamps, raised ground | – |
| `snow` | `#F5F1E8` | text on the ground | 13.6 on spruce |
| `snowMuted` | `#C9D2C8` | secondary text on the ground | 9.9 on spruce |
| `paper` | `#FBF8F2` | writing paper (warm white, not cream) | – |
| `paperShade` | `#F1EBDF` | flap, your own row, progress track | – |
| `paperLine` | `#DDD3C2` | dashed rules on paper | decorative |
| `ink` | `#1E2A44` | text on paper | 13.5 on paper |
| `inkMuted` | `#4F5A73` | secondary text on paper | 6.5 on paper, 5.8 on shade |
| `wax` | `#B3202A` | **one** main action per screen, seals | white on wax 6.7 |
| `waxDark` | `#8E1820` | hover of the main action | – |
| `stampGold` | `#D9A441` | focus ring, postmarks on the ground | 6.8 on spruce |
| `pine` | `#2A7549` | "done" states on paper, stripes | 4.7 on shade, 5.3 on paper |
| `amber` | `#8A5A00` | "waiting" states and warnings on paper | 5.0 on shade, 5.6 on paper |

Rules:
- Text on the ground is `snow`/`snowMuted`; text on paper is `ink`/`inkMuted`. Never put
  `wax` or `pine` text on the ground (below 3:1).
- Every text pair must reach WCAG AA (4.5:1). Check new pairs before using them.
- `stampGold` on paper is only 2.1:1, so use it on the ground only.

## Type

- **Nunito** (400–800) for everything you read or press. Sizes and weights come from the
  MUI theme (`h1` 2.25rem/800 down to `body2` 0.94rem). Buttons are 1rem/700, no caps.
- **Caveat** (`handFont`) for handwriting only: the brand, "Drogi Mikołaju,", the
  recipient's name, "Do: …" on the envelope, step numbers, the postcard greeting.
  Never use it for labels, buttons or long text.
- Both fonts come from Google Fonts in `index.html`, with system fallbacks.

## Layout

- One column, `CONTENT_MAX_WIDTH` = 640 px, gutters 16 px on phones and 24 px above
  (`layoutStyles.ts`). Every page shares the same left edge.
- A page starts with a snow-coloured `h1` on the ground and an optional `snowMuted`
  lead, then paper cards. Sections have a `SectionHeading` on the ground above the paper.
- Phones from 360 px: `document.documentElement.scrollWidth` must equal the viewport
  width (the E2E tests check this on every step).
- Buttons are at least 44 px tall. In forms the main action is on the right; on phones
  the buttons take the full width with the main action on top (`FormActions`).

## Building blocks

| Component | What it is |
| --- | --- |
| `PaperCard` | A sheet of writing paper. `airmail` adds the red-white-green striped edge. Use `airmail` once per screen, for the thing that matters most (the letter being written, the envelope, the postcard, the create form). With `onSubmit` it renders a `<form>`. |
| `airmailStripes` | The striped edge itself; also under the navbar and around the postcard. |
| `Postmark` | Draw status as a slightly tilted double-ring stamp. `tone` = `waiting` / `done`, `onDark` for the ground. |
| `StampAvatar` | A person as a perforated postage stamp with their photo or initial. |
| `SealedEnvelope` | The draw result before it is opened. The whole envelope is one button. |
| `InviteDrawModal` | The invite as a postcard with a ready message; "Udostępnij" uses the Web Share API, with "Kopiuj zaproszenie" as the fallback. |
| `PasswordField`, `FormTextField`, `FormSelect`, `FormActions` | Form parts on paper: white inputs with a warm grey outline, a navy focus outline, errors under the field. |
| `SectionHeading` | Section title on the ground. After the draw the participants heading is a toggle (`aria-expanded`). |
| `HowItWorks` | The three steps with handwritten numbers, for first-time visitors. |

## Motion

- Snow (`SnowfallEffect`) falls behind the content: 150 flakes, 60 on phones, none with
  `prefers-reduced-motion`.
- Opening the envelope takes about 1.1 s: the seal cracks (400 ms), the flap lifts
  (450 ms, from 250 ms), then the letter slides up (450 ms). With reduced motion the
  letter just appears. The envelope stays open on later visits (`localStorage`).
- Anything else moves only for feedback (hover, focus, expand), under 200 ms.

## Accessibility

- `lang="pl"`, MUI texts from `plPL`, every icon-only button and spinner has a Polish
  `aria-label`.
- The focus ring is 3 px `stampGold` with a 2 px offset, on every control.
- After a failed submit, focus goes to the first field that needs fixing. After the
  envelope opens, focus goes to the letter.
- Decorative stamps, seals and flaps are `aria-hidden`.

## Words

- Plain Polish, sentence case in headings ("Nowe losowanie", not "Nowe Losowanie").
- Neutral forms: talk to the person in the present tense ("Kupujesz prezent dla"), use
  "wszyscy", "osoby", impersonal forms, and avoid past-tense verbs that mark gender
  ("wysłałeś"). Role nouns ("Organizator", "Uczestnik") stay.
- The mail metaphor names things: list, koperta, zaproszenie, stempel. Messages say what
  happened and what to do next.
- The humour stays where it is: "Pokaż Mikołaja!" and the Dubstep Santa video.
