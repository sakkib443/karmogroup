"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const features = [
  "Zero filler formulation ensuring 10+ years sag-free warranty.",
  "Poured, cured, and block-cut in Karmo's own automated chemical plants.",
  "Oeko-Tex Standard 100 non-toxic certified hypoallergenic foam.",
  "Trusted by top Bangladeshi furniture brands and luxury hotels.",
];

export default function FoamStoryThree() {
  return (
    <section className="w-full bg-[#FAFAFA] text-gray-900 py-24 md:py-32 font-['Inter',sans-serif] overflow-hidden border-b border-gray-100">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Content (Image & Overlay) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full rounded-sm overflow-hidden bg-gray-100 group shadow-sm hover:shadow-2xl transition-shadow duration-700"
          >
            <Image
              src="/karmo/images/products/spotlight-mattress-cutaway.png"
              alt="Karmo Foam Chemistry and Craftsmanship"
              fill
              className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03] filter brightness-[0.95] group-hover:brightness-100"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            
            {/* Overlay Box - High end glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 p-6 md:p-8 bg-white/90 backdrop-blur-xl text-gray-900 shadow-xl"
            >
              <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-red-600 mb-2">
                Since 1965
              </span>
              <h4 className="text-xl md:text-2xl font-medium tracking-tight uppercase leading-snug">
                60 Years of Polyurethane Excellence
              </h4>
              <p className="text-[13px] text-gray-500 font-light mt-3 leading-relaxed">
                Pioneering foam chemistry in Bangladesh with over 5 million satisfied households.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <div className="lg:col-span-6 flex flex-col justify-center py-10 lg:pl-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-red-600"></div>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
                The Karmo Promise
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] md:text-[42px] lg:text-[52px] font-medium leading-[1.15] tracking-[-0.02em] uppercase text-gray-900 mb-6"
            >
              Why Karmo Foam <br />
              <span className="text-red-600 font-bold">Stands Above The Rest</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-500 text-sm md:text-[15px] font-light leading-relaxed mb-10 max-w-lg"
            >
              Unlike third-party mattress assemblers, Karmo controls the entire chemistry of comfort — producing virgin polyurethane foam blocks in our own high-capacity manufacturing facilities.
            </motion.p>

            {/* Premium Checklist */}
            <div className="space-y-5 mb-12">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 transition-colors duration-300">
                    <FiCheck className="text-[11px] text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[14px] font-medium text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/foam"
                className="group inline-flex items-center justify-center gap-4 bg-gray-900 hover:bg-red-600 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Learn About Our Foam
                  <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
