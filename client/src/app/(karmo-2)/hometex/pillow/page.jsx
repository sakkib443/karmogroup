import Image from "next/image";
import PillowHero from "@/components/karmo/division/PillowHero";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import HometexShapeGrid from "@/components/karmo/division/HometexShapeGrid";
import DivisionAbout from "@/components/karmo/division/DivisionAbout";

import hometex from "@/data/divisions/hometex";
import foam from "@/data/divisions/foam";

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
      img: "/new%20icon/why-choose-1.png",
      title: "Unmatched Energy Recovery",
    },
    {
      img: "/new%20icon/why-choose-2.png",
      title: "Premium Plush Microfiber",
    },
    {
      img: "/new%20icon/why-choose-3.png",
      title: "Pure Comfort For Everyone",
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-12">
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
            <div className="pt-4 pb-2 text-center px-4">
              <h3 className="text-[12px] sm:text-[13px] lg:text-[14px] font-bold text-[#17191c] uppercase tracking-[0.1em]">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const customShapeGrid = {
  ...foam.shapeGrid,
  highlights: [
    {
      id: "feather-touch",
      icon: "feather",
      badge: "red",
      title: "Feather-Touch Microfibre",
      overview: "Premium down-like softness crafted for ultimate relaxation and breathability, bringing a luxurious hotel-feel to your everyday sleep.",
      background: "/karmo/images/pillow/card-01.png",
    },
    {
      id: "soft-luxurious",
      icon: "certificate",
      badge: "blue",
      title: "Soft & Luxurious",
      overview: "Experience a plush, cloud-like feel that gently cradles your head, providing a soothing rest free from pressure points.",
    },
    {
      id: "long-lasting",
      icon: "shield",
      badge: "green",
      title: "Long-Lasting Shape",
      overview: "Engineered with resilient microfibre that retains its loft and bounce night after night, resisting flattening over time.",
    }
  ],
  spotlight: {
    image: "/karmo/images/pillow/banner-02.png",
    alt: "Karmo Pillow Banner",
    overlay: true, // we'll add support for this
    headingLead: "",
    headingAccent: "",
    headingEnd: "",
    subline: "",
    brand: "",
  },
  film: null,
  still: "/karmo/images/pillow/card-02.png",
  filmOverlay: true,
};

const customLounge = {
  ...foam.lounge,
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
        src: "/karmo/images/hometex/pillow/karmo-plush-travel-suitcase-hero-v2.png",
        alt: "A Karmo Plush pillow packed in an open suitcase beside headphones, a wallet, an orange knit and a travel list, on a warm cream backdrop",
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
      <HometexShapeGrid {...customShapeGrid} />
      <DivisionAbout {...customLounge} />
      <DivisionProducts {...pillowPage.products} categoryId="all" />
      <OrderAndContact />
    </>
  );
}
