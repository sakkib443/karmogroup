"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const collections = [
  {
    title: "Karmo Bedding",
    subtitle: "Modular Foam & Premium Cotton",
    discount: "20% OFF",
    tagline: "High-density polyurethane seating and hotel-grade sateen linens built for ultimate comfort.",
    image: "/karmo/images/collections/best-selling.jpg",
    href: "/products",
    accent: "bg-red-600",
  },
  {
    title: "Ergonomic Sleeping",
    subtitle: "Microfiber & Contour Foam",
    discount: "Limited",
    tagline: "Designed to relieve cervical spine strain and provide breathable, deep night sleep.",
    image: "/karmo/images/collections/new-arrivals.jpg",
    href: "/products",
    accent: "bg-amber-600",
  },
  {
    title: "Orthopaedic Spine Care",
    subtitle: "Pocket Spring Core",
    discount: "15% OFF",
    tagline: "Zero motion transfer with reinforced lumbar support zones poured in-house.",
    image: "/karmo/images/collections/popular.jpg",
    href: "/products",
    accent: "bg-emerald-600",
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
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function CollectionsCarouselThree() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#FAFAFA] text-gray-900 py-24 md:py-32 font-['Inter',sans-serif] overflow-hidden">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-red-600"></div>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
                Featured Collections
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.1] tracking-[-0.02em] uppercase text-gray-900"
            >
              Curated Comfort <br />
              <span className="text-gray-400 font-light">For Every Room</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border-b border-gray-300 hover:border-red-600 pb-2 text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors duration-300"
            >
              View All Collections
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Collections Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-12"
        >
          {collections.map((col, idx) => (
            <motion.div
              variants={itemVariants}
              key={col.title}
              className="relative group flex flex-col"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="relative overflow-hidden bg-gray-100 w-full aspect-[4/5] md:aspect-[3/4] mb-8 group-hover:shadow-xl transition-shadow duration-700">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className={`object-cover transition-all duration-[1.2s] ease-[0.16,1,0.3,1] ${
                    hoveredIdx === idx ? "scale-105" : "scale-100"
                  } ${
                    hoveredIdx !== null && hoveredIdx !== idx ? "grayscale-[20%] brightness-95" : "grayscale-0 brightness-100"
                  }`}
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                
                {/* Overlay badge on hover */}
                <div className="absolute top-6 left-6 overflow-hidden">
                  <span className={`block px-4 py-1.5 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transform -translate-y-[150%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[0.16,1,0.3,1] delay-100 ${col.accent}`}>
                    {col.discount}
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1 px-2">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-600 mb-3">
                  {col.subtitle}
                </span>
                <h3 className="text-2xl lg:text-3xl font-medium text-gray-900 uppercase tracking-tight mb-4 group-hover:text-red-600 transition-colors duration-500">
                  {col.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 flex-1 max-w-[90%]">
                  {col.tagline}
                </p>

                {/* Animated Button */}
                <div className="mt-auto">
                  <Link
                    href={col.href}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 text-gray-400 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 ease-[0.16,1,0.3,1]"
                  >
                    <FiArrowRight className="text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
