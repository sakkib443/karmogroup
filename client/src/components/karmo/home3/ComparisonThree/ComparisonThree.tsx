"use client";

import { motion } from "framer-motion";
import { fade, group, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
import { FiCheck, FiX } from "react-icons/fi";

const features = [
  {
    name: "High-Resilience Pressure Relief",
    karmo: true,
    others: false,
  },
  {
    name: "CertiGuard Germ Protection",
    karmo: true,
    others: false,
  },
  {
    name: "100-Night Sleep Trial",
    karmo: true,
    others: false,
  },
  {
    name: "10-Year Warranty",
    karmo: true,
    others: true,
  },
  {
    name: "Zero Motion Transfer",
    karmo: true,
    others: false,
  },
];

export default function ComparisonThree() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="shell relative z-10 mx-auto max-w-5xl">
        <HeadingThree
          index="01"
          eyebrow="The Karmo Difference"
          title={["Why choose", <Mark key="m"> Karmo</Mark>]}
          className="mx-auto text-center"
        />

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 sm:mt-20 overflow-x-auto hide-scrollbar"
        >
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 items-end pb-6 border-b-2 border-ink">
              <div className="col-span-3"></div>
              <div className="col-span-1 text-center">
                <span className="display text-xl font-bold text-brand md:text-2xl">Karmo</span>
              </div>
              <div className="col-span-1 text-center">
                <span className="display text-lg font-medium text-ink/50 md:text-xl">Others</span>
              </div>
            </div>

            {/* Table Body */}
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fade}
                className="grid grid-cols-5 items-center py-5 border-b border-ink/10 transition-colors hover:bg-linen/50"
              >
                <div className="col-span-3 pr-4">
                  <span className="text-[15px] font-semibold text-ink sm:text-[17px]">
                    {feature.name}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
                  {feature.karmo ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <FiCheck className="text-lg" />
                    </div>
                  ) : (
                    <FiX className="text-ink/30 text-lg" />
                  )}
                </div>
                <div className="col-span-1 flex justify-center">
                  {feature.others ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-ink/40">
                      <FiCheck className="text-lg" />
                    </div>
                  ) : (
                    <FiX className="text-ink/30 text-lg" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
