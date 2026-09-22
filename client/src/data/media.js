/**
 * Media Center — three pages under `/media/*`.
 */

const IMG = "/karmo/images/media";

export const mediaNav = [
  { id: "news", name: "News & Blogs", href: "/media/news" },
  { id: "memory", name: "Karmo Memory", href: "/media/memory" },
  { id: "ads", name: "Karmo Ads", href: "/media/ads" },
];

export const mediaPages = {
  news: {
    id: "news",
    path: "/media/news",
    eyebrow: "Media Center",
    title: "News & Blogs",
    lead:
      "Stories from the floor, the showroom and the craft — how Karmo foam, mattresses and HomeTex move through Bangladesh.",
    hero: {
      src: `${IMG}/media-news-hero-v2.png`,
      alt: "Premium Karmo showroom living room with mattress and foam seating",
    },
    layout: "cards",
    items: [
      {
        id: "n1",
        tag: "Mattress",
        title: "Quilt that holds — reading the damask",
        excerpt: "How the euro-top surface is built for airflow and lasting loft.",
        src: `${IMG}/media-news-card-1.jpg`,
        alt: "Close-up of quilted mattress damask",
        date: "Sep 2026",
      },
      {
        id: "n2",
        tag: "Foam",
        title: "Grades on the floor",
        excerpt: "Poly, 280, HD and Signature — why density still decides the room.",
        src: `${IMG}/media-news-card-2.jpg`,
        alt: "Coloured Karmo foam blocks in a cream studio",
        date: "Aug 2026",
      },
      {
        id: "n3",
        tag: "HomeTex",
        title: "Quilts, stacked for the season",
        excerpt: "Bedding that carries the same craft language as the mattress line.",
        src: `${IMG}/media-news-card-3.jpg`,
        alt: "Stacked floral HomeTex quilts",
        date: "Jul 2026",
      },
      {
        id: "n4",
        tag: "Company",
        title: "Inside the Motijheel house",
        excerpt: "A walk through the corridor where dealers meet the range.",
        src: `${IMG}/media-news-card-4.jpg`,
        alt: "Showroom corridor with product samples",
        date: "Jun 2026",
      },
    ],
  },
  memory: {
    id: "memory",
    path: "/media/memory",
    eyebrow: "Media Center",
    title: "Karmo Memory",
    lead:
      "Archive stills from the craft — factory floors, Motijheel light and the materials that built Bangladesh’s first polyurethane house.",
    hero: {
      src: `${IMG}/media-memory-hero-v2.png`,
      alt: "Heritage foam factory with stacked polyurethane blocks in warm light",
    },
    layout: "cards",
    items: [
      {
        id: "m1",
        tag: "Factory",
        title: "Cutting the block",
        excerpt: "Machines that shaped the first grades for furniture and footwear.",
        src: `${IMG}/media-memory-card-1.jpg`,
        alt: "Vintage foam cutting equipment",
        date: "Archive",
      },
      {
        id: "m2",
        tag: "Dhaka",
        title: "Motijheel afternoons",
        excerpt: "The commercial house where Karmo’s offices still open each day.",
        src: `${IMG}/media-memory-card-2.jpg`,
        alt: "Warm Motijheel commercial building exterior",
        date: "Archive",
      },
      {
        id: "m3",
        tag: "Chemicals",
        title: "Tins on the shelf",
        excerpt: "Adhesives and polymers that travelled with the foam line.",
        src: `${IMG}/media-memory-card-3.jpg`,
        alt: "Yellow chemical adhesive tins on warehouse shelves",
        date: "Archive",
      },
    ],
  },
  ads: {
    id: "ads",
    path: "/media/ads",
    eyebrow: "Media Center",
    title: "Karmo Ads",
    lead:
      "Campaign films and commercial frames — the reels that put Karmo foam, mattresses and HomeTex on screen.",
    hero: {
      src: `${IMG}/media-ads-hero-v2.png`,
      alt: "Commercial film set with sofa, foam blocks and softbox lights",
    },
    layout: "reels",
  },
};
