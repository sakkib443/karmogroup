import Image from "next/image";
import PillowHero from "@/components/karmo/division/PillowHero";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import PillowTwoBanners from "@/components/karmo/division/PillowTwoBanners";
import DivisionAbout from "@/components/karmo/division/DivisionAbout";

import hometex from "@/data/divisions/hometex";

export const metadata = {
  title: "Pillow | Karmo Group",
  description: "Explore Karmo pillows and HomeTex bedding for your everyday comfort.",
};

const pillowPage = {
  ...hometex,
  slug: "pillow",
  banner: { hidden: true },
  /* No pillow-specific `features` override — the client asked for the same
     trust strip every other division page uses (legacy/trusted/recognised/
     natural/delivery/stores), not a bespoke set. `...hometex` above already
     carries it, so this page now just doesn't shadow it. */
};

function WhyChoosePillows() {
  const items = [
    {
      img: "/pages/hometex/pillow/why-choose/why-choose-1.png",
      title: "Unmatched Energy Recovery",
    },
    {
      img: "/pages/hometex/pillow/why-choose/why-choose-2.png",
      title: "Premium Plush Microfiber",
    },
    {
      img: "/pages/hometex/pillow/why-choose/why-choose-3.png",
      title: "Pure Comfort For Everyone",
    }
  ];

  return (
    <section className="bg-white pt-8 sm:pt-10 lg:pt-12 pb-3 sm:pb-4 mb-1.5">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
        <h2 className="display section-heading title-card-line text-center uppercase text-[#17191c]">
          WHY CHOOSE KARMO PILLOWS?
        </h2>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-[6px]">
        {items.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col">
            <div className="relative w-full aspect-[3/2] overflow-hidden group bg-stone-200">
              <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="pt-3 pb-1 text-center px-4">
              <h3 className="text-[12px] sm:text-[13px] lg:text-[14px] font-bold text-[#17191c] uppercase tracking-[0.1em]">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


const PILLOW_IMG = "/products/hometex/pillow";

/* Same 19 SKUs as karmogroup.com/pillow — front photo + the live shop's
   second (hover) image. Size variants that share a photo there share it here. */
const pillowCatalogue = [
  {
    id: "2-relaxtime-cushion-offer",
    name: "2 RelaxTime Cushion Offer",
    image: `${PILLOW_IMG}/2-cushion.jpg`,
    imageHover: `${PILLOW_IMG}/2-cushion-hover.jpg`,
    alt: "Two white Karmo Relax Time cushions",
    now: "৳ 470",
  },
  {
    id: "4-relaxtime-cushion-offer",
    name: "4 RelaxTime Cushion Offer",
    image: `${PILLOW_IMG}/4-cushion.jpg`,
    imageHover: `${PILLOW_IMG}/4-cushion-hover.jpg`,
    alt: "Four white Karmo Relax Time cushions",
    now: "৳ 850",
  },
  {
    id: "6-relaxtime-cushion-offer",
    name: "6 RelaxTime Cushion Offer",
    image: `${PILLOW_IMG}/6-cushion.jpg`,
    imageHover: `${PILLOW_IMG}/6-cushion-hover.jpg`,
    alt: "Six white Karmo Relax Time cushions",
    now: "৳ 1,240",
  },
  {
    id: "plush-pillow-combo-offer",
    name: "Plush Pillow Combo Offer",
    image: `${PILLOW_IMG}/plush-combo.jpg`,
    imageHover: `${PILLOW_IMG}/plush-combo-hover.jpg`,
    alt: "Karmo Plush pillow combo tied with a red ribbon",
    now: "৳ 2,599",
  },
  {
    id: "relaxtime-pillow-combo-offer",
    name: "RelaxTime Pillow Combo Offer",
    image: `${PILLOW_IMG}/relax-combo.jpg`,
    imageHover: `${PILLOW_IMG}/relax-combo-hover.jpg`,
    alt: "Karmo Relax Time pillow combo",
    now: "৳ 1,599",
  },
  {
    id: "relaxtime-pillow-combo-offer-999",
    name: "RelaxTime Pillow Combo Offer",
    image: `${PILLOW_IMG}/relax-combo-999.jpg`,
    imageHover: `${PILLOW_IMG}/relax-combo-999-hover.jpg`,
    alt: "Karmo Relax Time pillow combo offer",
    now: "৳ 999",
  },
  {
    id: "plush-pillow-combo-offer-2060",
    name: "Plush Pillow Combo Offer",
    image: `${PILLOW_IMG}/plush-combo-2060.jpg`,
    imageHover: `${PILLOW_IMG}/plush-head-hover.jpg`,
    alt: "Karmo Plush pillow combo offer",
    now: "৳ 2,060",
  },
  {
    id: "plush-head-18x24",
    name: "Plush Head Pillow (18″ x 24″)",
    image: `${PILLOW_IMG}/plush-head.jpg`,
    imageHover: `${PILLOW_IMG}/plush-head-hover.jpg`,
    alt: "Two stacked white Karmo Plush head pillows",
    now: "৳ 1,030",
  },
  {
    id: "plush-head-18x26",
    name: "Plush Head Pillow (18″ x 26″)",
    image: `${PILLOW_IMG}/plush-head.jpg`,
    imageHover: `${PILLOW_IMG}/plush-head-hover.jpg`,
    alt: "Two stacked white Karmo Plush head pillows",
    now: "৳ 1,050",
  },
  {
    id: "plush-head-18x28",
    name: "Plush Head Pillow (18″ x 28″)",
    image: `${PILLOW_IMG}/plush-head.jpg`,
    imageHover: `${PILLOW_IMG}/plush-head-hover.jpg`,
    alt: "Two stacked white Karmo Plush head pillows",
    now: "৳ 1,080",
  },
  {
    id: "relaxtime-head-18x24",
    name: "RelaxTime Head Pillow (18″ x 24″)",
    image: `${PILLOW_IMG}/relaxtime-head.jpg`,
    imageHover: `${PILLOW_IMG}/relax-combo-999-hover.jpg`,
    alt: "Three stacked white Karmo Relax Time head pillows",
    now: "৳ 500",
  },
  {
    id: "relaxtime-head-18x26",
    name: "RelaxTime Head Pillow (18″ x 26″)",
    image: `${PILLOW_IMG}/relaxtime-head-26.jpg`,
    imageHover: `${PILLOW_IMG}/relax-combo-999-hover.jpg`,
    alt: "White Karmo Relax Time head pillows",
    now: "৳ 550",
  },
  {
    id: "relaxtime-head-18x28",
    name: "RelaxTime Head Pillow (18″ x 28″)",
    image: `${PILLOW_IMG}/relaxtime-head.jpg`,
    imageHover: `${PILLOW_IMG}/relaxtime-head-28-hover.jpg`,
    alt: "Three stacked white Karmo Relax Time head pillows",
    now: "৳ 570",
  },
  {
    id: "side-pillow-32x27",
    name: "Side Pillow (32″ x 27″)",
    image: `${PILLOW_IMG}/side-pillow.jpg`,
    imageHover: `${PILLOW_IMG}/side-pillow-hover.png`,
    alt: "Two white Karmo Relax Time side pillows",
    now: "৳ 630",
  },
  {
    id: "side-pillow-38x32",
    name: "Side Pillow (38″ x 32″)",
    image: `${PILLOW_IMG}/side-pillow.jpg`,
    imageHover: `${PILLOW_IMG}/side-pillow-hover.png`,
    alt: "Two white Karmo Relax Time side pillows",
    now: "৳ 730",
  },
  {
    id: "cushion-14x14",
    name: "Cushion (14″ x 14″)",
    image: `${PILLOW_IMG}/cushion.jpg`,
    imageHover: `${PILLOW_IMG}/cushion-hover.jpg`,
    alt: "Two stacked white Karmo Relax Time cushions",
    now: "৳ 220",
  },
  {
    id: "cushion-16x16",
    name: "Cushion (16″ x 16″)",
    image: `${PILLOW_IMG}/cushion.jpg`,
    imageHover: `${PILLOW_IMG}/cushion-hover.jpg`,
    alt: "Two stacked white Karmo Relax Time cushions",
    now: "৳ 260",
  },
  {
    id: "cushion-18x18",
    name: "Cushion (18″ x 18″)",
    image: `${PILLOW_IMG}/cushion.jpg`,
    imageHover: `${PILLOW_IMG}/cushion-hover.jpg`,
    alt: "Two stacked white Karmo Relax Time cushions",
    now: "৳ 280",
  },
  {
    id: "cushion-20x20",
    name: "Cushion (20″ x 20″)",
    image: `${PILLOW_IMG}/cushion.jpg`,
    imageHover: `${PILLOW_IMG}/cushion-hover.jpg`,
    alt: "Two stacked white Karmo Relax Time cushions",
    now: "৳ 310",
  },
];

const customLounge = {
  layout: "overlay",
  // 90vh-tall showcase band. It holds the client's own suitcase flat-lay (the
  // artwork that was in the hero before the sideboard image), not the original
  // `bottom-banner.png`. That one was 16:9 and letterboxed with `contain`; this
  // one is a 2.5:1 banner with the suitcase on the right and empty backdrop on
  // the left, so it is `cover` anchored right (the suitcase stays whole) — the
  // same framing the hero used for it.
  frameClassName: "relative w-full h-[90vh]",
  slides: [
    {
      id: "pillow-lounge",
      align: "left",
      headingLead: "Experience Cloud-Like Comfort",
      headingAccent: "",
      kicker: "",
      cta: [],
      image: {
        src: "/pages/hometex/pillow/Minimalist Suitcase Travel Flatlay.png",
        alt: "A Karmo Plush pillow packed in an open suitcase beside headphones, a wallet, an orange knit and notepad, on a warm cream backdrop",
        position: "object-[63%_center] lg:object-right",
      },
      veil: true,
    }
  ]
};

export default function PillowRoute() {
  return (
    <>
      <PillowHero />
      <DivisionFeatures items={pillowPage.features} />
      <WhyChoosePillows />
      <PillowTwoBanners />
      <DivisionAbout {...customLounge} />
      <DivisionProducts
        eyebrow="Best price"
        headingLead="Hot offer"
        headingAccent="for you"
        offersId="pillow-offers"
        body=""
        items={pillowCatalogue}
        categoryId="all"
        hoverOverlay
      />
      <OrderAndContact />
    </>
  );
}
