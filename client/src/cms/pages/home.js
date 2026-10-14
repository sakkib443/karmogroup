/**
 * Home page (/) — every editable section: what the editor shows (fields) and the
 * design's own content (defaults). The components in components/karmo/home read
 * these defaults through useSection(key, DEFAULTS), so with nothing edited the
 * page is exactly as designed.
 */
import { f, img, pos } from "../fields";

const SHADE = "#161c24";
const NAVY = "#0b1528";

const slideFields = [
  f.media("media", "Image or video"),
  f.text("heading", "Heading", { size: true }),
  f.select("align", "Heading position", {
    options: [
      { value: "center", label: "Centre" },
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
  }),
  f.overlay("overlay", "Extra darkness over the picture"),
  f.range("holdSec", "Seconds on screen", { min: 2, max: 30, step: 0.5, unit: "s", help: "Leave video slides at the clip's length." }),
];

const video = (src, poster, extra = {}) => ({ type: "video", src, poster: poster || "", rate: 1, fit: "cover", x: 50, y: 50, zoom: 100, ...extra });
const photo = (src, alt, extra = {}) => ({ type: "image", ...img(src, alt), ...extra });
const noOverlay = { color: "#000000", opacity: 0 };
const veil = { color: "#000000", opacity: 32 };

export const hero = {
  key: "hero",
  label: "Hero slider",
  description: "The full-screen slides at the top of the page.",
  fields: [
    f.list("slides", "Slides", slideFields, { itemLabel: (s) => s.heading || "Slide" }),
    f.range("autoplaySec", "Seconds per photo slide", { min: 2, max: 15, step: 0.5, unit: "s" }),
  ],
  defaults: {
    autoplaySec: 4.5,
    slides: [
      { id: "home-video-assemble", media: video("/pages/home/videos/hero-video-1.mp4", "/pages/home/videos/hero-video-1-poster.webp"), heading: "The Journey Since 1965", headingSize: 100, align: "center", overlay: noOverlay, holdSec: 6 },
      { id: "home-video-living", media: video("/pages/home/videos/hero-video-a.mp4", "/pages/home/videos/hero-video-a-poster.webp", { rate: 1.25, y: 68 }), heading: "Foam crafted for living", headingSize: 100, align: "center", overlay: noOverlay, holdSec: 14.8 },
      { id: "home-video-dining", media: video("/pages/home/videos/hero-video-b.mp4", "/pages/home/videos/hero-video-b-poster.webp", { rate: 1.25 }), heading: "Moments that make a house", headingSize: 100, align: "center", overlay: noOverlay, holdSec: 10.4 },
      { id: "home-video-lounge", media: video("/pages/home/videos/hero-video-c.mp4", "/pages/home/videos/hero-video-c-poster.webp", { rate: 1.25 }), heading: "The Journey Since 1965", headingSize: 100, align: "center", overlay: noOverlay, holdSec: 12.2 },
      { id: "home-room-tour-trial", media: video("/pages/home/videos/hero-room-tour-trial.mp4"), heading: "The Journey Since 1965", headingSize: 100, align: "center", overlay: noOverlay, holdSec: 10 },
      { id: "home-journey-1965", media: photo("/pages/home/hero/home-hero-slide-01-mustard-room-hq.webp", "Mustard sofa in a blue-walled living room with plants and wood shelves"), heading: "The Journey Since 1965", headingSize: 100, align: "center", overlay: veil },
      { id: "home-living-scandi", media: photo("/pages/home/hero/home-hero-slide-living-scandi-v3-hq.webp", "Warm living room with a cream sofa, wood shelves and round coffee table"), heading: "The Journey Since 1965", headingSize: 100, align: "center", overlay: veil },
      { id: "home-chemicals-warehouse", media: photo("/pages/home/hero/home-hero-slide-chemicals-hero-hq.webp", "Organized Karmo chemicals warehouse with blue drums in cinematic light"), heading: "Industrial chemistry built to last", headingSize: 100, align: "left", overlay: noOverlay },
      { id: "home-hometex-quilts", media: photo("/pages/home/hero/home-hero-slide-hometex-quilts-v2-hq.webp", "Stacked Karmo HomeTex floral quilts on a sunlit bed"), heading: "Moments that make a house", headingSize: 100, align: "left", overlay: noOverlay },
      { id: "home-foam-room", media: photo("/pages/home/hero/home-hero-slide-foam-real-v23-hq.webp", "KARMO HD and KARMO 280 foam stacks in a sunlit mustard living room", pos("object-left")), heading: "Foam crafted for living", headingSize: 100, align: "center", overlay: veil },
      { id: "home-mattress-cat", media: photo("/shared/hero/cooling-cat-karmo-handle-hq.webp", "Karmo mattress in a calm bedroom with a sleeping cat"), heading: "Crafted for nights that last", headingSize: 100, align: "right", overlay: noOverlay },
    ],
  },
};

export const editorials = {
  key: "editorials",
  label: "Our craft (photo mosaic)",
  description: "The tagline on the left and six division photos on the right.",
  fields: [
    f.text("eyebrow", "Small red title"),
    f.text("eyebrowNote", "Small grey note"),
    f.text("titleLine1", "Heading — first line", { size: true }),
    f.text("titleLine2", "Heading — second line (red)", { size: true }),
    f.text("tagline", "Line under the heading"),
    f.textarea("body", "Paragraph", { size: true }),
    f.link("link", "Link"),
    f.list("shots", "Photos", [f.image("image", "Photo"), f.text("label", "Name on hover"), f.text("href", "Opens page")], { fixed: true, itemLabel: (s, i) => `${i + 1}. ${s.label}` }),
  ],
  defaults: {
    eyebrow: "Our craft",
    eyebrowNote: "Karmo since 1965",
    titleLine1: "We create the",
    titleLine2: "Chemistry of comfort",
    titleLine1Size: 100,
    titleLine2Size: 100,
    tagline: "Made under one roof",
    body: "From foam and mattresses to HomeTex and chemicals, Karmo makes every layer of comfort under one roof.",
    bodySize: 100,
    link: { label: "Explore our range", href: "/mattress" },
    shots: [
      { label: "Mattress", href: "/mattress", image: img("/pages/home/divisions/editorial-v2/mattress-press-pro-fill-hq.webp", "Hand pressing a quilted Karmo mattress on a bright bed", { ...pos("object-[center_62%]"), zoom: 128 }) },
      { label: "Foam", href: "/foam", image: img("/pages/home/divisions/editorial-v2/foam-olive-sofa-hq.webp", "Olive three-seat sofa with Karmo foam in a sunlit living room") },
      { label: "HomeTex", href: "/hometex", image: img("/pages/home/divisions/editorial-v2/hometex-pillows-sideboard-hq.webp", "White pillows and down feathers styled on a cane sideboard", pos("object-[72%_center]")) },
      { label: "HomeTex", href: "/hometex", image: img("/pages/home/divisions/editorial-v2/hometex-quilt-stack-hq.webp", "Stacked floral Karmo HomeTex quilts with floating feathers on a white bed") },
      { label: "Foam", href: "/foam", image: img("/pages/home/divisions/editorial-v2/foam-luxury-arch-sofa-hq.webp", "Mustard wood-frame sofa set with Karmo foam in a sunlit living room", pos("object-[center_42%]")) },
      { label: "Chemicals", href: "/chemicals", image: img("/pages/home/divisions/editorial-v2/chemicals-tins-hq.webp", "Karmo adhesive tins from the chemicals division") },
    ],
  },
};

export const chemicals = {
  key: "chemicals",
  label: "Chemicals band",
  description: "Full-width warehouse photo with the dark claim panel.",
  fields: [
    f.image("background", "Background photo"),
    f.overlay("panelOverlay", "Panel darkness"),
    f.text("eyebrow", "Small title"),
    f.text("titleLine1", "Heading — first line", { size: true }),
    f.text("titleLine2", "Heading — second line", { size: true }),
    f.list("claims", "Claims", [f.image("icon", "Icon"), f.text("title", "Text")], { fixed: true, itemLabel: (c) => c.title }),
    f.link("button", "Button"),
  ],
  defaults: {
    background: img("/pages/home/hero/home-hero-slide-chemicals-hero-hq.webp", "Organized Karmo chemicals warehouse with blue industrial drums"),
    panelOverlay: { color: "#000000", opacity: 70 },
    eyebrow: "Karmo Chemicals",
    titleLine1: "The world of",
    titleLine2: "polyurethane",
    titleLine1Size: 100,
    titleLine2Size: 100,
    claims: [
      { title: "Largest raw material stock", icon: img("/shared/trust/cartoon-v3/chem-stock-v2.webp", "", { fit: "contain" }) },
      { title: "International quality certified", icon: img("/shared/trust/cartoon-v3/chem-certified-v2.webp", "", { fit: "contain" }) },
      { title: "Specialized polyurethanes & polymers", icon: img("/shared/trust/cartoon-v3/chem-polymer-v2.webp", "", { fit: "contain" }) },
    ],
    button: { label: "Explore Chemicals", href: "/chemicals" },
  },
};

const panelFields = [
  f.image("image", "Photo"),
  f.overlay("overlay", "Darkness"),
  f.text("line1", "Heading — first line", { size: true }),
  f.text("line2", "Heading — second line"),
  f.text("cta", "Link text"),
  f.text("href", "Opens page"),
  f.select("align", "Text side", { options: [{ value: "left", label: "Left" }, { value: "right", label: "Right" }] }),
];

export const explore = {
  key: "explore",
  label: "Explore panels",
  description: "Two side-by-side photo panels and the wide foam banner under them.",
  fields: [
    f.list("panels", "Top panels", panelFields, { fixed: true, itemLabel: (p) => `${p.line1} ${p.line2}` }),
    f.group("flagship", "Wide foam banner", [
      f.list("shots", "Photos (the arrow switches between them)", [f.image("image", "Photo"), f.overlay("overlay", "Extra darkness")], { itemLabel: (_s, i) => `Photo ${i + 1}`, max: 6 }),
      f.text("line1", "Heading — first line", { size: true }),
      f.text("line2", "Heading — second line"),
      f.link("link", "Link"),
    ]),
  ],
  defaults: {
    panels: [
      { href: "/mattress", image: img("/shared/explore/mattress-panel-v2.webp", "A Karmo floral mattress styled in a calm grey bedroom"), overlay: { color: SHADE, opacity: 35 }, line1: "Mattress made", line1Size: 100, line2: "for deep rest", cta: "Explore Now", align: "right" },
      { href: "/hometex", image: img("/shared/explore/hometex-panel-v2.webp", "A cream sofa in a mustard yellow HomeTex living room"), overlay: { color: SHADE, opacity: 35 }, line1: "HomeTex for", line1Size: 100, line2: "every room", cta: "Explore Now", align: "right" },
    ],
    flagship: {
      shots: [
        { image: img("/pages/foam/furniture/hero/foam-sunlit-sofa-v2.webp", "Cream armchair and Karmo foam slabs in a sunlit living room", pos("object-[20%_bottom]")), overlay: { color: SHADE, opacity: 0 } },
        { image: img("/shared/banners/magnific-3zztfkcrey.webp", "A Karmo Magnific lifestyle scene"), overlay: { color: SHADE, opacity: 0 } },
      ],
      line1: "Foam crafted",
      line1Size: 100,
      line2: "for comfort",
      link: { label: "Explore Now", href: "/foam" },
    },
  },
};

export const divisions = {
  key: "divisions",
  label: "Our divisions",
  description: "Four square division tiles.",
  fields: [
    f.text("eyebrow", "Small red title"),
    f.text("title", "Heading", { size: true }),
    f.text("titleAccent", "Heading — red part"),
    f.list("tiles", "Tiles", [f.image("image", "Photo"), f.text("name", "Name on hover"), f.text("href", "Opens page")], { itemLabel: (t) => t.name, max: 8 }),
  ],
  defaults: {
    eyebrow: "Our Divisions",
    title: "One group,",
    titleSize: 100,
    titleAccent: "four crafts",
    tiles: [
      { name: "Foam", href: "/foam", image: img("/pages/home/divisions/foam-catalog-match-v1.webp", "Blue Karmo letter-cushion sofa in a cream catalog studio") },
      { name: "Mattress", href: "/mattress", image: img("/pages/home/divisions/mattress-catalog-v9.webp", "Hand pressing a red floral quilted Karmo mattress", pos("object-[center_58%]")) },
      { name: "HomeTex", href: "/hometex", image: img("/pages/home/divisions/hometex-catalog-match-v1.webp", "Stacked floral Karmo HomeTex quilts in a cream catalog studio") },
      { name: "Chemicals", href: "/chemicals", image: img("/pages/home/divisions/chemicals-catalog-v6.webp", "Karmo Chemicals adhesive tins in a professional studio") },
    ],
  },
};

export const materials = {
  key: "materials",
  label: "Shop by material",
  description: "Four material cards in an uneven grid.",
  fields: [
    f.list("cards", "Cards", [
      f.image("image", "Photo"),
      f.overlay("overlay", "Darkness"),
      f.text("name", "Small title"),
      f.text("line", "Heading", { size: true }),
      f.text("href", "Opens page"),
    ], { fixed: true, itemLabel: (c) => c.name }),
  ],
  defaults: {
    cards: [
      { name: "Rebonded Foam", line: "Support that lasts", lineSize: 100, href: "/mattress", image: img("/pages/home/materials/rebonded-foam-v15.webp", "Speckled terrazzo rebonded foam slab"), overlay: { color: "#000000", opacity: 0 } },
      { name: "Polyethylene Foam", line: "Hi-density core", lineSize: 100, href: "/mattress", image: img("/pages/home/materials/pe-foam-v2.webp", "Close-up of charcoal egg-crate contour foam"), overlay: { color: "#000000", opacity: 40 } },
      { name: "Natural Coir", line: "Cool and breathable", lineSize: 100, href: "/mattress", image: img("/pages/home/materials/natural-coir.webp", "Close-up of a Karmo natural coir sheet — pressed coconut-husk fibre"), overlay: { color: "#000000", opacity: 40 } },
      { name: "Pocket Spring", line: "Independent coils", lineSize: 100, href: "/mattress", image: img("/pages/home/materials/pocket-spring.webp", "Close-up of a Karmo pocket-spring unit — fabric-bagged steel coils"), overlay: { color: "#000000", opacity: 40 } },
    ],
  },
};

export const promo = {
  key: "promo",
  label: "Popular products",
  description: "The large feature photo and the two tiles beside it.",
  fields: [
    f.group("feature", "Large feature", [
      f.image("image", "Photo"),
      f.overlay("overlay", "Darkness"),
      f.text("eyebrow", "Small title"),
      f.text("line1", "Heading — first line", { size: true }),
      f.text("line2", "Heading — second line"),
      f.link("button", "Button"),
    ]),
    f.list("side", "Side tiles", [
      f.image("image", "Photo"),
      f.overlay("overlay", "Darkness"),
      f.text("title", "Heading", { size: true }),
      f.text("cta", "Link text"),
      f.text("href", "Opens page"),
    ], { fixed: true, itemLabel: (s) => s.title }),
  ],
  defaults: {
    feature: {
      image: img("/pages/home/promo-trio/feature-foam-seating-bion-shadow.webp", "Taupe velvet sofa with tan leather arm, window light and plant shadow", { x: 0, y: 50 }),
      overlay: { color: SHADE, opacity: 35 },
      eyebrow: "Our popular products",
      line1: "Foam seating",
      line1Size: 100,
      line2: "collection",
      button: { label: "Shop the collection", href: "/foam" },
    },
    side: [
      { title: "HomeTex bedding", titleSize: 100, cta: "Shop now", href: "/hometex", image: img("/pages/home/promo-trio/side-top-nvv867gyqd.webp", "Karmo HomeTex bedding"), overlay: { color: SHADE, opacity: 22 } },
      { title: "Mattress range", titleSize: 100, cta: "Shop now", href: "/mattress", image: img("/pages/home/promo-trio/side-bottom-bxxj1zj5y2.webp", "Karmo mattress range"), overlay: { color: SHADE, opacity: 22 } },
    ],
  },
};

export const sizes = {
  key: "sizes",
  label: "Shop by mattress size",
  description: "Four bed sizes; the arrow switches colour and sketch pictures.",
  fields: [
    f.text("title", "Heading", { size: true }),
    f.text("titleAccent", "Heading — red part"),
    f.list("sizes", "Sizes", [
      f.text("name", "Name"),
      f.text("dims", "Size"),
      f.text("fits", "Who it fits"),
      f.text("href", "Opens page"),
      f.image("image", "Colour picture"),
      f.image("sketch", "Sketch picture"),
    ], { fixed: true, itemLabel: (s) => s.name }),
  ],
  defaults: {
    title: "Shop by",
    titleSize: 100,
    titleAccent: "mattress size",
    sizes: [
      { name: "Single", dims: "36 × 75 in", fits: "Fits 1", href: "/mattress", image: img("/pages/home/sizes/size-single-pose-red-v2.webp", "One person sleeping on their side on a Karmo single mattress", { fit: "contain" }), sketch: img("/pages/home/sizes/size-single-pose-sketch-v4.webp", "", { fit: "contain" }) },
      { name: "Double", dims: "48 × 75 in", fits: "Fits 2", href: "/mattress", image: img("/pages/home/sizes/size-double-pose-red-v2.webp", "Two people sleeping in different poses on a Karmo double mattress", { fit: "contain" }), sketch: img("/pages/home/sizes/size-double-pose-sketch-v4.webp", "", { fit: "contain" }) },
      { name: "Queen", dims: "69 × 81 in", fits: "Fits 1 + child", href: "/mattress", image: img("/pages/home/sizes/size-queen-pose-red-v2.webp", "An adult and a child sleeping on their sides on a Karmo queen mattress", { fit: "contain" }), sketch: img("/pages/home/sizes/size-queen-pose-sketch-v4.webp", "", { fit: "contain" }) },
      { name: "King", dims: "72 × 80 in", fits: "Fits 2 + child", href: "/mattress", image: img("/pages/home/sizes/size-king-pose-red-v2.webp", "A family sleeping in mixed poses on a Karmo king mattress", { fit: "contain" }), sketch: img("/pages/home/sizes/size-king-pose-sketch-v4.webp", "", { fit: "contain" }) },
    ],
  },
};

export const promise = {
  key: "promise",
  label: "Our promise",
  description: "Four claim cards over a moving background.",
  fields: [
    f.text("heading", "Heading", { size: true }),
    f.text("subline", "Line under the heading"),
    f.list("claims", "Cards", [f.text("title", "Title"), f.textarea("body", "Text")], { fixed: true, itemLabel: (c) => c.title }),
    f.video("film", "Background video"),
    f.image("still", "Background photo (shows while the video loads, or alone)"),
    f.overlay("overlay", "Darkness"),
  ],
  defaults: {
    heading: "Blending tradition with innovation",
    headingSize: 100,
    subline: "Lasting Comfort to your Doorstep",
    claims: [
      { title: "Pure Quality", body: "Built with pure, premium-grade materials — no shortcuts, no compromise. From foam and mattresses to pillows and bedding, every Karmo piece is made for real density, clean finish and lasting strength." },
      { title: "Long Lasting", body: "Engineered for everyday use without sagging or losing shape. Karmo foam, mattresses and HomeTex are built to hold their support and comfort for years — not just the first few nights." },
      { title: "Certified Comfort", body: "Breathable, resilient and quality-checked for a healthier rest. Soft where you need it, supportive where it counts — comfort you can trust across the whole Karmo range." },
      { title: "Trusted Legacy", body: "Founded in 1965 as the country’s first polyurethane producer. Super Brand recognition built on six decades of consistency — not campaigns." },
    ],
    film: { src: "/shared/videos/product-film.mp4", poster: "" },
    still: img("/pages/home/promise/foam-promise-bg.webp"),
    overlay: { color: "#000000", opacity: 55 },
  },
};

export const reels = {
  key: "reels",
  label: "Films",
  description: "The copy on the left and the scrolling film strip on the right.",
  fields: [
    f.text("eyebrow", "Small red title"),
    f.text("eyebrowNote", "Small grey note"),
    f.text("titleLine1", "Heading — first line", { size: true }),
    f.text("titleLine2", "Heading — second line (red)", { size: true }),
    f.text("tagline", "Line under the heading"),
    f.textarea("body", "Paragraph", { size: true }),
    f.link("link", "Link"),
    f.list("films", "Films", [f.video("video", "Video"), f.text("title", "Title"), f.text("tag", "Tag")], { itemLabel: (v) => v.title, max: 16 }),
  ],
  defaults: {
    eyebrow: "On film",
    eyebrowNote: "Karmo films",
    titleLine1: "See comfort.",
    titleLine2: "On screen.",
    titleLine1Size: 100,
    titleLine2Size: 100,
    tagline: "Watch the craft",
    body: "From commercials to product close-ups — the films that show how Karmo foam, mattresses and HomeTex are made, tested and lived with.",
    bodySize: 100,
    link: { label: "Explore to view more films", href: "/media/ads" },
    films: [
      { video: { src: "/shared/videos/shorts/fb-karmo-mattress-offer.mp4", poster: "" }, title: "ঘুম নিয়ে সিরিয়াস?", tag: "Offer" },
      { video: { src: "/shared/videos/shorts/fb-reel-921228060438784.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-845505688502810.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-785013297942063.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-747210751746270.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-3242808395880988.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-1822025445099889.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
      { video: { src: "/shared/videos/shorts/fb-reel-759339363519767.mp4", poster: "" }, title: "Karmo Reel", tag: "Reel" },
    ],
  },
};

export const footwear = {
  key: "footwear",
  label: "Footwear foam",
  description: "The foam spec sheet with the exploded shoe.",
  fields: [
    f.image("background", "Background photo"),
    f.overlay("overlay", "Darkness"),
    f.text("eyebrow", "Small title"),
    f.text("titleLine1", "Heading — first line", { size: true }),
    f.text("titleBefore", "Second line — start"),
    f.text("titleAccent", "Second line — faded word"),
    f.text("titleAfter", "Second line — end"),
    f.text("subtitle", "Short line"),
    f.textarea("body", "Paragraph"),
    f.list("claims", "Claim cards", [f.text("title", "Title"), f.text("body", "Text")], { fixed: true, itemLabel: (c) => c.title }),
    f.list("stats", "Figures", [f.text("label", "Label"), f.text("value", "Value")], { fixed: true, itemLabel: (s) => s.label }),
    f.link("button", "Button"),
    f.image("shoe", "Shoe picture"),
    f.image("micro", "Round close-up"),
    f.text("microTitle", "Close-up title"),
    f.list("microBullets", "Close-up points", [f.text("text", "Point")], { itemLabel: (b) => b.text, max: 8 }),
    f.text("servicesTitle", "Services title"),
    f.list("services", "Services", [f.text("title", "Title"), f.text("body", "Text")], { fixed: true, itemLabel: (s) => s.title }),
    f.text("askTitle", "Question"),
    f.text("askBody", "Answer line"),
    f.link("askLink", "Question link"),
  ],
  defaults: {
    background: img("/pages/home/footwear/rolled-black-foam-bg.webp"),
    overlay: { color: "#000000", opacity: 45 },
    eyebrow: "Karmo Foam",
    titleLine1: "Engineered foam",
    titleLine1Size: 100,
    titleBefore: "for",
    titleAccent: "better",
    titleAfter: "footwear",
    subtitle: "Lightweight. Resilient. Built for performance.",
    body: "High-performance polyurethane foam solutions engineered for cushioning, load-bearing and everyday footwear applications.",
    claims: [
      { title: "Cushioning", body: "Enhanced shock absorption and lasting comfort." },
      { title: "Load performance", body: "Reliable resistance under repeated compression." },
      { title: "Lightweight", body: "High performance without unnecessary weight." },
    ],
    stats: [
      { label: "Density range", value: "25 – 40 kg/m³" },
      { label: "Resilience", value: "≥ 50%" },
      { label: "Compression set", value: "≤ 5%" },
    ],
    button: { label: "Explore footwear foam", href: "/foam/footwear" },
    shoe: img("/pages/home/footwear/shoe-exploded-neon.webp", "Exploded view of a Karmo PU foam sports shoe", { fit: "contain" }),
    micro: img("/pages/home/footwear/foam-microstructure.webp", "Karmo PU foam open-cell microstructure", { zoom: 108 }),
    microTitle: "Foam microstructure",
    microBullets: [
      { text: "Open / closed cell structure" },
      { text: "Resilience" },
      { text: "Compression recovery" },
      { text: "Lightweight construction" },
    ],
    servicesTitle: "Foam engineered\naround your product",
    services: [
      { title: "Consistent density", body: "Uniform performance throughout production." },
      { title: "Custom formulation", body: "Foam engineered for your application." },
      { title: "Lightweight construction", body: "Reduce weight without compromising comfort." },
      { title: "Production scale", body: "Reliable supply for commercial manufacturing." },
    ],
    askTitle: "Need a specific density, hardness or resilience?",
    askBody: "Let’s develop it together.",
    askLink: { label: "Talk to our foam team", href: "/contact" },
  },
};

const PARTNER_LOGOS = [
  ["rfl", "RFL", 178, 161], ["navana-group", "Navana Group", 365, 123], ["partex-star", "Partex Star", 369, 121],
  ["brothers-furniture", "Brothers Furniture", 414, 55], ["athena", "Athena", 369, 118], ["legacy-furniture", "Legacy Furniture", 349, 142],
  ["hatim-furniture", "Hatim Furniture", 229, 120], ["allex", "Allex", 336, 122], ["isho-furniture", "ISHO Furniture", 273, 140],
  ["furniture-concept-interior", "Furniture Concept & Interior Ltd.", 224, 146], ["sr-furniture", "SR Furniture", 237, 144],
  ["hi-tech-lifestyle-furniture", "Hi-Tech Lifestyle & Furniture", 384, 128], ["hi-fashion-gallery", "Hi-Fashion Gallery", 230, 154],
  ["market-access-group", "Market Access Group", 205, 154], ["earth-footwear", "Earth Footwear Ltd.", 360, 56], ["apex", "Apex", 343, 139],
  ["bay-footwear", "Bay Footwear", 279, 140], ["panda-footwear", "Panda Footwear", 189, 154], ["lotto", "Lotto", 310, 100],
  ["akij-group", "Akij Group", 141, 161], ["runner", "Runner", 414, 53], ["bata", "Bata", 364, 84], ["step", "Step", 152, 136],
  ["catamount", "Catamount", 414, 39], ["hamko-footwear", "Hamko Footwear", 351, 132], ["pegasus", "Pegasus", 376, 130],
  ["aftab", "Aftab", 209, 161], ["progressive", "Progressive", 352, 151], ["mk-footwear", "MK Footwear", 190, 154],
  ["tk-footwear", "T.K Footwear Ltd.", 406, 74], ["pioneer-group", "Pioneer Group", 210, 145], ["leatherx-footwear", "Leatherx Footwear", 301, 155],
  ["royal-footwear", "Royal Footwear Ltd.", 331, 82], ["italy-footwear", "Italy Footwear Ltd.", 393, 134], ["edison-footwear", "Edison Footwear", 315, 133],
  ["glogo-industry", "Glogo Industry Ltd.", 173, 155],
];

export const partners = {
  key: "partners",
  label: "Partners & clients",
  description: "Three rows of moving logos.",
  fields: [
    f.text("eyebrow", "Small red title"),
    f.text("titleBefore", "Heading — start", { size: true }),
    f.text("titleAccent", "Heading — red part"),
    f.text("titleAfter", "Heading — end"),
    f.list("logos", "Logos", [f.image("logo", "Logo"), f.text("name", "Company name")], { itemLabel: (l) => l.name, max: 120 }),
  ],
  defaults: {
    eyebrow: "Partners & clients",
    titleBefore: "Trusted by",
    titleBeforeSize: 100,
    titleAccent: "100+",
    titleAfter: "makers",
    logos: PARTNER_LOGOS.map(([slug, name, w, h]) => ({ name, logo: img(`/pages/home/partners/${slug}.png`, name, { fit: "contain", width: w, height: h }) })),
  },
};

export const promoBand = {
  key: "promoBand",
  label: "Discount & EMI band",
  description: "Two lifestyle photos with the website-discount card, and the EMI banks panel.",
  fields: [
    f.group("left", "Left photo", [f.image("image", "Photo"), f.text("href", "Opens page")]),
    f.group("right", "Right photo", [f.image("image", "Photo"), f.text("href", "Opens page"), f.text("hoverLabel", "Text on hover")]),
    f.group("offer", "Discount card", [
      f.text("eyebrow", "Dark box — small title"),
      f.text("title", "Dark box — text"),
      f.text("eyebrow2", "Red box — small title"),
      f.text("big", "Red box — big text", { size: true }),
      f.text("label", "Red box — under it"),
    ]),
    f.image("emi", "EMI banks panel"),
  ],
  defaults: {
    left: { href: "/foam", image: img("/pages/home/promo-band/promo-living-room-hq.webp", "A calm Karmo living room with soft seating and natural light", pos("object-[center_40%]")) },
    right: { href: "/mattress", hoverLabel: "View range", image: img("/pages/home/promo-band/promo-couple-bedroom-hq.webp", "A couple reading on the floor beside a Karmo bed dressed in HomeTex bedding", pos("object-[center_58%]")) },
    offer: { eyebrow: "Website orders", title: "Shop online at Karmo", eyebrow2: "All products", big: "5%", bigSize: 100, label: "Discount" },
    emi: img("/pages/home/promo-band/emi-banks-panel-v3.webp", "Up to 12 months EMI available with BRAC Bank, City Bank, MTB, Prime Bank, UCB, One Bank, Jamuna Bank and other partner banks", { fit: "contain" }),
  },
};

/** In page order. */
export const HOME_SECTIONS = [hero, editorials, chemicals, explore, divisions, materials, promo, sizes, promise, reels, footwear, partners, promoBand];

export { NAVY };
