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

## 2. Divisions — four cards (4:3)

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

## 3. Spotlights — three rows (4:3)

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

## 4. WhyKarmo — "Where comfort begins" (4:3)

**Feature image**
> A warm family moment in a comfortable bedroom — soft focus, two children
> relaxed on a big quilted mattress, gentle daylight, genuine and heartwarming,
> premium but lived-in.

**Background (used dark, low opacity)**
> A quiet, softly-lit bedroom interior with a made bed and warm textures,
> muted, plenty of dark shadow area so text reads on top, cinematic and calm.

---

## 5. Best Sellers — product cards (3:4, portrait)

> Real product photos are strongly preferred here. If AI stand-ins are needed
> while real shots are arranged:
> A single hero mattress on a simple walnut platform bed against a warm plain
> wall, centred, even studio-daylight, catalogue style, lots of clean space
> around the product, one soft shadow.

## 6. Journal — blog thumbnails (3:2)

> Editorial lifestyle images matching each article topic — e.g. for a foam
> article: a detail of foam layers in warm light; for summer bedding: light
> breathable sheets by an open window; for plant/testing: a clean workshop
> detail. Same warm-neutral house style throughout so the carousel reads as one
> set.

---

## After you generate

Hand the files over (or drop them in `client/public/images/`) and say which
slot each is for. They will be renamed clearly, compressed, and wired into the
right component — same as the current photography.
