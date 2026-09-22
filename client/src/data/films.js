/**
 * Karmo film / reel catalogue — shared by homepage Reels and Media Ads.
 */

export const karmoFilms = [
  {
    id: "fb-karmo-mattress-offer",
    src: "/karmo/videos/shorts/fb-karmo-mattress-offer.mp4",
    title: "ঘুম নিয়ে সিরিয়াস?",
    tag: "Offer",
  },
  {
    id: "fb-reel-921228060438784",
    src: "/karmo/videos/shorts/fb-reel-921228060438784.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-845505688502810",
    src: "/karmo/videos/shorts/fb-reel-845505688502810.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-785013297942063",
    src: "/karmo/videos/shorts/fb-reel-785013297942063.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-747210751746270",
    src: "/karmo/videos/shorts/fb-reel-747210751746270.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-3242808395880988",
    src: "/karmo/videos/shorts/fb-reel-3242808395880988.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-1822025445099889",
    src: "/karmo/videos/shorts/fb-reel-1822025445099889.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "fb-reel-759339363519767",
    src: "/karmo/videos/shorts/fb-reel-759339363519767.mp4",
    title: "Karmo Reel",
    tag: "Reel",
  },
  {
    id: "v1-tisa",
    src: "/karmo/videos/shorts/v1-tisa.mp4",
    title: "Tisa — a quiet moment",
    tag: "Short",
  },
  {
    id: "v2",
    src: "/karmo/videos/shorts/v2.mp4",
    title: "Comfort on camera",
    tag: "Short",
  },
  {
    id: "v3",
    src: "/karmo/videos/shorts/v3.mp4",
    title: "Lived-in rooms",
    tag: "Short",
  },
  {
    id: "v4",
    src: "/karmo/videos/shorts/v4.mp4",
    title: "Soft light, soft rest",
    tag: "Short",
  },
  {
    id: "v5",
    src: "/karmo/videos/shorts/v5.mp4",
    title: "Everyday Karmo",
    tag: "Short",
  },
  {
    id: "tvc-mattress",
    src: "/karmo/videos/tvc-mattress.mp4",
    title: "Karmo Mattress, the commercial",
    tag: "Commercial",
  },
  {
    id: "product-film",
    src: "/karmo/videos/product-film.mp4",
    title: "A room built on Karmo",
    tag: "Interiors",
  },
  {
    id: "reel-4",
    src: "/karmo/videos/reel-4.mp4",
    title: "Pocketed spring array",
    tag: "Inside the product",
  },
  {
    id: "reel-3",
    src: "/karmo/videos/reel-3.mp4",
    title: "Rebound on the quilted top",
    tag: "Inside the product",
  },
  {
    id: "reel-1",
    src: "/karmo/videos/reel-1.mp4",
    title: "CertiGuard germ protection",
    tag: "Certification",
  },
  {
    id: "tvc-foam",
    src: "/karmo/videos/tvc-foam.mp4",
    title: "Karmo Foam, from the archive",
    tag: "Archive",
  },
  {
    id: "sleep-well",
    src: "/karmo/videos/mattress-sleep-well.mp4",
    title: "Sleep well, live well",
    tag: "Lifestyle",
  },
];

/** Homepage marquee — keep the strip focused. */
export const homeReelIds = [
  "fb-karmo-mattress-offer",
  "fb-reel-921228060438784",
  "fb-reel-845505688502810",
  "fb-reel-785013297942063",
  "fb-reel-747210751746270",
  "fb-reel-3242808395880988",
  "fb-reel-1822025445099889",
  "fb-reel-759339363519767",
];

export const homeReels = karmoFilms.filter((f) => homeReelIds.includes(f.id));
