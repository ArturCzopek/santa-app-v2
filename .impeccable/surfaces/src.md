---
version: 1
slug: "src"
primary_target: "src"
related_targets: []
---

# Surface brief: Santa App (whole app)

Scope: every screen of the app (login, join, draws list, draw page, create form, modals, navbar). Visitor mode: Operate (the login/join screens also have to explain the app to a first-time visitor).

Audience and job: see PRODUCT.md. Primary path = participant from a Messenger link on a phone: understand what this is → sign in → join → write a wish → later open the result.

Constraints: MUI 9 kept (theme + sx), Firebase, hash routes, Polish copy, WCAG AA, `prefers-reduced-motion`, phones from 360 px. Brand commitments: "Santa App" name, snow, "Pokaż Mikołaja!" + Dubstep Santa video stay.

Chosen direction: "List do Mikołaja" (Christmas mail). Memorable moment: breaking the wax seal on your envelope to find whom you buy for.

Order agreed with the user: foundation first (theme, phone layout, accessibility), then result reveal and invite/share flow.

Unresolved: display face for handwritten names (must support Polish diacritics; chosen at the theme step); whether participants get stamp-style avatars with Google photos.

## Direction contract

THESIS: Secret Santa as Christmas mail. The wish is a letter to Santa, the invitation is a postcard, the result is a sealed envelope only its addressee opens. Refuses the category default: a stack of identical dark cards with status chips.

OWN-WORLD: Night spruce-green ground with sparse snow behind content. Writing-paper surfaces in clean warm white (not parchment, not cream). Signature: a Christmas airmail border (red/green diagonal stripes) on the envelope, postcard and letter. Sealing-wax red only for the single primary action and seals; stamp gold for postmarks and highlights; ink navy for text on paper. Status as round postmarks, participants as perforated stamps, budget as a postage stamp.

STORY: A first-time participant sees a postcard inviting them to a named draw, joins, writes their letter to Santa, and on draw day breaks the seal on their own envelope: name, wish and budget in one place, secret kept.

FIRST VIEWPORT: Phone, drawn draw page. Draw name as a small return address at the top. An envelope fills ~85% of the width, addressed to the user, wax seal centred with "Stuknij, aby otworzyć". Opening: seal cracks, letter slides up: "Kupujesz prezent dla" + recipient's name in large handwriting, a postage stamp "do 100 zł", the recipient's letter below. Own letter and participant stamps sit folded underneath.

FORM: "List do Mikołaja", position 1 on the ordered list (IMPECCABLE'S PICK, chosen by the user over the rolled direction); seed key 6274c29b.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
