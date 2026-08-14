"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import SectionLabel from "./SectionLabel";

/**
 * Shop by comfort / size / type — three lists, one row.
 *
 * The client's note on this one was "cartoonized menu": the reference used
 * thin grey outline icons and they wanted the flat coloured kind. So the icons
 * are drawn here, in the same language as `icons/CartoonIcons.jsx` — flat
 * fills, no gradients, rounded corners, depth from a darker tone of the same
 * colour, and nothing outside that palette.
 *
 * Cross-sections rather than pictures of beds: at 28px a whole bed is a smudge,
 * while a stack of layers reads instantly and says the right thing about a
 * mattress — what it is made of, in order.
 *
 * ⚠ Coir and Latex under "Type" are unconfirmed — same open question as the
 * material band. See `CLIENT-FEEDBACK.md`.
 */

const C = {
  red: "#E60000",
  redDeep: "#B31212",
  gold: "#F5B93F",
  goldDeep: "#DC9A1E",
  cream: "#FBEEE0",
  creamDeep: "#EBD8C3",
  ink: "#3A322C",
};

function Slab({ y, h, fill, deep, w = 24 }) {
  const x = (32 - w) / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={deep} />
      <rect x={x} y={y} width={w} height={h - 1.6} rx="2.5" fill={fill} />
    </>
  );
}

/** A mattress in section — the number and weight of layers is the message. */
function Layers({ layers }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <ellipse cx="16" cy="27.6" rx="9.5" ry="1.5" fill="#3A322C14" />
      {layers}
    </svg>
  );
}

const IconFirm = () => (
  <Layers
    layers={
      <>
        <Slab y={16} h={9} fill={C.redDeep} deep={C.redDeep} />
        <Slab y={11} h={6} fill={C.red} deep={C.redDeep} />
        <Slab y={7} h={5} fill={C.cream} deep={C.creamDeep} />
      </>
    }
  />
);

const IconMedium = () => (
  <Layers
    layers={
      <>
        <Slab y={17} h={8} fill={C.gold} deep={C.goldDeep} />
        <Slab y={12} h={6} fill={C.red} deep={C.redDeep} />
        <Slab y={6} h={7} fill={C.cream} deep={C.creamDeep} />
      </>
    }
  />
);

const IconSoft = () => (
  <Layers
    layers={
      <>
        <Slab y={19} h={6} fill={C.goldDeep} deep={C.goldDeep} />
        <Slab y={14} h={6} fill={C.gold} deep={C.goldDeep} />
        <Slab y={5} h={10} fill={C.cream} deep={C.creamDeep} />
      </>
    }
  />
);

/** Beds from above, at three widths — the size ladder in miniature. */
function BedIcon({ w }) {
  const x = (32 - w) / 2;
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <ellipse cx="16" cy="28.4" rx="9.5" ry="1.4" fill="#3A322C14" />
      <rect x={x - 1} y="4" width={w + 2} height="3" rx="1.5" fill={C.redDeep} />
      <rect x={x} y="6" width={w} height="21" rx="2.5" fill={C.creamDeep} />
      <rect x={x} y="6" width={w} height="19.5" rx="2.5" fill={C.cream} />
      <rect x={x + 1.5} y="8" width={w - 3} height="5" rx="2" fill="#FFFFFF" />
      <rect x={x} y="16" width={w} height="11" rx="2.5" fill={C.gold} />
      <rect x={x} y="16" width={w} height="2" rx="1" fill={C.goldDeep} />
    </svg>
  );
}

const IconSingle = () => <BedIcon w={11} />;
const IconQueen = () => <BedIcon w={17} />;
const IconKing = () => <BedIcon w={23} />;

const IconFoamType = () => (
  <Layers
    layers={
      <>
        <Slab y={16} h={9} fill={C.red} deep={C.redDeep} />
        <Slab y={8} h={9} fill={C.cream} deep={C.creamDeep} />
        <circle cx="12" cy="12" r="1.1" fill={C.creamDeep} />
        <circle cx="19" cy="13" r="0.85" fill={C.creamDeep} />
      </>
    }
  />
);

const IconCoir = () => (
  <Layers
    layers={
      <>
        <Slab y={17} h={8} fill={C.goldDeep} deep={C.goldDeep} />
        <Slab y={8} h={10} fill={C.gold} deep={C.goldDeep} />
        {[10, 14, 18, 22].map((x) => (
          <path
            key={x}
            d={`M${x} 9.5v7`}
            stroke={C.goldDeep}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        ))}
      </>
    }
  />
);

const IconSpring = () => (
  <Layers
    layers={
      <>
        <Slab y={21} h={4} fill={C.creamDeep} deep={C.creamDeep} />
        {[10.5, 16, 21.5].map((cx) => (
          <g key={cx}>
            <rect x={cx - 2.6} y="9" width="5.2" height="12" rx="2.6" fill={C.ink} />
            <rect x={cx - 1.7} y="10" width="3.4" height="10" rx="1.7" fill={C.cream} />
          </g>
        ))}
        <Slab y={5} h={4} fill={C.cream} deep={C.creamDeep} />
      </>
    }
  />
);

const IconLatex = () => (
  <Layers
    layers={
      <>
        <Slab y={18} h={7} fill={C.redDeep} deep={C.redDeep} />
        <Slab y={7} h={12} fill={C.cream} deep={C.creamDeep} />
        {[[11, 11], [16, 14], [21, 11], [13.5, 16], [18.5, 16]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.15" fill={C.creamDeep} />
        ))}
      </>
    }
  />
);

const columns = [
  {
    id: "comfort",
    lead: "Shop by",
    word: "Comfort",
    items: [
      { name: "Firm Mattress", href: "/mattress", Icon: IconFirm },
      { name: "Medium Firm Mattress", href: "/mattress", Icon: IconMedium },
      { name: "Soft Mattress", href: "/mattress", Icon: IconSoft },
    ],
  },
  {
    id: "size",
    lead: "Shop by",
    word: "Size",
    items: [
      { name: "Single", href: "/mattress", Icon: IconSingle },
      { name: "Queen", href: "/mattress", Icon: IconQueen },
      { name: "King", href: "/mattress", Icon: IconKing },
    ],
  },
  {
    id: "type",
    lead: "Shop by",
    word: "Type",
    items: [
      { name: "Foam Mattress", href: "/mattress", Icon: IconFoamType },
      { name: "Rubberised Coir Mattress", href: "/mattress", Icon: IconCoir },
      { name: "Spring Mattress", href: "/mattress", Icon: IconSpring },
      { name: "Latex Mattress", href: "/mattress", Icon: IconLatex },
    ],
  },
];

export default function ShopByFilters() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-[#F7F8FA] pt-4 pb-8 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell-home-two"
      >
        <motion.div variants={fade}>
          <SectionLabel eyebrow="Find yours">
            Shop by <span className="font-bold text-brand">what matters</span>
          </SectionLabel>
        </motion.div>

        <motion.div
          variants={group}
          className="mt-5 grid gap-x-10 gap-y-7 md:mt-6 md:grid-cols-3 md:gap-x-12 lg:gap-x-16"
        >
          {columns.map((col) => (
            <motion.div key={col.id} variants={fade} className="min-w-0">
              <p className="text-[13px] text-ink/45">
                {col.lead}{" "}
                <span className="text-[15px] font-bold text-ink">{col.word}</span>
              </p>
              <span aria-hidden className="mt-2 block h-px w-full bg-ink/12" />

              <ul>
                {col.items.map((item) => (
                  <li key={item.name} className="border-b border-ink/10 last:border-b-0">
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3.5 py-3"
                    >
                      <span className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <item.Icon />
                      </span>
                      <span className="min-w-0 flex-1 text-[13.5px] font-medium text-ink transition-colors duration-300 group-hover:text-brand lg:text-[14px]">
                        {item.name}
                      </span>
                      <FiChevronRight className="shrink-0 text-[15px] text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
