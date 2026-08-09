"use client";

import { motion } from "framer-motion";
import { fade, group, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
import { FiWind, FiGlobe, FiFeather } from "react-icons/fi";

const initiatives = [
  {
    icon: <FiWind className="text-3xl text-brand" />,
    title: "CertiPUR-US® Certified",
    description: "Our foams are made without ozone depleters, PBDEs, or heavy metals, ensuring indoor air quality.",
  },
  {
    icon: <FiGlobe className="text-3xl text-brand" />,
    title: "Carbon Neutral Shipping",
    description: "We offset 100% of carbon emissions from shipping our mattresses direct to your door.",
  },
  {
    icon: <FiFeather className="text-3xl text-brand" />,
    title: "Recyclable Materials",
    description: "Built with high-grade recycled spring steel and naturally sourced organic cotton covers.",
  },
];

export default function SustainabilityThree() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32 border-t border-ink/5">
      <div className="shell relative z-10 mx-auto max-w-6xl">
        <HeadingThree
          index="04"
          eyebrow="Our Commitment"
          title={["Sleep well,", <Mark key="m"> live better</Mark>]}
          lead="We believe a good night's sleep shouldn't cost the earth. Our commitment to sustainability is woven into every mattress we craft."
          className="mx-auto text-center"
        />

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {initiatives.map((item, index) => (
            <motion.div
              key={index}
              variants={fade}
              className="flex flex-col items-center text-center px-6"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linen">
                {item.icon}
              </div>
              <h3 className="display mb-4 text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="body-copy text-[15px] leading-relaxed text-ink/70">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
