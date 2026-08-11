/**
 * The portfolio gallery — one card per photograph, tagged to the division it
 * belongs to so the filter row can slice the grid without a second data file.
 *
 * Every image here already ships with the site (the homepage's Divisions
 * strip, the foam story, the product spotlights) — nothing new was sourced
 * for this page. That is deliberate: a portfolio built from the same
 * photography the rest of the site uses reads as one body of work rather
 * than a page bolted on for the menu.
 */

export const portfolioFilters = [
  { id: "all", name: "All Work" },
  { id: "foam", name: "Foam" },
  { id: "mattress", name: "Mattress" },
  { id: "hometex", name: "HomeTex" },
  { id: "chemicals", name: "Chemicals" },
];

export const portfolioItems = [
  {
    id: "foam-sofa-studio",
    division: "foam",
    title: "Karmo Foam sofa blocks",
    line: "Furniture foam, studio",
    image: "/karmo/images/home-02/divisions/foam-karmo-sofa-blocks-studio.png",
    alt: "A Karmo Foam sofa with lavender cushions and stacked foam blocks in a studio setting",
    href: "/foam",
  },
  {
    id: "foam-sofa-lavender",
    division: "foam",
    title: "Lavender block cushions",
    line: "Furniture foam",
    image: "/karmo/images/home-02/divisions/foam-karmo-sofa-lavender-blocks.jpeg",
    alt: "Lavender foam cushions stacked beside a Karmo sofa",
    href: "/foam",
  },
  {
    id: "foam-zuti-olive",
    division: "foam",
    title: "Karmo Zuti sofa",
    line: "Furniture foam",
    image: "/karmo/images/home-02/divisions/foam-karmo-zuti-sofa-olive.webp",
    alt: "An olive-toned Karmo Zuti foam sofa",
    href: "/foam",
  },
  {
    id: "foam-story-velvet",
    division: "foam",
    title: "Blue velvet, foam core",
    line: "Furniture foam",
    image: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
    alt: "A blue velvet sofa built on Karmo Foam",
    href: "/foam",
  },
  {
    id: "mattress-floral",
    division: "mattress",
    title: "Floral bedroom suite",
    line: "Mattress",
    image: "/karmo/images/home-02/divisions/mattress-karmo-floral-bedroom.jpg",
    alt: "A Karmo floral mattress on an upholstered bed in an elegant bedroom",
    href: "/mattress",
  },
  {
    id: "mattress-pro-room",
    division: "mattress",
    title: "Karmo Pro Foam Mattress",
    line: "Mattress",
    image: "/karmo/images/home-02/divisions/mattress-karmo-pro-foam-room.webp",
    alt: "A Karmo Pro Foam Mattress styled in a bedroom",
    href: "/mattress",
  },
  {
    id: "mattress-cutaway",
    division: "mattress",
    title: "Cross-section, spring & foam",
    line: "Mattress",
    image: "/karmo/images/products/spotlight-mattress-cutaway.png",
    alt: "A cutaway view of a Karmo mattress showing its spring and foam layers",
    href: "/mattress",
  },
  {
    id: "mattress-280-scene",
    division: "mattress",
    title: "280 Foam Combo",
    line: "Mattress",
    image: "/karmo/images/products/karmo-280-scene.png",
    alt: "The Karmo 280 Foam Combo styled in a bedroom scene",
    href: "/mattress",
  },
  {
    id: "hometex-bedding-room",
    division: "hometex",
    title: "Bedding, styled room",
    line: "HomeTex",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
    alt: "Karmo HomeTex bedding in a styled bedroom",
    href: "/hometex",
  },
  {
    id: "hometex-bedding-studio",
    division: "hometex",
    title: "Bedding, studio set",
    line: "HomeTex",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
    alt: "A Karmo HomeTex bedding set photographed in studio",
    href: "/hometex",
  },
  {
    id: "hometex-bedding-set",
    division: "hometex",
    title: "Comforter & pillow set",
    line: "HomeTex",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
    alt: "A Karmo comforter and pillow set",
    href: "/hometex",
  },
  {
    id: "chemicals-adhesive-tins",
    division: "chemicals",
    title: "Adhesive tins, showroom",
    line: "Chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
    alt: "Karmo Adhesive tins arranged in a showroom setting",
    href: "/chemicals",
  },
  {
    id: "chemicals-resin-bottles",
    division: "chemicals",
    title: "Resin bottles, product line",
    line: "Chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-karmo-resin-bottles.png",
    alt: "A line-up of Karmo resin bottles",
    href: "/chemicals",
  },
  {
    id: "chemicals-product",
    division: "chemicals",
    title: "Adhesive, close-up",
    line: "Chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-karmo-product.png",
    alt: "A close view of a Karmo adhesive product",
    href: "/chemicals",
  },
];
