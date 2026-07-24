# Karmo Homepage — status

Where the build stands against the client requirement. Work through the open
items below; tick them off as they land.

*Last verified: 24 July 2026, against a running dev server.*

Sources used — all inside `recource/` (see §7):

- `recource/WebSite BluePrint.pdf` — 11 pages, text extracted from the PDF
  content streams (most pages are screenshots)
- `recource/Site Reference Final.xlsx` — the site map / menu structure
- `recource/Karmo Website/index.html` — the reference homepage build

---

## 1. What is built now

Nine sections, in page order. All render clean, no console errors.

| # | Section | File | Notes |
|---|---|---|---|
| 1 | Hero — *Comfort that starts within* | `Home/Hero.jsx` | 3 slides, panel build on load, dissolve after, pan-zoom |
| 2 | Who we are — *Built On Six Decades* | `Home/Capabilities.jsx` | 4 cards, drawn blueprint line art |
| 3 | Four divisions — *One group, one standard* | `Home/DivisionStack.jsx` | Sticky stacking deck, **shared with Home 02** — see §1b |
| 4 | Spotlights — Mattress / HomeTex / Chemicals | `Home/Spotlights.jsx` | 3 alternating rows, copy from Karmo's own profile |
| 4b | Best sellers — *The pieces worth starting with* | `Home/BestSellers.jsx` | 6-card snap rail, arrows, **ordering unverified** |
| 5 | Started in 1965 — *Where comfort begins* | `Home/WhyKarmo.jsx` | Checklist + image, KARMO watermark |
| 6 | Gallery — *From the block to the bedroom* | `Home/Gallery.jsx` | Two marquee rows, opposite directions |
| 7 | Who we supply — *Trusted across the trade* | `Home/Clients.jsx` | Logo rail, 8 plates, **still sector names not companies** |
| 8 | Karmo on screen | `Home/Reels.jsx` | 6 videos, 9:16, lightbox |
| 9 | Our blog — *Follow the latest news* | `Home/Journal.jsx` | Carousel, 2 per view, **4 placeholder posts** |

Plus `sheard/Navbar.jsx` (utility strip + 7 menus) and `sheard/Footer.jsx`
(closing CTA, 4 columns, newsletter).

**Removed 24 July 2026** — `Home/About.jsx` (*Six Decades Of Making Bangladesh
Comfortable*). It duplicated section 2; see §8. The four figures it carried
(60+ years / 4 divisions / 50+ products / 1965) are no longer on the site.
Recover with `git checkout <sha> -- client/src/components/Home/About.jsx`.

---

## 1b. Home 02 — the second treatment

Added 24 July 2026 at `/home-2`, reachable from a new **Home** dropdown in the
navbar (Home 01 — Editorial / Home 02 — Cinematic), so the two can be put side
by side for the client.

Home 01 is editorial — light panels, masked line reveals, sections that sit
still and let the copy lead. Home 02 argues the opposite: one dark surface the
whole way down, and motion driven by *scroll position* rather than by entering
the viewport.

| # | Section | File | Technique |
|---|---|---|---|
| 1 | Opening | `Home2/Opening.jsx` | Parallax photograph, line-masked headline, copy leaves faster than the image |
| 2 | Ticker | `Home2/Ticker.jsx` | Outlined display type on a seamless marquee |
| 3 | Showcase | `Home2/Showcase.jsx` | **Pinned section, vertical scroll drives the rail sideways**; travel is measured, not hard-coded |
| 4 | Divisions | `Home/DivisionStack.jsx` | Four division cards that gather into a sticky stack |
| 5 | Range | `Home2/Range.jsx` | Product index; the product preview trails the cursor on hover |
| 6 | Closing | `Home2/Closing.jsx` | Count-up figures + magnetic CTA button |

Plus `Home2/Progress.jsx`, a spring-damped read-progress hairline under the
navbar.

**The divisions deck is shared by both pages.** The client liked it on Home 02
and asked for it on Home 01, so it moved to `Home/DivisionStack.jsx` and both
pages import it — one file, edited once. It takes a `tone` prop:
`tone="dark"` (the default, Home 02: slate section, `shade-deep` cards, white
type) and `tone="light"` (Home 01: linen section, white cards, ink type),
because Home 01 is editorial and a dark panel dropped into it read as borrowed
from another site. The two palettes are complete utility strings in a `TONES`
map at the top of the file — Tailwind scans for literals, so classes must not
be assembled from fragments.

This replaced Home 01's old `Home/Divisions.jsx` (five staggered cards). Two
"four divisions" sections back to back made no sense, so the old one was
deleted rather than left rendering. Recover it with
`git checkout <sha> -- client/src/components/Home/Divisions.jsx`.

Every section has a reduced-motion path: Showcase drops the pinning for an
ordinary horizontal scroller, Range drops the cursor preview, the counters
render their final value, and the ticker stops moving.

Content is the same verified set as Home 01 — products and counts from
`Site Reference Final.xlsx`, figures from §6, imagery from §6.4. It shares the
site Navbar and Footer, so the §2 dead-route problem applies here too.

**Not yet reviewed on screen.** It was built and checked against the DOM (all
six sections render, all images serve 200, lint clean, no console or server
errors), but the browser pane was not displaying, so the animations themselves
have not been watched. Open `/home-2` and scroll before showing the client.

---

## 2. Routes — 36 of 44 links are dead

This is the largest gap and it is not cosmetic: the navbar, footer, every
division card and every blog card point at pages that do not exist. Verified
by requesting each route against the dev server.

**Exists (8):** `/` · `/about` · `/contact` · `/login` · `/register` ·
`/dashboard` · `/dashboard/profile` · `/dashboard/settings`

**404 (36):**

| Group | Missing routes |
|---|---|
| Foam | `/foam` + `/furniture-upholstery` `/acoustic` `/footwear` `/automotive` `/memory-foam` |
| Mattress | `/mattress` |
| HomeTex | `/hometex` + `/pillow` `/cushion` `/bed-sheet` `/comforter` |
| Chemicals | `/chemicals` + `/adhesive` `/evergain` `/sodium-silicate` |
| About | `/about/history` `/about/board` `/about/awards` `/about/partners` |
| Media | `/media` + `/blogs` `/memory` `/static-ads` `/video-ads` |
| Contact | `/contact/catalogues` `/contact/bulk-order` `/contact/address` `/contact/faqs` |
| Standalone | `/find-store` `/career` `/dealership` |
| Blog posts | `/blog/foam-density` `/blog/summer-bedding` `/blog/batch-testing` `/blog/adhesives` |

`app/(mainLayout)/services/page.jsx` exists but nothing links to it.

The four division landing pages (`/foam`, `/mattress`, `/hometex`,
`/chemicals`) are the ones to build first — they take the most inbound links
and the blueprint calls for a Product Page and Product Detail Page anyway.

---

## 3. Reference homepage vs. ours

The reference build (`index.html`) has 16 blocks. Mapping:

| Reference block | Ours | Status |
|---|---|---|
| Fixed nav + dropdowns | Navbar | done |
| Hero slider (4 slides) | Hero (3 slides) | done |
| Trust strip — 6 cards | Capabilities (4 cards) | done |
| "60+ Years of Trusted Comfort Solutions" | — | **removed with About** |
| Heritage stats (1957 / 20 / 3 / TOP1) | — | **removed with About** |
| Video section — 2 TVCs | Reels (6 videos) | done |
| Photo album — 5 pinned photos | Gallery | done |
| Chemicals — *The World of Polyurethane* | Spotlight 03 | done |
| Mattress — *We Test every Mattress* | Spotlight 01 | done |
| HomeTex — *Where Comfort Meets Elegance* | Spotlight 02 | done |
| Corporate Clients — logos | Clients | built, **needs real logos** |
| Footer | Footer | done — address, both phones and email wired 24 July 2026 |
| Mattress technology diagram | — | **missing** |
| Best Sellers — product carousel | BestSellers | done 24 July 2026 — **order is a curation, not a ranking** (see §6.6) |
| Awards / certifications | — | **missing, and no source** — the reference block (`cf.PNG`) is a screenshot of Tempur-Pedic's awards page (J.D. Power, Space Foundation). Karmo's own awards have not been supplied. |
| Floating WhatsApp + hotline | — | **missing** |

Not in the reference, added by us: **Journal** (blog carousel).

Note the reference homepage is not really built — it is ten full-width `<img>`
banners. The actual design intent lives inside those PNGs:
`1965 - Copy.png`, `part2.PNG`, `polly.png`, `matts.png`, `mattress1.png`,
`homms.PNG`, `springman.PNG`, `client.PNG`, `bbt.PNG`, `cf.PNG`. Open them
before building the missing sections — that is where Best Sellers, Awards and
the mattress diagram are specified.

---

## 4. Blueprint items still open

From the PDF text:

| Item | Page | Status |
|---|---|---|
| Home Page (ref: hatil.com) | 1 | in progress |
| Popup Ads | 1 | not started |
| Font | 1 | **not settled** — named in the blueprint, name is inside a screenshot |
| Square Tile Design (×2) | 2–3 | not started |
| Shorts Video Section | 4 | done — Reels |
| Product Page | 5 | not started |
| Product Detail Page | 6 | not started |
| Foam Content (ref: flexipol.in, sheelafoam.com) | 11 | not started |

The blueprint also states **"Top Design: Hatil / Bottom Design: Durfi"**.
Sections so far follow the references supplied in chat (Kitchor, Intrio and
others), not those two. Worth settling before more sections are built.

---

## 5. Site map — the full product listing

`Site Reference Final.xlsx` gives four levels: Menu → Sub Menu → Product →
Reference. **47 named products.** Nothing below product level is built yet.

| Division | Sub-menus | Products |
|---|---|---|
| Foam | Furniture & Upholstery · Studio · Footwear · Automotive · Visco Elastic | 18 |
| Mattress | Mattress | 9 |
| HomeTex / Bedding | Pillow · HomeTex | 5 |
| Chemicals & Polymers | Karmo Adhesive · Evergain Chemical · Sodium Silicate | 15 |

Per-page design references from the spreadsheet:

| Page | Reference |
|---|---|
| Home | hatil.com |
| Foam | sheelafoam.com, flexipol.in |
| Mattress | nilkamalsleep.com, durfi.com |
| Mattress Topper | nolahsleep.com |
| About / History / Board | ril.com |
| Find Store | wakefit.co/furniture-store |
| Career | springfit.com |
| Dealership | springfit.com, pepsindia.com/franchise |

A separate "Extra Content idea Link" column lists 14 more: duroflexworld ·
kurlon · thesleepcompany · pepsindia · flomattress · sundayrest · springtek ·
nilkamalsleep · durfi · suibao · derucci · therapedic · urbanbed · flexipol

**Spelling in the source spreadsheet is unreliable** — `Accoustic`, `Conture`,
`Poket`, `Hardner`, `Spary`, `Cliens`, `Contract Us`, `Statics Ads`. Do not
copy product names across verbatim. (The navbar already says "Contact Us"
correctly.)

**Query for the client:** "Conture Design Foam Chattogram / Sylhet / Dhaka"
lists city names as product names. Regional variants, or a spreadsheet error?

---

## 6. Content and assets to supply

These block real work. Nothing here is a code problem.

### 6.1 Client logos — blocking

`Clients.jsx` lists the trade sectors Karmo supplies, taken from the site map.
It does **not** name companies.

**Checked `recource/` on 24 July 2026 — the logos are not in there.** The only
two candidate files are:

- `images/company-logo.png` — Karmo's own mark, already in the project
- `images/client.png` — a flat screenshot of a "Corporate Clients" strip
  showing Bedzzz Express, Boll & Branch, BrandsMart U.S.A. and City Furniture.
  All four are US retailers, lifted from a competitor's page. Using them would
  claim client relationships Karmo does not have, and they are baked into one
  PNG anyway — not separate, usable logo files.

There are no SVGs anywhere in the folder, and every "Our Partners" link in the
reference build points at `#`. **This item cannot move without the client.**

**Needed:** real client logos (SVG or transparent PNG). Drop a file path into
the `logo` field of any entry in `Clients.jsx` and it renders instead of the
wordmark — no other change required.

### 6.2 Contact details — recovered from the reference, not all wired up

`recource/Karmo Website/index.html` carries the real footer data:

| Field | Value | In the Next.js build? |
|---|---|---|
| Address | Ibrahim Chamber, 4th Floor, 95 Motijheel, Dhaka-1000 | yes — Footer |
| Phone 1 | +88 01713483284 | yes — Navbar + Footer |
| Phone 2 | +88 01713483285 | yes — Footer |
| Email | info@karmogroup.com | yes — Navbar + Footer |
| WhatsApp | wa.me/8801713483254 | **no** — floating button not built |
| Socials | Facebook · Instagram · YouTube · **TikTok** | TikTok replaced with LinkedIn; no profile URLs, all `href="#"` |

**Query for the client:** the WhatsApp number ends 3254, the hotline ends
3284. One of them is probably a typo.

### 6.3 Store data does not exist

`Find-Store.html` headlines "KARMO Stores now in 64 Cities" but contains three
cities (Dhaka 3, Chittagong 2, Sylhet 1) pasted repeatedly, and a modal that
reads "You can add location, address, map here". **Real store list needed
before `/find-store` can be built.**

### 6.4 Photography still standing in

**Reworked 24 July 2026.** The three hero slides used to carry most of the
page — `SLIDE01–03.png` appeared in Hero, Divisions, Spotlights, BestSellers,
Gallery, WhyKarmo, Journal and the Footer, so the same three frames repeated
the whole way down. The client then supplied twelve of Karmo's own campaign
photographs. Those now carry every section and **`SLIDE01–03` are confined to
the Hero**, which is what they were shot for.

| Where | Using | Note |
|---|---|---|
| Hero only | `SLIDE01–03.png` | Client-supplied, wide, shot for the hero |
| Divisions, Gallery | `foam-sofa-1965`, `mattress-suite`, `fabric-alpona`, `FurnitureFoam1` | Karmo's own |
| Spotlights | `mattress-detail`, `comforter-red-stripe`, `FurnitureFoam2` | Karmo's own |
| BestSellers | 4 named mattresses + `foam-karmo-280`, `FurnitureFoam4` | Karmo's own, see §6.6 |
| WhyKarmo, Journal, Footer | `mattress-comfort`, `mattress-family`, `mattress-cloud`, `FurnitureFoam3/5` | Karmo's own |
| Divisions — chemicals card | `image10.jpg` | A room, not an adhesive. **Still needs a real product or plant shot** |

> **The supplied files are campaign posters, not product shots.** Nine of the
> twelve have a discount flash ("20% ছাড়"), a taka price, the hotline and a
> FREE DELIVERY badge burned into the artwork. On a permanent page that means
> a standing 20%-off claim and prices (৯,০৫৮ · ৩৮,৮১৫ · ৪১,৯১৯ · ৪,৬২৯) that
> go stale the day the campaign ends. The section scrims cover some of it, not
> all. **Ask the client for the same shots without the campaign overlay** —
> `mattress-suite.jpg` and `mattress-detail.jpg` are the two that already come
> clean, and they are the two that look best on the page.

Renamed on the way in — the files arrived as `1.jpg`…`11.jpg`:

| Was | Now | Shows |
|---|---|---|
| `1.jpg` | `mattress-cloud.jpg` | Mattress above cloud, 15% flash |
| `2.jpg` | `mattress-comfort.jpg` | Mattress in a plant-filled room, 15% flash |
| `3.jpg` | `foam-sofa-1965.jpg` | Sofa + yellow KARMO 1965 foam blocks |
| `4.jpg` | `mattress-pillow-top-pocket.jpg` | Pillow Top Pocket Spring |
| `5.jpg` | `mattress-prestige.jpg` | Prestige Mattress |
| `6.jpg` | `mattress-king.jpg` | Mattress King |
| `7.jpg` | `mattress-euro-top-pocket.jpg` | Euro Top Pocket Spring |
| `8.jpg` | `mattress-detail.jpg` | Quilted top, hand pressing — **clean** |
| `9.jpg` | `comforter-red-stripe.jpg` | Comforter, Red Stripe |
| `10.jpg` | `mattress-suite.jpg` | Chandelier-lit suite — **clean** |
| `11.jpg` | `foam-karmo-280.jpg` | Red KARMO 280 foam blocks |
| `4857…_n.jpg` | `mattress-family.jpg` | Children on a Karmo mattress |

Unused leftovers from the reference build still sitting in `public/images/`:
`Foam.png`, `Hometex.png`, `why.PNG`, `adhesive.jpg`. These are screen-grabs of
other companies' campaigns (AIRLAND, Therapedic, Star Bond). No component
references them — **safe to delete, and better to.**

**149 of the 161 reference images have never been used.** Several groups look
directly useful for the pages that still have to be built:

| Group | Count | For |
|---|---|---|
| `fabric1–12.jpg` | 12 | HomeTex / bed sheets |
| `ev1–ev8` | 8 | Evergain Chemical |
| `adh1–4`, `adhb` | 5 | Karmo Adhesive |
| `sl1–sl4.PNG` | 4 | alternative hero slides |
| `cm1–3`, `cmm1–3` | 6 | Comforter |
| `sw1–4`, `so1–3` | 7 | Pillow / Sodium Silicate |
| `fq0–fq4` | 5 | FAQs |
| `dom1–5` | 5 | photo album |

`Pillow.png` is 15.4 MB and must be compressed before it goes anywhere near
the site.

### 6.5 Video labels unverified

`Reels.jsx` labels six clips. The two TVC names come from Karmo's own
`index.html`. The four short clips are captioned from `product-Foam.html`
("High-grade spring system", "Motion isolation", "Certiguard protection",
"Lab tested") — but that page's body copy repeatedly says *Durfi*, so the
captions, and possibly the footage, may not be Karmo's. **Watch the clips and
confirm the labels before launch.**

All six clips are landscape (4:3 or 16:9). The cards are 9:16, so the sides are
cropped hard. Proper vertical exports would fix this.

### 6.6 Best sellers — no sales data behind it

`BestSellers.jsx` names six real products from the site map and puts two from
each of Mattress, Foam and HomeTex on the rail. **Karmo has supplied no sales
figures**, so the order is an even spread across the divisions, not a ranking.
Supply a real top-six (or a top-ten) and it is a one-array edit.

Imagery on the rail — **all six now show the product they name** (revised
24 July 2026, once the client's campaign photography arrived):

| Card | Image |
|---|---|
| Karmo EuroTop Pocket Spring | `mattress-euro-top-pocket.jpg` |
| Karmo King Mattress | `mattress-king.jpg` |
| Karmo Prestige Mattress | `mattress-prestige.jpg` |
| Karmo Pocket Spring — Pillow Top | `mattress-pillow-top-pocket.jpg` |
| Karmo 280 | `foam-karmo-280.jpg` |
| Karmo Poly | `FurnitureFoam4.png` |

The artwork itself carries the product name, so a card's label and its picture
cannot drift apart. The catch is the campaign overlay described in §6.4 — five
of the six carry a discount flash and a price. Clean cut-outs would let the
rail read as a product grid rather than a row of adverts.

The dimensions in each card's spec line (12", 4", 81 × 69) are read straight
off the posters, so they are Karmo's own numbers.

Note the reference "Best Sellers" block (`bbt.png`) and the carousel above it
(`bestsaal.png`) are both screenshots of **Airland (雅蘭)**, a Hong Kong
brand — layout reference only, none of that imagery is usable.

**Also worth asking the client:** `FurnitureFoam1.png` is branded "KARMO 180",
but there is no Karmo 180 anywhere in the site map. Either the spreadsheet is
missing a grade or the photograph is of a discontinued one.

### 6.7 Blog posts are placeholders

All four entries in `Journal.jsx` are written copy, not real articles, and
every `/blog/*` route 404s. Either supply real posts or drop the section until
Media Center exists.

---

## 7. The reference folder — `recource/`

538 MB: 12 HTML pages, 161 images (154 MB), 6 videos (382 MB), the blueprint
PDF and the site map spreadsheet.

> **`.gitignore` does not match this folder.** Line 14 ignores `korbo group/`,
> but the folder on disk is `recource/`. Git currently sees all 538 MB as
> untracked. `Video/Mattress 3.mp4` (202 MB) and `Video/Mattress 1.mp4`
> (160 MB) are both over GitHub's 100 MB hard limit, so a push would be
> rejected — and rewriting history to undo it is painful. **Fix the
> `.gitignore` line before the next `git add`.**

Also worth deleting from the folder: `Thumbs.db` (1.6 MB) and six duplicate
`- Copy` files (~7 MB).

---

## 8. Known issues

**~~Duplicate message in sections 2 and 3~~ — resolved 24 July 2026** by
deleting `About.jsx`. Section 2 ("Built On Six Decades Of Making Comfort") now
carries the company story on its own.

Left over from that removal: the four figures (60+ / 4 / 50+ / 1965) are gone
from the site. If they are wanted, `Capabilities` is the natural home. Note
the product figure should read **47**, not "50+" — that is the count in the
spreadsheet.

---

## 9. Suggested order of work

1. **Fix `.gitignore`** — `korbo group/` → `recource/`. One line, and it
   prevents a 538 MB commit that cannot be pushed.
2. Open the ten design-mockup PNGs in `recource/Karmo Website/images/` — they
   specify Best Sellers, Awards and the mattress diagram
3. Build the four division landing pages: `/foam`, `/mattress`, `/hometex`,
   `/chemicals` — 36 dead links start dropping fast
4. Finish the footer: full address, second phone, TikTok; add the floating
   WhatsApp + hotline buttons (all data is in §6.2)
5. Client logos → finish section 7
6. Delete the four unused competitor images from `public/images/`
7. Confirm the video labels and the WhatsApp number
8. Build the missing sections: Best Sellers, Awards, mattress diagram
9. Settle the "Top: Hatil / Bottom: Durfi" direction and the blueprint font
10. Product Page + Product Detail Page, against the 47-product listing in §5
