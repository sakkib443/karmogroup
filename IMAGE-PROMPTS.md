# Karmo — AI image prompts

Prompts for generating the homepage imagery in Midjourney, DALL·E (ChatGPT),
Adobe Firefly, Google Imagen or similar. Generate, download, then hand the
files back and they get placed and optimised in the site.

## How to use

1. Pick a section below.
2. Paste the **House style** line first, then the section prompt (or paste them
   together — the house style keeps every image looking like one set).
3. Add the aspect ratio for that slot (see the table).
4. Generate 3–4 variations, keep the best.

**Read before generating**

- These are for **mood / lifestyle / hero / background** shots. For the actual
  **product cards** (Best Sellers, specific mattresses and foam grades), real
  product photography is better — an AI mattress will not match the real one.
- Ask the tool for **no text, no logo, no watermark, no brand names** — the
  brand mark is added in the design, not baked into the photo.
- Karmo's accent is a single red (#e60000). Keep it to a small accent (a
  cushion, a thin line, a detail) — not a red-dominated image.

## House style — paste this into every prompt

> warm editorial interior photography, soft natural window light, calm and
> premium mood, muted warm-neutral palette (linen, oatmeal, warm grey, walnut
> wood, off-white) with one small deep-red accent, shallow depth of field,
> shot on a 50mm lens, fine detail, photorealistic, clean and uncluttered, no
> text, no logo, no watermark, no brand names

## Aspect ratios by slot

| Slot | Ratio | Midjourney flag |
|---|---|---|
| Hero slides | 16:9 (wide) | `--ar 16:9` |
| Division / Spotlight cards | 4:3 | `--ar 4:3` |
| WhyKarmo feature + background | 4:3 | `--ar 4:3` |
| Best Sellers product cards | 3:4 (portrait) | `--ar 3:4` |
| Journal / blog thumbnails | 3:2 | `--ar 3:2` |
| Gallery tiles | mixed 3:4 and 4:3 | `--ar 3:4` / `--ar 4:3` |
| Division wall (under the hero) | four different ratios — see section 2 | |

Leave the **left third empty** on every hero slide — the headline sits there.

---

## 1. Hero — four slides (16:9, wide, cinematic, LEFT THIRD EMPTY for the headline)

The hero runs one slide per division. Generate all four at 16:9, same grading,
so the slider reads as one set. The build-in animation cuts the picture into
vertical panels, so keep the composition simple — a busy image fights the
reveal. **Each slide's image must show its own division** (Home 01's foam/
mattress images were swapped before this; don't repeat that).

**Slide 1 · Foam — "Comfort that starts within"**
> Wide cinematic shot of a calm, upscale living-room corner at golden hour, a
> low linen-and-bouclé sofa with deep plush cushions catching warm side light,
> a walnut side table, soft shadows, one small deep-red cushion as the only
> colour accent, the whole left third of the frame open and empty for a
> headline, shallow depth, editorial and premium.

**Slide 2 · Mattress — "Rest, built to last"**
> Wide cinematic shot of a serene minimalist bedroom at soft dawn, a thick
> quilted mattress on a low walnut platform bed, crisp white bedding, sheer
> curtains glowing with morning light, deeply restful and premium, the left
> third of the frame open and empty for a headline, calm muted palette.

**Slide 3 · HomeTex — "The finishing layer"**
> Wide cinematic shot of a beautifully dressed bed layered with silky sateen
> sheets, a soft comforter and stacked pillows in a warm neutral bedroom,
> gentle morning side light raking across the fabric to show texture, rich and
> inviting, the left third of the frame open for a headline.

**Slide 4 · Chemicals & Polymers — "The chemistry of comfort"** (new — needed
to complete the four divisions)
> Wide cinematic shot of a clean modern plant interior, pale polyurethane foam
> sheets stacked precisely beside a row of neat brushed-metal canisters on a
> stainless surface, cool technical light with one warm edge, premium
> industrial mood (not gritty), the left third of the frame open and empty for
> a headline.

---

## 2. Division wall — four plates (homepage, straight under the hero)

The picture wall that fills the screen below the hero. Two columns of two: the
left column is wider and splits 58/42, the right splits 40/60, so the four
plates are four different shapes and the seams do not line up. **Each plate
needs its own ratio** — this is the one place on the site where a single ratio
will not do.

| Plate | Position | Slot at 1920×1080 | Generate at | Midjourney |
|---|---|---|---|---|
| Foam | left, top (widest, tall) | 1091 × 564 | 2:1 — 2048×1024 | `--ar 2:1` |
| HomeTex | left, bottom (wide strip) | 1091 × 408 | 8:3 — 2048×768 | `--ar 8:3` |
| Mattress | right, top | 823 × 389 | 2:1 — 1664×832 | `--ar 2:1` |
| Chemicals | right, bottom (tallest) | 823 × 583 | 7:5 — 1680×1200 | `--ar 7:5` |

The plate sizes move a little with the window — Foam runs 1.78:1 to 1.99:1
across common laptop and desktop widths, HomeTex 2.46:1 to 2.74:1. The ratios
above are the middle of each range.

**Two things to respect on every plate**

- The plate crops to fill (`object-cover`, centred). Keep the subject inside
  the **middle 80%** of the frame — anything near an edge can be cut.
- A small caption — number, division name, one line of trade — sits **bottom
  left** over a dark gradient covering the lower half. Keep the **bottom third
  calm and free of detail**, or the label lands on top of something.

Simple over lavish, on all four: one subject, a real room or bench behind it,
even daylight, nothing styled to within an inch of its life.

**Plate 1 · Foam** (2:1)
> A plain workshop bench in even daylight, three cleanly cut blocks of pale
> upholstery foam stacked square on it, one linen cushion leaning against the
> stack, a bare warm-grey wall behind with nothing hanging on it, one small
> deep-red detail low in the frame — a thread spool or a scrap of red leather,
> simple and still, uncrowded, the bottom third of the frame calm and free of
> detail.

**Plate 2 · HomeTex** (8:3, a long strip — compose it left to right)
> A wide unhurried flat lay across a pale linen surface, a folded quilted
> comforter, a folded bed sheet and two plain pillows laid in a row with space
> between them, soft even daylight from one side, fabric texture visible but no
> busy pattern, one narrow deep-red stripe on a single folded edge, plenty of
> empty surface around the pieces, the bottom of the frame quiet.

**Plate 3 · Mattress** (2:1)
> A simple bedroom corner in soft daylight, one thick quilted mattress on a low
> plain bed frame, crisp white bedding folded back once, a bare wall and a
> single small bedside lamp, nothing decorative in the room, calm and restful
> rather than luxurious, the bottom third of the frame plain.

**Plate 4 · Chemicals** (7:5, the squarest of the four)
> A clean plant bench in cool even daylight, a short stack of pale polyurethane
> foam sheets, two plain brushed-steel sample tins and a glass beaker of clear
> resin arranged simply on a stainless surface, the machinery behind soft and
> out of focus, precise and technical but not cold, no clutter, the bottom of
> the frame kept simple.

---

## 3. Divisions — four cards (4:3)

**Foam**
> Stacked blocks of high-density upholstery foam in a clean, bright workshop
> setting, precise cut edges, one block resting on a linen sofa cushion to show
> use, warm daylight, industrial-but-premium feel.

**Mattress**
> A cross-section beauty shot of a quilted pocket-spring mattress edge on a
> walnut bed frame in a calm bedroom, showing the plush top layer and firm
> support, soft directional light.

**HomeTex**
> A flat-lay of folded premium bed linen and a soft pillow on an oatmeal
> surface, subtle floral-print sheet, warm neutral tones, one thin red seam as
> an accent, top-down soft light.

**Chemicals & Polymers**
> A clean modern industrial detail — pale polyurethane foam sheets and neat
> canisters on a stainless surface in a bright plant, precise and technical,
> cool neutral light with a warm edge, no clutter.

---

## 4. Spotlights — three rows (4:3)

**Mattress — "We test every mattress"**
> Close-up of a hand pressing gently into the quilted surface of a premium
> mattress, showing the give and rebound of the foam, soft window light,
> shallow focus, calm and reassuring.

**HomeTex — "Where comfort meets elegance"**
> An elegant bed made up in silky sateen bedding with layered cushions in a
> refined warm bedroom, morning light, luxurious and inviting, quiet colour
> palette with a single deep-red detail.

**Chemicals — "The world of polyurethane"**
> An abstract macro of pale polyurethane foam texture and a footbed/insole
> resting on it, studio light, clean technical beauty shot, neutral tones.

---

## 5. WhyKarmo — "Where comfort begins" (4:3)

**Feature image**
> A warm family moment in a comfortable bedroom — soft focus, two children
> relaxed on a big quilted mattress, gentle daylight, genuine and heartwarming,
> premium but lived-in.

**Background (used dark, low opacity)**
> A quiet, softly-lit bedroom interior with a made bed and warm textures,
> muted, plenty of dark shadow area so text reads on top, cinematic and calm.

---

## 6. Best Sellers — product cards (3:4, portrait)

> Real product photos are strongly preferred here. If AI stand-ins are needed
> while real shots are arranged:
> A single hero mattress on a simple walnut platform bed against a warm plain
> wall, centred, even studio-daylight, catalogue style, lots of clean space
> around the product, one soft shadow.

## 7. Journal — blog thumbnails (3:2)

> Editorial lifestyle images matching each article topic — e.g. for a foam
> article: a detail of foam layers in warm light; for summer bedding: light
> breathable sheets by an open window; for plant/testing: a clean workshop
> detail. Same warm-neutral house style throughout so the carousel reads as one
> set.

---

## 8. Trust strip — four tiles (4:3, homepage, straight under the hero)

The four claim tiles. The reference the client sent is a different art
direction from the rest of this document: a **product cut out on a flat pastel
field**, with the type in the empty half — not a room photographed with text
laid over it. Both work; they do not mix. Pick one for all four.

**Option A — match the reference** (flat field, what the tiles are built for)

Paste this instead of the house style, and keep the four fields distinct but
adjacent — a set, not four unrelated colours.

> studio product photograph on a flat single-colour background, soft even
> light, one long soft shadow, the subject placed to one side leaving a clean
> empty half for text, calm premium retail styling, no props, no text, no logo,
> no watermark

| Tile | Field | Subject |
|---|---|---|
| 01 · A legacy of 60 years | warm blush `#f6ece6` | a single upholstered armchair, three-quarter view, left of frame |
| 02 · Trusted by families | pale sage `#dfe7e2` | a stack of two folded comforters and one pillow, right of frame |
| 03 · Market leader in foam | soft oat `#ece7e0` | three cleanly cut blocks of pale foam stacked square, left of frame |
| 04 · Stockists nationwide | dusty blue `#dfe4ec` | one rolled mattress standing upright, right of frame |

**Option B — keep the house style** (what is on the page now)

Use the house style at the top of this file, 4:3, and add: *the subject held to
one half of the frame, the other half quiet wall or floor, the bottom third
free of detail* — the claim sits bottom right over a dark scrim, so it needs
somewhere calm to land.

Whichever is chosen, the four must be **shot the same way** — same light, same
distance, same field. The current stand-ins are four different interiors and
that is the main reason the strip does not yet read as one row.

---

## 9. Home 02 — hero background (one image, 16:9)

One picture behind the whole hero, with the headline set over its left side.

### The size, and why

Home 02's header is opaque and holds 182px of its own, so the hero is what is
left of the window under it. That box is wider than it is tall, and it changes
shape with the screen:

| Screen | Hero box | Ratio |
|---|---|---|
| 1920 × 1080 | 1920 × 898 | 2.14 : 1 |
| 1600 × 900 | 1600 × 718 | 2.23 : 1 |
| 1536 × 864 | 1536 × 682 | 2.25 : 1 |
| 1440 × 900 | 1440 × 718 | 2.01 : 1 |
| 1366 × 768 | 1366 × 586 | 2.33 : 1 |

**Generate at 16:9 — 2560 × 1440.** That is 1.78:1, narrower than the
narrowest box in the table, which is the whole point: `object-cover` then
trims **only the top and bottom** and never the sides. The composition here is
left-to-right — plants one end, sofa the other — so losing the sides would lose
the picture.

**Keep everything that matters inside the middle 75% of the height.** Between
76% and 89% of the frame's height survives depending on the screen, cropped
from the centre. The top and bottom bands are wall and floor, and they are
meant to be sacrificial.

**Leave the left third quiet.** The headline sits there. Plants are welcome —
they are soft and read as texture behind type — but nothing with hard edges or
high contrast.

### The prompt

Paste the house style from the top of this file first, then this. Ask for
**no text, no logo, no watermark, no brand names**.

> A wide, well-appointed living room in warm afternoon light, the wall behind
> painted a soft pale butter yellow with a chalky matt finish. On the **right
> half of the frame**, a low three-seat sofa in oatmeal linen seen at a slight
> angle, deep and generously cushioned, dressed with a stack of linen and
> bouclé cushions and one small deep-red velvet cushion as the only strong
> colour; beside it a walnut side table carrying a ceramic lamp and a stoneware
> vase, and behind it a low walnut sideboard with a few books and a shallow
> bowl. On the **left**, two potted plants — one tall fiddle-leaf in a raw
> terracotta pot on the floor, one smaller trailing plant on a low stool — with
> plenty of empty wall between them and the sofa. A flat-weave wool rug on a
> pale oak floor. Tall window out of frame to the left casting long soft
> daylight across the room, gentle shadows, no direct sun patch. Richly and
> deliberately decorated but not cluttered — every object placed, nothing
> stacked. The **left third of the frame is open wall and plant, free of any
> hard-edged object**, and the top and bottom eighth of the frame carry nothing
> but wall and floor. Warm neutral palette — linen, oatmeal, walnut, pale oak,
> soft butter yellow — with the single deep-red cushion. Shot on a 35mm lens at
> eye level, wide and calm, editorial interior photography, photorealistic,
> fine detail.

`--ar 16:9` for Midjourney; 2560 × 1440 elsewhere.

### After it arrives

Hand it over and it gets cropped, compressed and wired in. Expect roughly
250–400 KB as AVIF or WebP at 2560 wide — a raw PNG export of this size runs
8–10 MB, which is the single biggest thing slowing this site down.

**One thing this image cannot do:** on a phone the hero box turns portrait,
and a 16:9 picture cropped to that keeps only its middle third — the sofa or
the plants, not both. A second, upright version of the same room is the fix
when the time comes. One image is fine while the design is being settled.

---

## 10. Home 02 — collections cutouts (3 images, transparent background)

Three product cutouts for the collections showcase under the hero — Best
Selling, Popular, New Arrival. The slot currently holds Home 01's lifestyle
photography as a stand-in; what it actually wants is the product alone, the
way a catalogue tile shows it, not a room around it.

**This is a different kind of shot from everything else in this file.** Every
other prompt here is a full scene — a room, a workshop bench, daylight from a
window. This one is the opposite: **one product, isolated, nothing behind
it.** Ask explicitly for a transparent background (PNG) or, if the tool cannot
do transparency, a flat pure-white or pure-black seamless studio background
that is trivial to key out afterwards — either works, transparency just saves
a step.

**Keep the house style's palette and light even in isolation** — the same
warm-neutral fabrics and walnut tones, the same soft directional light, so the
three cutouts still look like they belong to the same set as the rest of the
site once they are dropped onto a card.

**No text, no logo, no watermark, no brand names, no mannequin or hand
holding the product** — product only.

### The prompt (paste the fragment for each slot after this shared opening)

> Studio product photography of {PRODUCT}, isolated on a seamless pure white
> background, shot straight-on at a slight three-quarter angle, soft
> diffused daylight-balanced studio light from the upper left, one soft
> contact shadow directly beneath the product and no other shadow, warm
> neutral fabric tones (linen, oatmeal, wine-red), fine fabric texture and
> stitching detail visible, catalogue-quality, photorealistic, no props, no
> surface, no reflection, no text, no logo, no watermark, no brand names.

| Slot | {PRODUCT} | Aspect |
|---|---|---|
| Best Selling | *A folded wine-red quilted comforter, corner peeled back to show the quilting pattern and the cream underside* | 4:5 |
| Popular | *A neatly folded stack of soft grey bedding — a fitted sheet, a duvet cover and two pillows — with one deep-red embroidered cushion resting on top* | 4:5 |
| New Arrival | *A folded floral block-print bed sheet, one corner unfolded and draped forward to show the print and the drape of the fabric* | 4:5 |

`--ar 4:5` for Midjourney; roughly 1600 × 2000px elsewhere. Portrait, because
the tile it lands in is portrait on every screen narrower than `lg`.

### After it arrives

Three PNGs, ideally with real alpha transparency. Handing them over gets them
cropped tight to the product (a wide margin of transparent canvas around a
small product just wastes file size), compressed, and wired into
`CollectionsShowcase.jsx` — at which point the tile itself changes too: a
flat field colour behind the product instead of `object-cover`, matching the
flat-card style the client's own reference uses. That swap is roughly six
lines once the files exist; there is no point making it before they do, since
`object-contain` on today's full-room photographs would just float a
rectangular photo in a coloured box, which looks like a mistake rather than a
product.

---

## 11. Home 02 — collections centrepiece (sofa + foam, flat field)

The middle column of the collections showcase, rebuilt from Karmo's own
campaign poster: the modular sofa above, a stack of Karmo 2001 foam blocks
below and to the right, on one flat colour.

### Two things to get right before the prompt

**Ask for the background in `#F8FAFC`, not white.** That is the exact colour
of the section this lands in. Match it and the picture stops looking like a
photograph pasted into a card and starts looking like a product floating on
the page — the same effect as a transparent cutout, with none of the work.
Any flat colour will do if it is *exactly* the tile's; a near-miss is worse
than white, because a faint rectangle edge is more obvious than an honest one.

**Ask for no lettering at all.** The poster has "KARMO 2001" embossed into
every foam block. Image generators cannot spell — the last family shot came
back with `NOW PLIVIS FEOR / ASC PREKRR` across a t-shirt. Order the foam
plain; if the embossing is wanted it gets added in design afterwards, where it
will be legible and correctly spelled.

### The prompt

> A studio product composition on a completely flat, seamless, single-colour
> background in soft off-white `#F8FAFC`, no gradient and no vignette. In the
> upper half, a low modular three-seat sofa seen straight on: three separate
> seat cushions in soft lavender-purple upholstery foam, a continuous
> oatmeal-linen backrest and two thick rolled oatmeal-linen arms, carried on a
> slim matte-black tubular steel frame with thin straight legs. Below it and to
> the right, a neat staggered stack of five rectangular lavender-purple foam
> blocks, each with a plain smooth face and softly rounded edges, offset like a
> flight of steps so every block's depth is visible. Even, soft studio light
> from the upper left; one gentle contact shadow under the sofa and one under
> the foam stack, nothing else. Nothing else in the frame — no floor line, no
> wall, no props, no plants, no reflections. Photorealistic product
> photography, crisp fabric and foam texture, catalogue quality. **No text, no
> lettering, no numbers, no logo, no watermark, no branding of any kind on the
> foam or the fabric.**

`--ar 4:5` for Midjourney; roughly 1600 × 2000px elsewhere. Portrait, because
the tile it sits in is taller than it is wide at every screen size.

### After it arrives

Hand it over and it gets compressed, and the centre tile switches from
`object-cover` to `object-contain` with `#F8FAFC` behind it — at which point
the product sits on the page rather than inside a frame, which is the whole
point of the reference layout. If the generator gives a transparent PNG
instead of a flat field, better still: the same swap works and the tile colour
can then be changed at any time without touching the image.

---

## After you generate

Hand the files over (or drop them in `client/public/images/`) and say which
slot each is for. They will be renamed clearly, compressed, and wired into the
right component — same as the current photography.
