/**
 * Media Center — three pages under `/media/*`. Pictures are the homepage's and
 * the foam and mattress pages' own photos; the covers run on the homepage hero
 * slider (one-line title card, the homepage's 32% veil on room photos).
 *
 * Story grids: the first item is the big tile, the second the wide one, the
 * rest the small ones — order the items for the pictures they carry.
 */

const veil = { color: "#000000", opacity: 32 };

const slide = (id, src, alt, headingLead, align = "center", overlay = veil) => ({
  id,
  image: { src, alt },
  headingLead,
  align,
  titleCard: true,
  overlay,
});

export const mediaNav = [
  { id: "news", name: "News & Blogs", href: "/media/news" },
  { id: "memory", name: "Karmo Memory", href: "/media/memory" },
  { id: "ads", name: "Karmo Ads", href: "/media/ads" },
];

export const mediaPages = {
  news: {
    id: "news",
    path: "/media/news",
    title: "News & Blogs",
    lead:
      "Stories from the floor, the showroom and the craft — how Karmo foam, mattresses and HomeTex move through Bangladesh.",
    /* Single banner (not a slider): one image, heading on the left over the
       empty wall. */
    slides: [
      slide("news-hero", "/pages/news-blog/karmo-mattress-sunlit-bedroom.png", "A Karmo quilted mattress on a bed in a bright, sunlit bedroom", "News & Blogs", "left"),
    ],
    layout: "cards",
    items: [
      {
        id: "n1",
        tag: "Foam",
        title: "The foam behind great seating",
        excerpt: "How Karmo rubber-grade foam keeps sofas firm, breathable and comfortable for years.",
        src: "/pages/news-blog/feature-foam-seating-bion-shadow.webp",
        alt: "A Karmo foam sofa with a plush cushion and tan leather side, warm light casting a plant shadow on a dark wall",
        date: "Sep 2026",
      },
      {
        id: "n4",
        tag: "Company",
        title: "Inside the showroom",
        excerpt: "Where dealers meet the full range.",
        src: "/pages/mattress/bands/mattress-showroom-interior.webp",
        alt: "Karmo mattress showroom interior",
        date: "Jun 2026",
      },
      {
        id: "n2",
        tag: "Foam",
        title: "Grades on the floor",
        excerpt: "Poly, 280, HD and Signature — why density still decides the room.",
        src: "/shared/divisions/foam-karmo-sofa-blocks-studio.webp",
        alt: "Karmo foam blocks beside a sofa in a studio",
        date: "Aug 2026",
      },
      {
        id: "n3",
        tag: "HomeTex",
        title: "Quilts, stacked for the season",
        excerpt: "Bedding that carries the same craft language as the mattress line.",
        src: "/pages/home/divisions/editorial-v2/hometex-quilt-stack-hq.webp",
        alt: "Stacked floral Karmo HomeTex quilts",
        date: "Jul 2026",
      },
    ],
  },
  memory: {
    id: "memory",
    path: "/media/memory",
    title: "Karmo Memory",
    lead:
      "Stills from the craft — the foam, the quilting and the materials that built Bangladesh’s first polyurethane house.",
    /* Same fixed banner as News & Blogs — only the heading changes between the
       Media Center tabs, the picture stays put. */
    slides: [
      slide("memory-hero", "/pages/news-blog/karmo-mattress-sunlit-bedroom.png", "A Karmo quilted mattress on a bed in a bright, sunlit bedroom", "Karmo Memory", "left"),
    ],
    layout: "cards",
    items: [
      {
        id: "m1",
        tag: "Factory",
        title: "Cutting the block",
        excerpt: "The foam that shaped the first grades for furniture and footwear.",
        src: "/pages/foam/furniture/hero/karmo-embossed-charcoal-foam-layers.webp",
        alt: "Layers of charcoal Karmo foam embossed with the Karmo mark",
        date: "Archive",
      },
      {
        id: "m3",
        tag: "Mattress",
        title: "Quilted on U.S. machinery",
        excerpt: "Panels quilted and edged under 500-ton roller pressure.",
        src: "/pages/home/divisions/editorial-v2/mattress-press-pro-fill-hq.webp",
        alt: "A Karmo mattress pressed to show its fill",
        date: "Archive",
      },
      {
        id: "m2",
        tag: "Chemicals",
        title: "Tins on the shelf",
        excerpt: "Adhesives and polymers that travelled with the foam line.",
        src: "/pages/home/divisions/editorial-v2/chemicals-tins-hq.webp",
        alt: "Karmo adhesive tins",
        date: "Archive",
      },
      {
        id: "m4",
        tag: "Since 1965",
        title: "The first polyurethane house",
        excerpt: "Bangladesh’s first maker of polyurethane foam.",
        src: "/pages/foam/furniture/products/1965-cover.webp",
        alt: "Karmo 1965 foam grade",
        date: "1965",
      },
    ],
  },
  ads: {
    id: "ads",
    path: "/media/ads",
    title: "Karmo Ads",
    lead:
      "Campaign films and commercial frames — the reels that put Karmo foam, mattresses and HomeTex on screen.",
    /* Same fixed banner as News & Blogs — only the heading changes between the
       Media Center tabs, the picture stays put. */
    slides: [
      slide("ads-hero", "/pages/news-blog/karmo-mattress-sunlit-bedroom.png", "A Karmo quilted mattress on a bed in a bright, sunlit bedroom", "Karmo Ads", "left"),
    ],
    layout: "reels",
  },
};
