# Karmo Homepage — status

Where the homepage stands against the client requirement. Work through the
open items below; tick them off as they land.

Sources used:

- `korbo group/WebSite BluePrint.pdf` — 11 pages, text extracted from the PDF
  content streams (most pages are screenshots)
- `korbo group/Site Reference Final.xlsx` — the site map / menu structure
- `korbo group/Karmo Website/index.html` — the reference homepage build

---

## 1. What is built now

Nine sections, in page order. All lint and build clean.

| # | Section | File | Notes |
|---|---|---|---|
| 1 | Hero — *Comfort that starts within* | `Home/Hero.jsx` | 3 slides, panel build on load, dissolve after, pan-zoom |
| 2 | Who we are — *Built On Six Decades* | `Home/Capabilities.jsx` | 4 cards, drawn blueprint line art |
| 3 | About us — *Six Decades Of Making Bangladesh Comfortable* | `Home/About.jsx` | Portrait image + 4 figures |
| 4 | What we make — *Four Divisions* | `Home/Divisions.jsx` | 5 staggered cards, near-full-width |
| 5 | Started in 1965 — *Where comfort begins* | `Home/WhyKarmo.jsx` | Checklist + image, KARMO watermark |
| 6 | Gallery — *From the block to the bedroom* | `Home/Gallery.jsx` | Two marquee rows, opposite directions |
| 7 | Who we supply — *Trusted across the trade* | `Home/Clients.jsx` | Logo rail, ready for real logos |
| 8 | Karmo on screen — *See what comfort is made of* | `Home/Reels.jsx` | 6 videos, 9:16, lightbox |
| 9 | Our blog — *Follow the latest news* | `Home/Journal.jsx` | Carousel, 2 per view |

Plus `sheard/Navbar.jsx` (utility strip + 7 menus) and `sheard/Footer.jsx`
(closing CTA, 4 columns, newsletter).

---

## 2. Reference homepage vs. ours

The reference build (`index.html`) has 16 blocks. Mapping:

| Reference block | Ours | Status |
|---|---|---|
| Fixed nav + dropdowns | Navbar | done |
| Hero slider (4 slides) | Hero (3 slides) | done |
| Trust strip — 6 cards | Capabilities (4 cards) | done |
| "60+ Years of Trusted Comfort Solutions" | About | done |
| Heritage stats (1957 / 20 / 3 / TOP1) | About figures | done |
| Video section — 2 TVCs | Reels (6 videos) | done |
| Photo album — 5 pinned photos | Gallery | done |
| Corporate Clients — logos | Clients | built, **needs real logos** |
| Footer | Footer | done |
| Chemicals — *The World of Polyurethane* | Divisions card only | **partial** |
| Mattress — *We Test every Mattress* | WhyKarmo, partly | **partial** |
| HomeTex — *Where Comfort Meets Elegance* | Divisions card only | **partial** |
| Mattress technology diagram | — | **missing** |
| Best Sellers — product carousel | — | **missing** |
| Awards / certifications | — | **missing** |
| Floating WhatsApp + hotline | — | **missing** |

Not in the reference, added by us: **Journal** (blog carousel).

---

## 3. Blueprint items still open

From the PDF text:

| Item | Status |
|---|---|
| Home Page (ref: hatil.com) | in progress |
| Popup Ads | not started |
| Square Tile Design (×2) | not started |
| Shorts Video Section | done — Reels |
| Product Page | not started (separate page) |
| Product Detail Page | not started (separate page) |
| Foam Content (ref: flexipol.in, sheelafoam.com) | not started |

The blueprint also states **"Top Design: Hatil / Bottom Design: Durfi"**.
Sections so far follow the references supplied in chat (Kitchor, Intrio and
others), not those two. Worth settling before more sections are built.

---

## 4. Content and assets to supply

These block real work. Nothing here is a code problem.

### 4.1 Client logos — blocking

`Clients.jsx` currently lists the trade sectors Karmo supplies, taken from the
site map. It does **not** name companies.

The reference banner showed four logos — Bedzzz Express, Boll & Branch,
BrandsMart U.S.A., City Furniture. All four are US retailers, lifted from a
competitor's page. Using them would claim client relationships Karmo does not
have. Nothing in the reference folder holds real client data; every
"Our Partners" link points at `#`.

**Needed:** real client logos (SVG or transparent PNG). Drop a file path into
the `logo` field of any entry in `Clients.jsx` and it renders instead of the
wordmark — no other change required.

### 4.2 Photography still standing in

| Where | Using | Problem |
|---|---|---|
| Hero, About, Divisions, Gallery | `SLIDE01–03.png`, `image10.jpg` | Fine — supplied by client |
| Divisions, Gallery | `images/FurnitureFoam1–5` | Genuine Karmo studio shots (KARMO 180 / 2001 / POLY) |
| Divisions — chemicals card | `image10.jpg` | A room, not an adhesive. **Needs a real product or plant shot** |

Unused leftovers from the reference build still sitting in `public/images/`:
`Foam.png`, `Hometex.png`, `why.PNG`, `adhesive.jpg`. These are screen-grabs of
other companies' campaigns (AIRLAND, Therapedic, Star Bond). No component
references them — **safe to delete, and better to.**

### 4.3 Video labels unverified

`Reels.jsx` labels six clips. The two TVC names come from Karmo's own
`index.html`. The four short clips are captioned from `product-Foam.html`
("High-grade spring system", "Motion isolation", "Certiguard protection",
"Lab tested") — but that page's body copy repeatedly says *Durfi*, so the
captions, and possibly the footage, may not be Karmo's. **Watch the clips and
confirm the labels before launch.**

All six clips are landscape (4:3 or 16:9). The cards are 9:16, so the sides are
cropped hard. Proper vertical exports would fix this.

### 4.4 Figures to confirm

`About.jsx` shows four numbers, derived from the site map and founding year:

- **60+** years — counted from 1965
- **4** divisions — Foam / Mattress / HomeTex / Chemicals
- **50+** products — counted from the spreadsheet listing
- **1965** — founding year

No dealer count, client count or award count is shown anywhere, because none
was available. Supply real numbers and they go in.

---

## 5. Known issues

**Duplicate message in sections 2 and 3.** They now sit next to each other and
say close to the same thing:

- 2: "Built On Six Decades **Of Making Comfort**"
- 3: "**Six Decades Of Making** Bangladesh **Comfortable**"

Their body copy repeats too — both cover "manufacturing in Bangladesh since
1965, in our own plants". Options: fold About's four figures into section 2 and
drop section 3; or re-angle one of them (company story vs. capability).

---

## 6. Suggested order of work

1. Client logos → finish section 7
2. Decide the section 2 / 3 overlap
3. Delete the four unused competitor images from `public/images/`
4. Confirm the video labels
5. Build the missing sections: Best Sellers, Awards, floating WhatsApp/hotline
6. Settle the "Top: Hatil / Bottom: Durfi" direction
7. Dedicated Mattress / HomeTex / Chemicals blocks, if still wanted
