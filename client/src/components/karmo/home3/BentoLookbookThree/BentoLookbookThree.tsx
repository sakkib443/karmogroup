"use client";

import { motion } from "framer-motion";
import { fade, group, VIEWPORT } from "@/components/karmo/motion";
import Image from "next/image";

const images = {
  large: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
  topMiddle: "/karmo/images/interiors/bedroom-neutral.jpg",
  topRight: "/karmo/images/mattress/plant-bedroom.jpg",
  bottomRight: "/karmo/images/hero/legacy-slide-3-bedding.png",
};

export default function BentoLookbookThree() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-red-600"></div>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
              The Lookbook
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[32px] md:text-[42px] lg:text-[52px] font-medium leading-[1.15] tracking-[-0.02em] uppercase text-gray-900 mb-6"
          >
            Curated <br className="hidden sm:block" />
            <span className="text-red-600 font-bold">Inspiration</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-500 text-sm md:text-[15px] font-light leading-relaxed max-w-xl"
          >
            Explore our finest combinations of comfort, aesthetic, and precision. Designed to transform your bedroom into a sanctuary of rest.
          </motion.p>
        </div>

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 min-h-[600px] md:h-[700px] lg:h-[800px]"
        >
          {/* Large Left Featured Image */}
          <motion.div
            variants={fade}
            className="group relative overflow-hidden bg-linen md:col-span-2 md:row-span-2 w-full h-[400px] md:h-full"
          >
            <Image
              src={images.large}
              alt="Karmo Bedroom Lifestyle"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pr-6">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">
                The Art of Rest
              </span>
              <h3 className="display text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3">
                Ultimate Comfort
              </h3>
              <p className="body-copy text-[15px] text-white/90 max-w-md hidden md:block">
                Our signature collections are crafted to provide the perfect balance of support and softness, transforming your bedroom into a sanctuary.
              </p>
            </div>
          </motion.div>

          {/* Top Middle */}
          <motion.div
            variants={fade}
            className="group relative overflow-hidden bg-linen md:col-span-1 md:row-span-1 w-full h-[300px] md:h-full"
          >
            <Image
              src={images.topMiddle}
              alt="Karmo Fabric Details"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 pr-6">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">
                Premium Materials
              </span>
              <h3 className="display text-xl md:text-2xl font-semibold text-white">
                Breathable
              </h3>
            </div>
          </motion.div>

          {/* Top Right */}
          <motion.div
            variants={fade}
            className="group relative overflow-hidden bg-linen md:col-span-1 md:row-span-1 w-full h-[300px] md:h-full"
          >
            <Image
              src={images.topRight}
              alt="Karmo Mattress Anatomy"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 pr-6">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">
                Precision Craft
              </span>
              <h3 className="display text-xl md:text-2xl font-semibold text-white">
                Engineered
              </h3>
            </div>
          </motion.div>

          {/* Bottom Right (Spans 2 cols) */}
          <motion.div
            variants={fade}
            className="group relative overflow-hidden bg-linen md:col-span-2 md:row-span-1 w-full h-[300px] md:h-full"
          >
            <Image
              src={images.bottomRight}
              alt="Karmo Lifestyle Rest"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 pr-6">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">
                Deep Sleep
              </span>
              <h3 className="display text-2xl md:text-3xl font-semibold text-white">
                A Better Tomorrow
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
