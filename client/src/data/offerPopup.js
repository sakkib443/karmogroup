/**
 * The offer card shown once to a visitor the first time they open the site
 * (client, 28 Nov 2026). Edit the words, picture and link here.
 *
 * `version`: change it (e.g. "2026-12") when there is a NEW offer — everyone who
 * closed the old card will then see the new one once.
 * `enabled: false` switches the card off everywhere.
 */
export const OFFER_POPUP = {
  enabled: true,
  version: "2026-11",
  delayMs: 1200,
  image: "/pages/mattress/divisions/karmo-king-mattress-main.webp",
  imageAlt: "Karmo King Mattress in a bright bedroom",
  eyebrow: "Limited-time offer",
  titleLead: "Hot offer",
  titleAccent: "for you",
  text: "Special prices on Karmo mattresses — every one tested one by one, sized and priced for Bangladesh homes, delivered to your door.",
  /* Short lines under the text, each with a tick. Put the real offer points here (left empty
     until the client gives them, so nothing untrue is promised). */
  points: [],
  ctaLabel: "See the offers",
  ctaHref: "/mattress#mattress-offers",
  note: "Offer valid while stock lasts.",
};
