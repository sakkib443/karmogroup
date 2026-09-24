"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const divisions = [
  {
    id: "foam",
    name: "Foam Craft",
    tagline: "Uncompromising Comfort",
    image: "/karmo/images/mattress/plant-bedroom.jpg",
    href: "/foam",
  },
  {
    id: "hometex",
    name: "HomeTex",
    tagline: "Art of Restful Living",
    image: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    href: "/hometex",
  },
  {
    id: "mattress",
    name: "Mattress",
    tagline: "Engineered for Sleep",
    image: "/karmo/images/mattress/cloud-poster.jpg",
    href: "/mattress",
  },
  {
    id: "chemicals",
    name: "Chemicals",
    tagline: "The Core Chemistry",
    image: "/karmo/images/mattress/suite-interior.jpg",
    href: "/chemicals",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function DivisionsShowcaseThree() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="w-full bg-white text-gray-900 py-20 md:py-32 font-['Inter',sans-serif] overflow-hidden">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-red-600"></div>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
              Our Core Divisions
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-red-600"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[36px] md:text-[48px] lg:text-[56px] font-medium leading-[1.1] tracking-[-0.02em] uppercase text-gray-900"
          >
            One Group, <br className="md:hidden" />
            <span className="text-red-600 font-bold relative inline-block">
              Four Crafts
              {/* Subtle red line under text */}
              <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-red-600/20 rounded-full" />
            </span>
          </motion.h2>
        </div>

        {/* 4 Image Columns */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-4 xl:gap-8"
        >
          {divisions.map((div, idx) => (
            <motion.div 
              variants={itemVariants}
              key={div.id}
              className="relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Link href={div.href} className="block w-full h-full relative cursor-pointer outline-none">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={div.image}
                    alt={div.name}
                    fill
                    className={`object-cover transition-all duration-[1.2s] ease-[0.16,1,0.3,1] ${
                      hoveredIdx === idx ? "scale-105" : "scale-100"
                    } ${
                      hoveredIdx !== null && hoveredIdx !== idx ? "grayscale-[40%] brightness-75" : "grayscale-0 brightness-[0.85] group-hover:brightness-100"
                    }`}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  
                  {/* Overlay Gradient for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-[1.2s] ease-[0.16,1,0.3,1] ${
                    hoveredIdx === idx ? "opacity-100" : "opacity-70"
                  }`} />

                  {/* Content inside the image */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]">
                    <div className="overflow-hidden mb-1">
                      <span className="block font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[0.16,1,0.3,1] delay-100">
                        {div.tagline}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl md:text-2xl text-white tracking-wide font-medium uppercase drop-shadow-md">
                        {div.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[0.6s] ease-[0.16,1,0.3,1] delay-150 group-hover:bg-red-600 group-hover:border-red-600">
                        <FiArrowRight className="text-lg -rotate-45 group-hover:rotate-0 transition-transform duration-[0.6s] ease-[0.16,1,0.3,1]" />
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic top progress line on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
