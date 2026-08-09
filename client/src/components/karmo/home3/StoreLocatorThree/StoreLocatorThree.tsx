"use client";

import { motion } from "framer-motion";
import { fade, rise, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";

export default function StoreLocatorThree() {
  return (
    <section className="relative overflow-hidden bg-linen py-24 md:py-32">
      <div className="shell relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fade}
            className="flex flex-col justify-center"
          >
            <HeadingThree
              index="05"
              eyebrow="Experience Center"
              title={["Feel the", <Mark key="m"> Comfort</Mark>]}
              lead="Karmo Group is the first company in Bangladesh to have started the production of Polyurethane products in the bedding industry. We have started our Journey since 1965."
              className="mb-10"
            />

            <div className="space-y-6 border-l-2 border-brand pl-6">
              <div className="flex items-start gap-4">
                <FiMapPin className="mt-1 shrink-0 text-xl text-brand" />
                <div>
                  <p className="display font-semibold text-ink">Karmo Flagship Store</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/70">
                    4th Floor, 95, Motijheel, C/A 6th Ln,<br />
                    1000 Ibrahim Chamber(Lift:, Dhaka 1000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiClock className="mt-1 shrink-0 text-xl text-brand" />
                <div>
                  <p className="display font-semibold text-ink">Opening Hours</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/70">
                    Opens 9 AM Mon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiPhone className="mt-1 shrink-0 text-xl text-brand" />
                <div>
                  <p className="display font-semibold text-ink">Contact Us</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/70">
                    01713-483284
                  </p>
                </div>
              </div>
            </div>

            <motion.div variants={rise} className="mt-12">
              <a
                href="https://maps.google.com/maps?q=95,%20Motijheel,%20Dhaka%201000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand"
              >
                Get Directions
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Map Iframe */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fade}
            className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5] shadow-sm ring-1 ring-ink/5"
          >
            <iframe
              title="Karmo Group Store Location"
              src="https://maps.google.com/maps?q=95,%20Motijheel,%20Dhaka%201000&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
