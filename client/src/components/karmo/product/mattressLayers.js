/**
 * What is inside each Karmo mattress, top layer first — from the Karmo mattress brochure
 * ("Fig: Intersection of … Mattress", pages 4, 6, 8, 10, 12, 16, 24 in
 * /pages/mattress/mattress-brochure), drawn the way a studio cut-away shows it:
 * a thin quilted fabric sheet, the padding under it, the foam / spring core, and the
 * quilted border-and-base tray the core sits in. MattressLayersExplode draws these.
 *
 * `mat` picks how the part is drawn (see MattressLayersExplode.jsx);
 * `t` is its drawn thickness (drawing units, not inches).
 */

const FAB = "/products/mattress/fabrics";

const QUILT = { mat: "quilt", t: 7, title: "Jacquard quilting fabric", note: "Exclusive jacquard, quilted by USA machinery" };
const PAD = { mat: "padding", t: 5, title: "Micro-fibre padding", note: "8 oz padding over soft foam and PP non-woven" };
const TRAY = { mat: "tray", t: 40, title: "Quilted border & base", note: "Holds every layer firmly in place" };
const PU = { mat: "soft", t: 24, title: "Soft PU foam", note: "Air-holed foam for a gentle first touch" };
const FELT = { mat: "felt", t: 6, title: "Felt sheet", note: "Turkish fibre, heat-pressed at 180–200°C" };
const PANEL_TOP = { mat: "panel", t: 24, title: "Quilted jacquard panel", note: "Jacquard, soft foam and 8 oz micro-fibre, knitted border" };
const PANEL_BASE = { ...PANEL_TOP, title: "Quilted jacquard base", note: "The same quilted panel underneath" };

const POCKET_CORE = [
  { mat: "visco", t: 22, title: "Visco-elastic foam", note: "Moulds to the shape of your body" },
  { mat: "soft", t: 20, title: "Super-soft foam", note: "Plush cushioning for spinal alignment" },
  { mat: "pocket", t: 84, title: "Pocketed springs", note: "Each coil in its own pocket, in a 3-inch foam encasement" },
  { mat: "foam25", t: 24, title: "25-density foam", note: "Blended with hollow siliconised fibre" },
  PANEL_BASE,
];

export const MATTRESS_LAYERS = {
  king: {
    fabric: `${FAB}/navy-blue.webp`,
    /* The client's own layer picture (background cut out) replaces the drawing (client, 26 Nov 2026). */
    layersImage: "/products/mattress/inside/king-layers-cutout.webp",
    lead: "A mattress for everyone — high-density PE sandwiched between rebonded foam from the finest chips.",
    layers: [
      QUILT,
      PAD,
      { mat: "rebond", t: 38, title: "High-density rebonded foam", note: "Finest hi-density chips, steam-bonded" },
      { mat: "pe", t: 32, title: "Polyethylene foam", note: "Hi-density PE, made only by Karmo" },
      { mat: "rebond", t: 38, title: "High-density rebonded foam", note: "Even support from edge to edge" },
      TRAY,
    ],
  },
  prestige: {
    fabric: `${FAB}/l-white.webp`,
    /* The client's own layer picture (background cut out) replaces the drawing (client, 26 Nov 2026). */
    layersImage: "/products/mattress/inside/prestige-layers-cutout.webp",
    lead: "Two in one — one side hard, one side soft. PE foam sandwiched between felt and rebonded foam.",
    layers: [
      QUILT,
      PAD,
      { ...FELT, note: "The firm side — keeps a straight posture" },
      { mat: "pe", t: 32, title: "Polyethylene foam", note: "Load-bearing core, made only by Karmo" },
      { mat: "rebond", t: 40, title: "Rebonded foam", note: "The plush side — hi-density chips" },
      { ...TRAY, note: "Flip it for the other feel" },
    ],
  },
  orthopedic: {
    fabric: `${FAB}/19-2b.webp`,
    /* The client's own layer picture (background cut out) replaces the drawing on this page (client, 26 Nov 2026). */
    layersImage: "/products/mattress/inside/orthopedic-layers-cutout.webp",
    lead: "Built around the contour of the body and spine — felt and a rebonded core for firm, even support.",
    layers: [
      QUILT,
      PAD,
      PU,
      { ...FELT, note: "Imported Turkish fibre — never loses thickness" },
      { mat: "rebond", t: 46, title: "Rebonded foam core", note: "Hi-density chips for firm spinal support" },
      { ...FELT, note: "Holds a firm, healthy posture" },
      { ...PU, note: "Cushions the reverse side" },
      TRAY,
    ],
  },
  "imperial-eurotop": {
    fabric: `${FAB}/red-wf.webp`,
    lead: "Our stiffest mattress, inspired by Japanese firm sleeping — a relief for the back.",
    layers: [
      QUILT,
      { ...PAD, title: "Quality padding", note: "Standard padding over soft foam and PP non-woven" },
      PU,
      FELT,
      { mat: "pe", t: 38, title: "Polyethylene foam", note: "Hi-density PE for a stiff, back-friendly feel" },
      { ...FELT, note: "Keeps the build firm and level" },
      { ...PU, note: "Cushions the reverse side" },
      TRAY,
    ],
  },
  "bonnell-spring": {
    fabric: `${FAB}/9-9r.webp`,
    lead: "Open-coil springs that answer every pressure point — trusted by hotels and resorts across Bangladesh.",
    layers: [
      PANEL_TOP,
      PU,
      FELT,
      { mat: "bonnell", t: 74, title: "Bonnell spring unit", note: "Hourglass coils, vertex clips and border wire" },
      { ...FELT, note: "GEO sheet and felt protect the coils" },
      { ...PU, note: "Cushions the reverse side" },
      PANEL_BASE,
    ],
  },
  "pillow-top-pocket-spring": {
    fabric: `${FAB}/off-white.webp`,
    lead: "A fluffy 3-inch pillow top over independent pocket springs that move on their own.",
    layers: [
      { mat: "pillowtop", t: 30, title: "3-inch pillow top", note: "Quilted jacquard with foam-wadding technology" },
      ...POCKET_CORE,
    ],
  },
  "euro-top-pocket-spring": {
    fabric: `${FAB}/off-white-02.webp`,
    lead: "A flush, sewn-in euro top over independent pocket springs for no motion transfer.",
    layers: [
      { mat: "panel", t: 26, title: "Euro-top quilt", note: "Flush quilted jacquard with foam wadding" },
      ...POCKET_CORE,
    ],
  },
  topper: {
    fabric: `${FAB}/yellow-rose.webp`,
    lead: "Quilted cotton and soft foam that lay over your mattress for instant extra comfort.",
    layers: [
      { ...QUILT, title: "Quilted cotton cover", note: "100% high-quality cotton, tricot fabric" },
      { mat: "fibre", t: 20, title: "Microfibre fillings", note: "Quilted pockets of soft microfibre" },
      { ...PU, title: "Soft foam", note: "Natural softness, fragrance-free" },
      { mat: "hd", t: 26, title: "High-density foam", note: "Holds its shape night after night" },
      { ...TRAY, t: 32, title: "Cotton border & base", note: "Washable, dust and germ free" },
    ],
  },
};

export function layersFor(slug) {
  return MATTRESS_LAYERS[slug] || MATTRESS_LAYERS.king;
}
