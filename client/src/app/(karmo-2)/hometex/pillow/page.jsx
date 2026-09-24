import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import PillowHero from "@/components/karmo/division/PillowHero";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import DivisionShapeGrid from "@/components/karmo/division/DivisionShapeGrid";
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
  features: [
    {
      id: "feather-touch",
      icon: "/new%20icon/Microfibre.png",
      title: "Feather-Touch Microfibre",
      note: "Premium down-like softness",
    },
    {
      id: "imported",
      icon: "/karmo/images/trust/delivery-icon.png",
      title: "Imported from Indonesia",
      note: "Finest international materials",
    },
    {
      id: "soft",
      icon: "/new%20icon/Soft.png",
      title: "Soft & Luxurious",
      note: "Ultimate plush comfort",
    },
    {
      id: "long-lasting",
      icon: "/karmo/images/trust/recognised-super-brand.png",
      title: "Long-Lasting Shape",
      note: "Retains loft night after night",
    },
  ],
};

function ZonesIcon({ id, className = "" }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {id === "springs" && (
        <>
          <rect x="6" y="8" width="5" height="16" rx="2.5" {...stroke} />
          <rect x="13.5" y="8" width="5" height="16" rx="2.5" {...stroke} />
          <rect x="21" y="8" width="5" height="16" rx="2.5" {...stroke} />
        </>
      )}
      {id === "pillow" && (
        <>
          <path d="M5 18c0-4 3.2-7 8-7h6c4.8 0 8 3 8 7v2.5c0 1.4-1.1 2.5-2.5 2.5h-17A2.5 2.5 0 0 1 5 20.5V18Z" {...stroke} />
          <path d="M9 13.5c1.2-1.4 2.8-2 5-2" {...stroke} />
        </>
      )}
      {id === "foam" && (
        <>
          <rect x="5" y="10" width="22" height="4" rx="1" {...stroke} />
          <rect x="5" y="16" width="22" height="3.5" rx="1" {...stroke} />
          <rect x="5" y="21.5" width="22" height="3" rx="1" {...stroke} />
        </>
      )}
      {id === "plush" && (
        <>
          <path d="M24.7 7.3A5.8 5.8 0 0 0 16.5 7.3L7.3 16.5A5.7 5.7 0 0 0 5.6 20.6V26.4H11.4A5.7 5.7 0 0 0 15.5 24.7L24.7 15.5A5.8 5.8 0 0 0 24.7 7.3Z" {...stroke} />
          <path d="M18.8 13.2L13.2 18.8" {...stroke} />
        </>
      )}
      {id === "support" && (
        <>
          <path d="M6 16c0-5.5 4.5-10 10-10s10 4.5 10 10" {...stroke} />
          <path d="M12 16a4 4 0 1 0 8 0" {...stroke} />
        </>
      )}
      {id === "breathable" && (
        <>
          <path d="M4 12h14a3 3 0 0 0 0-6 3 3 0 0 0-3 3" {...stroke} />
          <path d="M2 18h18a3 3 0 0 1 0 6 3 3 0 0 1-3-3" {...stroke} />
          <path d="M8 24h6a3 3 0 0 0 0-6" {...stroke} />
        </>
      )}
    </svg>
  );
}

function FoamZones({ data }) {
  if (!data.zones) return null;
  return (
    <>
      <section className="relative mb-0 grid w-full overflow-hidden bg-[#0b1a33] lg:grid-cols-[minmax(17rem,0.34fr)_minmax(0,1fr)] lg:aspect-[3.2/1]">
        {/* Left rail — copy + icons + CTA */}
        <div className="relative z-[1] flex flex-col items-center justify-center px-5 py-8 text-center sm:px-7 lg:px-9 lg:py-6">
          <h2 className="display section-heading title-card-line uppercase text-white">
            {data.zones.heading}
          </h2>
          {data.zones.subheading && (
            <p className="body-copy mt-3 max-w-[26rem] text-[12.5px] leading-[1.6] text-white/65 sm:text-[13px]">
              {data.zones.subheading}
            </p>
          )}
          {data.zones.icons?.length > 0 && (
            <ul className="mt-5 grid w-full grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
              {data.zones.icons.map((icon) => (
                <li key={icon.id} className="flex flex-col items-center text-center">
                  {icon.src ? (
                    <span className="relative mx-auto flex h-14 w-14 items-center justify-center overflow-hidden bg-[#fff8f0] sm:h-16 sm:w-16">
                      <img
                        src={icon.src}
                        alt=""
                        aria-hidden="true"
                        width={64}
                        height={64}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                  ) : (
                    <ZonesIcon id={icon.id} className="h-9 w-9 text-white sm:h-10 sm:w-10" />
                  )}
                  <span className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-white/85 sm:text-[11px]">
                    {icon.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {data.zones.cta && (
            <Link
              href={data.zones.cta.href}
              className="mt-6 inline-flex h-[44px] w-full items-center justify-center gap-2 bg-brand text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark sm:mt-7 sm:h-[48px]"
            >
              {data.zones.cta.label}
              <FiArrowRight className="text-[15px]" />
            </Link>
          )}
        </div>

        {/* Right — cutaway fills the remaining space, no empty blue gap */}
        <div className="relative min-h-[220px] bg-[#c7d9e8] sm:min-h-[280px] lg:min-h-0">
          <Image
            src={data.zones.src}
            alt={data.zones.alt}
            fill
            className="object-cover object-[72%_center]"
            sizes="(min-width: 1024px) 68vw, 100vw"
            priority={false}
          />
          {data.zones.overlay && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
        </div>
      </section>
    </>
  );
}

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
        <h2 className="display text-center text-[clamp(1.5rem,3vw,2.5rem)] font-semibold uppercase tracking-wider text-[#17191c]">
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
              <h3 className="text-[11px] sm:text-[12px] font-bold text-[#17191c] uppercase tracking-[0.1em]">{item.title}</h3>
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
  slides: [
    {
      id: "pillow-lounge",
      align: "left",
      headingLead: "Experience Cloud-Like Comfort",
      headingAccent: "",
      kicker: "",
      cta: [],
      image: {
        src: "/karmo/images/pillow/banner-01.png",
        alt: "Karmo Pillow Banner",
      },
      veil: true,
    }
  ]
};

const customFoam = {
  ...foam,
  zones: {
    ...foam.zones,
    heading: "Crafted for Perfect Sleep",
    subheading: "Premium microfibre fill, breathable casing, and ergonomic design—engineered to support your neck and align your spine all night long.",
    icons: [
      { id: "plush", label: "Plush Feel" },
      { id: "support", label: "Neck Support" },
      { id: "breathable", label: "Breathable" },
    ],
    src: "/karmo/images/pillow/bottom-banner.png",
    overlay: true,
    cta: null,
  },
};

export default function PillowRoute() {
  return (
    <>
      <PillowHero />
      <DivisionFeatures items={pillowPage.features} />
      <WhyChoosePillows />
      <DivisionShapeGrid {...customShapeGrid} />
      <DivisionAbout {...customLounge} />
      <FoamZones data={customFoam} />
      <DivisionProducts {...pillowPage.products} categoryId="all" />
      <OrderAndContact />
    </>
  );
}
